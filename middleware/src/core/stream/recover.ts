import {
  at,
  continueWith,
  curry2,
  fromPromise,
  type IOps,
  type IStream,
  joinMap,
  now,
  switchLatest
} from 'aelea/stream'

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

export const recover: IRecoverCurry = curry2((recoveryDelay, source) =>
  continueWith(
    () => switchLatest(at(recoveryDelay, recover(recoveryDelay * 2, source))), //
    source
  )
)

export interface IRecoverCurry {
  <T>(recoveryDelay: number, source: IStream<T>): IStream<T>
  <T>(recoveryDelay: number): (source: IStream<T>) => IStream<T>
}
