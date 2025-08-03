import { type IStream, multicast, replayLatest, zipArray } from 'aelea/stream'

export function replayState<T>(s: IStream<T>, initialState?: T): IStream<T> {
  return replayLatest(multicast(s), initialState)
}

export type StateStream<T> = {
  [P in keyof T]: IStream<T[P]>
}

export function zipState<A, K extends keyof A = keyof A>(state: StateStream<A>): IStream<A> {
  const entries = Object.entries(state) as [keyof A, IStream<A[K]>][]
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
