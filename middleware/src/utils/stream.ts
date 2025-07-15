import {
  at,
  awaitPromises,
  constant,
  continueWith,
  empty,
  filter,
  fromPromise,
  map,
  merge,
  multicast,
  now,
  periodic,
  recoverWith,
  switchLatest,
  takeWhile,
  tap,
  zipArray
} from '@most/core'
import { disposeBoth, disposeNone, disposeWith } from '@most/disposable'
import { currentTime } from '@most/scheduler'
import type { Scheduler, Sink, Stream, Time } from '@most/types'
import { type IOps, nullSink, O, replayLatest, switchMap } from 'aelea/core'
import type {
  Abi,
  ContractEventName,
  PublicClient,
  Transport,
  WatchContractEventOnLogsParameter,
  WatchContractEventParameters
} from 'viem'
import { countdownFn, unixTimestampNow } from './utils.js'

export type StateParams<T> = {
  [P in keyof T]: Stream<T[P]> | T[P]
}
export type StateStream<T> = {
  [P in keyof T]: Stream<T[P]>
}

export function takeUntilLast<T>(fn: (t: T) => boolean, s: Stream<T>) {
  let last: T

  return continueWith(
    () => now(last),
    takeWhile((x) => {
      const res = !fn(x)
      last = x
      return res
    }, s)
  )
}

export function zipState<A, K extends keyof A = keyof A>(state: StateStream<A>): Stream<A> {
  const entries = Object.entries(state) as [keyof A, Stream<A[K]>][]
  const streams = entries.map(([_, stream]) => stream)

  const zipped = zipArray((...arrgs: A[K][]) => {
    return arrgs.reduce((seed, val, idx) => {
      const key = entries[idx][0]
      seed[key] = val

      return seed
    }, {} as A)
  }, streams)

  return zipped
}

export const filterNull = <T>(prov: Stream<T | null>) => filter((ev): ev is T => ev !== null, prov)

export const mapPromise = <T, R>(mapFn: (x: T) => R, prov: Promise<T>) => fromPromise(prov.then(mapFn))

export interface IPeriodRun<T> {
  actionOp: IOps<number, Promise<T>>

  interval?: number
  startImmediate?: boolean
  recoverError?: boolean
  maxRetries?: number
  maxInterval?: number
}
export const periodicRun = <T>({
  actionOp,
  interval = 1000,
  startImmediate = true,
  recoverError = true
}: IPeriodRun<T>): Stream<T> => {
  const tickDelay = at(interval, null)
  const tick = startImmediate ? merge(now(null), tickDelay) : tickDelay

  return O(
    constant(performance.now()),
    actionOp,
    awaitPromises,
    recoverError
      ? recoverWith((err) => {
          console.error(err)

          return periodicRun({ interval: interval * 2, actionOp, recoverError, startImmediate: false })
        })
      : O(),
    continueWith(() => {
      return periodicRun({ interval, actionOp, recoverError, startImmediate: false })
    })
  )(tick)
}

export const runRecover = <T>(source: Stream<Promise<T>>, recoveryDelay = 1000): Stream<T> => {
  const runAndAwait = awaitPromises(source)
  const runAndRecover = recoverWith((err) => {
    console.error(err)

    const startAt = at(recoveryDelay, null)
    return switchMap(() => runRecover(source, recoveryDelay * 2), startAt)
  }, runAndAwait)

  return runAndRecover
}

export interface IPeriodSample {
  interval?: number
  startImmediate?: boolean
  recoverError?: boolean
}

const defaultSampleArgs = { interval: 1000, startImmediate: true, recoverError: true }

export const periodicSample = <T>(sample: Stream<T>, options: IPeriodSample = defaultSampleArgs): Stream<T> => {
  const params = { ...defaultSampleArgs, ...options }

  const tickDelay = at(params.interval, null)
  const tick = params.startImmediate ? merge(now(null), tickDelay) : tickDelay

  return O(
    constant(performance.now()),
    map(() => sample),
    switchLatest,
    params.recoverError
      ? recoverWith((err) => {
          console.error(err)

          return periodicSample(sample, { ...params, interval: params.interval * 2 })
        })
      : O(),
    continueWith(() => {
      return periodicSample(sample, { ...params, startImmediate: false })
    })
  )(tick)
}

export const switchFailedSources = <T>(sourceList: Stream<T>[], activeSource = 0): Stream<T> => {
  const source = sourceList[activeSource]
  return recoverWith((err) => {
    console.warn(err)
    const nextActive = activeSource + 1
    if (!sourceList[nextActive]) {
      console.warn(new Error('No sources left to recover with'))

      return empty()
    }

    return switchFailedSources(sourceList, nextActive)
  }, source)
}

export function importGlobal<T>(queryCb: () => Promise<T>): Stream<T> {
  let cacheQuery: Promise<T> | null = null

  return {
    run(sink, scheduler) {
      if (cacheQuery === null) {
        cacheQuery = queryCb()
      }

      cacheQuery
        .then((res) => {
          sink.event(scheduler.currentTime(), res)
        })
        .catch((err) => {
          sink.error(scheduler.currentTime(), err as Error)
        })

      return disposeNone()
    }
  }
}

export const everySec = map(unixTimestampNow, periodic(1000))

export const countdown = (targetDate: number) => {
  return map((now) => countdownFn(targetDate, now), everySec)
}

export const ignoreAll = filter(() => false)

export enum PromiseStatus {
  DONE,
  PENDING,
  ERROR
}

export type PromiseStateDone<T> = { status: PromiseStatus.DONE; value: T }
export type PromiseStatePending = { status: PromiseStatus.PENDING }
export type PromiseStateError = { status: PromiseStatus.ERROR; error: Error }
export type PromiseState<T> = PromiseStateDone<T> | PromiseStatePending | PromiseStateError

export const promiseState = <T>(querySrc: Stream<Promise<T>>): Stream<PromiseState<T>> => {
  return {
    run(sink, scheduler) {
      return querySrc.run(new PromiseStateSink(sink, scheduler), scheduler)
    }
  }
}

class PromiseStateSink<T> implements Sink<Promise<T>> {
  private queue: Promise<unknown>

  constructor(
    private readonly sink: Sink<PromiseState<T>>,
    private readonly scheduler: Scheduler
  ) {
    this.sink = sink
    this.scheduler = scheduler
    this.queue = Promise.resolve()
  }

  event(_t: Time, promise: Promise<T>): void {
    this.eventBound({ status: PromiseStatus.PENDING })

    this.queue = this.queue.then(() => this.handlePromise(promise)).catch(this.errorBound)
  }

  end(): void {
    this.queue = this.queue.then(this.endBound).catch(this.errorBound)
  }

  error(_t: Time, e: Error): void {
    // Don't resolve error values, propagate directly
    this.queue = this.queue.then(() => this.errorBound(e)).catch(fatalError)
  }

  private async handlePromise(promise: Promise<T>): Promise<void> {
    const x = await promise
    return this.eventBound({ status: PromiseStatus.DONE, value: x })
  }

  // Pre-create closures, to avoid creating them per event
  private eventBound = (x: PromiseState<T>): void => this.sink.event(currentTime(this.scheduler), x)
  private endBound = (): void => this.sink.end(currentTime(this.scheduler))
  private errorBound = (error: Error): void => this.eventBound({ status: PromiseStatus.ERROR, error })
}

function fatalError(e: unknown): void {
  setTimeout(rethrow, 0, e)
}

function rethrow(e: unknown): never {
  throw e
}

export function replayState<T>(s: Stream<T>, initialState?: T): Stream<T> {
  return replayLatest(multicast(s), initialState)
}

export function fromWebsocket<OUTPUT, INPUT>(
  url: string,
  input: Stream<INPUT> = empty(),
  protocols: string | string[] | undefined = undefined
): Stream<OUTPUT> {
  return {
    run(sink, scheduler) {
      const socket = new WebSocket(url, protocols)
      const messageBuffer: INPUT[] = []

      const onError = (error: Event) => {
        const errorMsg = error instanceof ErrorEvent ? error.message : 'WebSocket connection error'
        sink.error(scheduler.currentTime(), new Error(`WebSocket error: ${errorMsg}`))
      }

      const onMessage = (msg: MessageEvent) => {
        try {
          const data = JSON.parse(msg.data)
          sink.event(scheduler.currentTime(), data)
        } catch (parseError) {
          sink.error(scheduler.currentTime(), new Error(`JSON parse error: ${parseError}`))
        }
      }

      const sendMessage = (value: INPUT) => {
        try {
          socket.send(JSON.stringify(value))
        } catch (sendError) {
          console.warn('Failed to send WebSocket message:', sendError)
        }
      }

      const onOpen = () => {
        // Send any buffered messages
        while (messageBuffer.length > 0) {
          const message = messageBuffer.shift()!
          sendMessage(message)
        }
      }

      const onClose = () => {
        cleanup()
        sink.end(scheduler.currentTime())
      }

      const cleanup = () => {
        socket.removeEventListener('error', onError)
        socket.removeEventListener('message', onMessage)
        socket.removeEventListener('open', onOpen)
        socket.removeEventListener('close', onClose)
      }

      socket.addEventListener('error', onError)
      socket.addEventListener('message', onMessage)
      socket.addEventListener('open', onOpen)
      socket.addEventListener('close', onClose)

      // Handle input stream
      const sendInputEffect = tap((value: INPUT) => {
        if (socket.readyState === WebSocket.OPEN) {
          sendMessage(value)
        } else if (socket.readyState === WebSocket.CONNECTING) {
          messageBuffer.push(value)
        }
      }, input).run(nullSink, scheduler)

      const disposeSocket = disposeWith(() => {
        cleanup()
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close()
        }
      }, socket)

      return disposeBoth(disposeSocket, sendInputEffect)
    }
  }
}

export function flattenEvents<T>(source: Stream<T[]>): Stream<T> {
  return {
    run(sink, scheduler) {
      return source.run(
        {
          event: (time, items) => {
            if (!Array.isArray(items)) {
              sink.error(time, new Error(`flattenEvents: expected array but got ${typeof items}`))
              return
            }

            for (const item of items) {
              sink.event(time, item)
            }
          },
          error: (time, error) => sink.error(time, error), // Use original time
          end: (time) => sink.end(time)
        },
        scheduler
      )
    }
  }
}

export function bufferEvents<T>(source: Stream<T>, period = 1000): Stream<readonly T[]> {
  if (period <= 0) {
    throw new Error('Buffer period must be positive')
  }

  return {
    run(sink, scheduler) {
      let buffer: T[] = []
      let lastEmitTime: number | null = null // Don't initialize until first event

      const onEvent = (time: number, event: T) => {
        buffer.push(event)

        if (lastEmitTime === null || time - lastEmitTime >= period) {
          const bufferToEmit = buffer
          buffer = []
          lastEmitTime = time
          sink.event(time, bufferToEmit)
        }
      }

      const onError = (time: number, error: Error) => sink.error(time, error)

      const onEnd = (time: number) => {
        if (buffer.length > 0) {
          sink.event(time, buffer)
        }
        sink.end(time)
      }

      const disposable = source.run({ event: onEvent, error: onError, end: onEnd }, scheduler)

      return disposeWith(() => {
        buffer = []
        disposable.dispose()
      }, disposable)
    }
  }
}

export const watchContractEvent = <
  transport extends Transport,
  const abi extends Abi,
  eventName extends ContractEventName<abi>,
  strict extends boolean | undefined = undefined
>(
  client: PublicClient,
  params: Omit<WatchContractEventParameters<abi, eventName, strict, transport>, 'onLogs' | 'onError'>
): Stream<WatchContractEventOnLogsParameter<abi, eventName, strict extends undefined ? true : strict>> => {
  return {
    run(sink, scheduler) {
      const removeListenerFn = client.watchContractEvent({
        ...params,
        onLogs: (
          logList: WatchContractEventOnLogsParameter<abi, eventName, strict extends undefined ? true : strict>
        ) => {
          sink.event(scheduler.currentTime(), logList)
        },
        onError: (err: Error) => {
          sink.error(scheduler.currentTime(), err)
        }
      } as any) // Type assertion needed due to Viem's complex transport constraints

      return disposeWith(removeListenerFn, null)
    }
  }
}
