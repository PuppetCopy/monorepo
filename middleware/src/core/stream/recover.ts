import {
  at,
  continueWith,
  curry2,
  fromPromise,
  type IOps,
  type IStream,
  joinMap,
  now,
  op,
  switchLatest,
  switchMap
} from 'aelea/stream'
import { stream } from 'aelea/stream-extended'
import { IntervalTime } from '../../const/common.js'

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
  recoverMessage?: string
  recoverTime?: number // Default is 10 minutes
}

export interface IRecoverCurry {
  <A>(config: IRecoverConfig<A>, s: IStream<A>): IStream<A>
  <A>(config: IRecoverConfig<A>): (s: IStream<A>) => IStream<A>
}

export const recover: IRecoverCurry = curry2((config, source) => {
  const { recoverMessage = 'Stream error detected', recoverTime = 600_000 } = config

  return stream((sink, scheduler) => {
    let lastRecoveryTime = 0

    const attemptRecover = (): IStream<any> => {
      return continueWith(() => {
        const now = scheduler.time()
        const timeElapsed = now - lastRecoveryTime
        const delayTime =
          recoverTime > timeElapsed
            ? recoverTime - timeElapsed //
            : 0

        lastRecoveryTime = now
        console.warn(`${recoverMessage} (next attempt in ${delayTime}ms)`)

        // Return the source after delay, wrapped with recover using updated delay
        return op(
          at(delayTime, null),
          switchMap(() => {
            return attemptRecover()
          })
        )
      }, source)
    }

    return attemptRecover().run(sink, scheduler)
  })
})
