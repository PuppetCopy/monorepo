import { continueWith, filter, fromPromise, map, now, periodic, takeWhile } from '@most/core'
import { disposeNone, disposeWith } from '@most/disposable'
import { currentTime } from '@most/scheduler'
import type { Disposable, Scheduler, Sink, Stream, Time } from '@most/types'
import { countdownFn, unixTimestampNow } from '../date.js'

export type StateParams<T> = {
  [P in keyof T]: Stream<T[P]> | T[P]
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

export const filterNull = <T>(prov: Stream<T | null>) => filter((ev): ev is T => ev !== null, prov)

export const mapPromise = <T, R>(mapFn: (x: T) => R, prov: Promise<T>) => fromPromise(prov.then(mapFn))

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
  private latestPromiseId = 0
  private isPending = false
  private isEnded = false

  constructor(
    private readonly sink: Sink<PromiseState<T>>,
    private readonly scheduler: Scheduler
  ) {}

  event(_t: Time, promise: Promise<T>): void {
    const promiseId = ++this.latestPromiseId

    if (!this.isPending) {
      this.isPending = true
      this.sink.event(currentTime(this.scheduler), { status: PromiseStatus.PENDING })
    }

    promise.then(
      (value) => this.handleResult(promiseId, { status: PromiseStatus.DONE, value }),
      (error) =>
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
    this.sink.event(currentTime(this.scheduler), state)
  }

  end(): void {
    this.isEnded = true
    this.sink.end(currentTime(this.scheduler))
  }

  error(_t: Time, e: Error): void {
    this.sink.error(currentTime(this.scheduler), e)
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

export type Adapter<A, B> = [(event: A) => void, Stream<B>]

export const createAdapter = <A>(): Adapter<A, A> => {
  const sinks: { sink: Sink<A>; scheduler: Scheduler }[] = []
  return [(a) => broadcast(sinks, a), new FanoutPortStream(sinks)]
}

const broadcast = <A>(sinks: { sink: Sink<A>; scheduler: Scheduler }[], a: A): void =>
  sinks.slice().forEach(({ sink, scheduler }) => tryEvent(scheduler.currentTime(), a, sink))

export class FanoutPortStream<A> {
  constructor(private readonly sinks: { sink: Sink<A>; scheduler: Scheduler }[]) {}

  run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    const s = { sink, scheduler }
    this.sinks.push(s)
    return new RemovePortDisposable(s, this.sinks)
  }
}

export class RemovePortDisposable<A> implements Disposable {
  constructor(
    private readonly sink: { sink: Sink<A>; scheduler: Scheduler },
    private readonly sinks: { sink: Sink<A>; scheduler: Scheduler }[]
  ) {}

  dispose() {
    const i = this.sinks.indexOf(this.sink)
    if (i >= 0) {
      this.sinks.splice(i, 1)
    }
  }
}

function tryEvent<A>(t: Time, a: A, sink: Sink<A>) {
  try {
    sink.event(t, a)
  } catch (e) {
    sink.error(t, e as Error)
  }
}
