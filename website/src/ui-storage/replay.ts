import {
  disposeBoth,
  type IScheduler,
  type ISink,
  type IStream,
  multicast,
  PipeSink,
  propagateRunEventTask
} from 'aelea/stream'

export const replayState = <T>(source: IStream<T>, initialState?: T): IStream<T> =>
  new ReplayLatest(multicast(source), initialState)

class StateSink<A> extends PipeSink<A> {
  constructor(
    readonly parent: ReplayLatest<A>,
    sink: ISink<A>
  ) {
    super(sink)
  }

  event(x: A): void {
    this.parent.latestValue = x
    this.parent.hasValue = true
    this.sink.event(x)
  }
}

function emitCachedValue<A>(sink: ISink<A>, value: A): void {
  sink.event(value)
}

export class ReplayLatest<A> implements IStream<A> {
  latestValue: A | undefined
  hasValue = false

  constructor(
    readonly source: IStream<A>,
    readonly initialState?: A
  ) {
    if (initialState !== undefined) {
      this.latestValue = initialState
      this.hasValue = true
    }
  }

  run(sink: ISink<A>, scheduler: IScheduler): Disposable {
    // Subscribe to source with StateSink to capture future values
    const sourceDisposable = this.source.run(new StateSink(this, sink), scheduler)

    // If we have a cached value, emit it asynchronously
    if (this.hasValue) {
      const cachedDisposable = scheduler.asap(
        propagateRunEventTask(sink, scheduler, emitCachedValue, this.latestValue!)
      )
      return disposeBoth(cachedDisposable, sourceDisposable)
    }

    return sourceDisposable
  }
}
