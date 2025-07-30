import { multicast, zipArray } from '@most/core'
import type { Stream } from '@most/types'
import { replayLatest } from 'aelea/core'

export function replayState<T>(s: Stream<T>, initialState?: T): Stream<T> {
  return replayLatest(multicast(s), initialState)
}

export type StateStream<T> = {
  [P in keyof T]: Stream<T[P]>
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
