import type { IScheduler, ISink, IStream } from 'aelea/stream'
import { disposeWith, filter, fromPromise, map, periodic, stream } from 'aelea/stream'
import { countdownFn, unixTimestampNow } from '../date.js'

export type StateParams<T> = {
  [P in keyof T]: IStream<T[P]>
}

export const mapPromise = <T, R>(mapFn: (x: T) => R, prov: Promise<T>) => fromPromise(prov.then(mapFn))

export const everySec = map(unixTimestampNow, periodic(1000, null))

export const countdown = (targetDate: number) => {
  return map(now => countdownFn(targetDate, now), everySec)
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

export const promiseState = <T>(querySrc: IStream<Promise<T>>): IStream<PromiseState<T>> => {
  return stream((sink, scheduler) => querySrc.run(new PromiseStateSink(sink), scheduler))
}

class PromiseStateSink<T> implements ISink<Promise<T>> {
  private latestPromiseId = 0
  private isPending = false
  private isEnded = false

  constructor(private readonly sink: ISink<PromiseState<T>>) {}

  event(promise: Promise<T>): void {
    const promiseId = ++this.latestPromiseId

    if (!this.isPending) {
      this.isPending = true
      this.sink.event({ status: PromiseStatus.PENDING })
    }

    promise.then(
      value => this.handleResult(promiseId, { status: PromiseStatus.DONE, value }),
      error =>
        this.handleResult(promiseId, {
          status: PromiseStatus.ERROR,
          error: error instanceof Error ? error : new Error(String(error))
        })
    )
  }

  private handleResult(promiseId: number, state: PromiseState<T>): void {
    // Must check isEnded because promises can resolve after stream ends
    if (this.isEnded || promiseId !== this.latestPromiseId) return

    this.isPending = false
    this.sink.event(state)
  }

  end(): void {
    this.isEnded = true
    this.sink.end()
  }

  error(e: unknown): void {
    this.sink.error(e)
  }
}

export function flattenEvents<T>(source: IStream<T[]>): IStream<T> {
  return {
    run(sink, scheduler) {
      return source.run(
        {
          event: items => {
            if (!Array.isArray(items)) {
              sink.error(new Error(`flattenEvents: expected array but got ${typeof items}`))
              return
            }

            for (const item of items) {
              sink.event(item)
            }
          },
          error: error => sink.error(error),
          end: () => sink.end()
        },
        scheduler
      )
    }
  }
}

export function bufferEvents<T>(
  source: IStream<T>,
  period = 1000,
  maxSize = Number.POSITIVE_INFINITY
): IStream<readonly T[]> {
  if (period <= 0) {
    throw new Error('Buffer period must be positive')
  }
  if (maxSize <= 0) {
    throw new Error('Max buffer size must be positive')
  }

  return {
    run(sink, scheduler) {
      let buffer: T[] = []
      let nextEmitTime: number | null = null

      const emitBuffer = (time: number) => {
        if (buffer.length > 0) {
          sink.event(buffer)
          buffer = []
        }
        nextEmitTime = time + period
      }

      const onEvent = (event: T) => {
        const time = scheduler.time()
        // Initialize timing on first event
        if (nextEmitTime === null) {
          nextEmitTime = time + period
        }

        buffer.push(event)

        // Emit if period elapsed or buffer full
        if (time >= nextEmitTime || buffer.length >= maxSize) {
          emitBuffer(time)
        }
      }

      const onError = (error: unknown) => sink.error(error)

      const onEnd = () => {
        if (buffer.length > 0) {
          sink.event(buffer)
        }
        sink.end()
      }

      const disposable = source.run({ event: onEvent, error: onError, end: onEnd }, scheduler)

      return disposeWith(() => {
        buffer = []
        disposable[Symbol.dispose]()
      })
    }
  }
}

export type Adapter<A, B> = [(event: A) => void, IStream<B>]

export const createAdapter = <A>(): Adapter<A, A> => {
  const sinks: { sink: ISink<A>; scheduler: IScheduler }[] = []
  return [a => broadcast(sinks, a), new FanoutPortStream(sinks)]
}

const broadcast = <A>(sinks: { sink: ISink<A>; scheduler: IScheduler }[], a: A): void =>
  sinks.slice().forEach(({ sink }) => tryEvent(a, sink))

export class FanoutPortStream<A> implements IStream<A> {
  constructor(private readonly sinks: { sink: ISink<A>; scheduler: IScheduler }[]) {}

  run(sink: ISink<A>, scheduler: IScheduler): Disposable {
    const s = { sink, scheduler }
    this.sinks.push(s)
    return new RemovePortDisposable(s, this.sinks)
  }
}

export class RemovePortDisposable<A> implements Disposable {
  constructor(
    private readonly sink: { sink: ISink<A>; scheduler: IScheduler },
    private readonly sinks: { sink: ISink<A>; scheduler: IScheduler }[]
  ) {}

  dispose() {
    const i = this.sinks.indexOf(this.sink)
    if (i >= 0) {
      this.sinks.splice(i, 1)
    }
  }

  [Symbol.dispose]() {
    this.dispose()
  }
}

function tryEvent<A>(a: A, sink: ISink<A>) {
  try {
    sink.event(a)
  } catch (e) {
    sink.error(e as Error)
  }
}
