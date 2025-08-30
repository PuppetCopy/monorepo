import {
  at,
  atWith,
  continueWith,
  curry2,
  fromPromise,
  type IOps,
  type IStream,
  switchLatest,
  switchMap
} from 'aelea/stream'
import { stream } from 'aelea/stream-extended'

export interface IRunPeriodically<T> {
  actionOp: IOps<number, Promise<T>>
  interval?: number
  startImmediate?: boolean
}

export const periodicRun = <T>({
  actionOp, //
  interval = 1000,
  startImmediate = true
}: IRunPeriodically<T>): IStream<T> => {
  const run = actionOp(atWith(startImmediate ? 0 : interval, x => x))
  const awaitExecution = switchMap(fromPromise, run)
  const runArgs = { actionOp, interval, startImmediate: false }

  return continueWith(() => periodicRun<T>(runArgs), awaitExecution)
}

export interface IRecoverConfig<T> {
  recoverTime?: number // Default is 10 minutes
  recoverWith?: (source: IStream<T>, nextRetryTime: number) => IStream<T>

  lastRuntime?: number
}

export interface IRecoverCurry {
  <A>(config: IRecoverConfig<A>, s: IStream<A>): IStream<A>
  <A>(config: IRecoverConfig<A>): (s: IStream<A>) => IStream<A>
}
export const recover: IRecoverCurry = curry2((config, source) => {
  const { recoverTime = 10_000, recoverWith, lastRuntime } = config

  return stream((sink, scheduler) =>
    continueWith(time => {
      const timeElapsed = time - (lastRuntime ?? 0)
      const delayTime = recoverTime > timeElapsed ? recoverTime - timeElapsed : 0

      // Create fresh recovery on each error to avoid memory accumulation
      const recoveredSource = recoverWith ? recoverWith(source, delayTime) : source

      // Wrap with recover again, creating a fresh instance each time
      const wrappedSource = recover(
        {
          lastRuntime: time + delayTime,
          recoverTime,
          recoverWith
        },
        recoveredSource
      )

      const nextStream =
        delayTime > 0
          ? switchLatest(at(delayTime, wrappedSource)) //
          : wrappedSource
      // Delay before retrying
      return nextStream
    }, source).run(sink, scheduler)
  )
})
