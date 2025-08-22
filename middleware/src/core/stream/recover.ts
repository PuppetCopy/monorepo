import { at, continueWith, curry2, fromPromise, type IOps, type IStream, joinMap, now, switchMap } from 'aelea/stream'
import { stream } from 'aelea/stream-extended'

export interface IRunPeriodically<T> {
  actionOp: IOps<void, Promise<T>>
  interval?: number
  startImmediate?: boolean
}
export const periodicRun = <T>({
  actionOp, //
  interval = 1000,
  startImmediate = true
}: IRunPeriodically<T>): IStream<T> => {
  const run = startImmediate
    ? actionOp(now(undefined)) //
    : actionOp(at(interval, undefined))
  const awaitExecution = joinMap(fromPromise, run)
  const runArgs = { actionOp, interval, startImmediate: false }

  return continueWith(() => periodicRun<T>(runArgs), awaitExecution)
}

export interface IRecoverConfig<T> {
  recoverTime?: number // Default is 10 minutes
  recoverWith?: (source: IStream<T>) => IStream<T>

  lastRuntime?: number
}

export interface IRecoverCurry {
  <A>(config: IRecoverConfig<A>, s: IStream<A>): IStream<A>
  <A>(config: IRecoverConfig<A>): (s: IStream<A>) => IStream<A>
}
export const recover: IRecoverCurry = curry2((config, source) => {
  const { recoverTime = 10_000, recoverWith, lastRuntime } = config

  return stream((sink, scheduler) =>
    continueWith(() => {
      const time = scheduler.time()
      const timeElapsed = time - (lastRuntime ?? 0)
      const delayTime = recoverTime > timeElapsed ? recoverTime - timeElapsed : 0

      // Create fresh recovery on each error to avoid memory accumulation
      const recoveredSource = recoverWith ? recoverWith(source) : source

      // Wrap with recover again, creating a fresh instance each time
      const wrappedSource = recover(
        {
          lastRuntime: time + delayTime,
          recoverTime,
          recoverWith
        },
        recoveredSource
      )

      // Delay before retrying
      return switchMap(() => wrappedSource, at(delayTime, null))
    }, source).run(sink, scheduler)
  )
})
