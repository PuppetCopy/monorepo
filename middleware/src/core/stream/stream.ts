import type { IScheduler, ISink, IStream } from 'aelea/stream'
import { filter, fromPromise, map, periodic } from 'aelea/stream'
import { countdownFn, unixTimestampNow } from '../date.js'

export const mapPromise = <T, R>(mapFn: (x: T) => R, prov: Promise<T>) => fromPromise(prov.then(mapFn))

export const everySec = map(unixTimestampNow, periodic(1000, null))

export const countdown = (targetDate: number) => {
  return map(now => countdownFn(targetDate, now), everySec)
}

export const ignoreAll = filter(() => false)

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
