import type { IStream } from 'aelea/stream'
import { curry2, filter, fromPromise, map, periodic } from 'aelea/stream'
import { stream } from 'aelea/stream-extended'
import { countdownFn, unixTimestampNow } from '../date.js'

export const mapPromise = <T, R>(mapFn: (x: T) => R, prov: Promise<T>) => fromPromise(prov.then(mapFn))

export const everySec = map(unixTimestampNow, periodic(1000, null))

export const countdown = (targetDate: number) => {
  return map(now => countdownFn(targetDate, now), everySec)
}

export const ignoreAll = filter(() => false)

export interface IEndWithCurry {
  <T>(f: (value: T) => boolean, s: IStream<T>): IStream<T>
  <T>(f: (value: T) => boolean): (s: IStream<T>) => IStream<T>
}

export const endWith: IEndWithCurry = curry2(
  <T>(f: (value: T) => boolean, source: IStream<T>): IStream<T> =>
    stream((sink, scheduler) => {
      let ended = false
      const sourceDisposable = source.run(
        {
          event(data) {
            sink.event(data)

            try {
              if (f(data)) {
                sink.end()
                sourceDisposable[Symbol.dispose]() // Dispose source stream
                ended = true
              }
            } catch (error) {
              sink.error(error)
            }
          },
          error(err) {
            if (ended) return

            sink.error(err)
          },
          end() {
            if (ended) return

            sink.end()
          }
        },
        scheduler
      )
      return sourceDisposable
    })
)
