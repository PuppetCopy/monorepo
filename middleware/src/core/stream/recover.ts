import { at, continueWith, fromPromise, type IOps, type IStream, joinMap, now, switchMap } from 'aelea/stream'

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

export const recover = <T>(source: IStream<T>, recoveryDelay = 1000): IStream<T> => {
  const startAt = at(recoveryDelay, null)
  const recoverFn = () => recover(source, recoveryDelay * 2)
  const scheduleRecover = switchMap(recoverFn, startAt)
  const runAndRecover = continueWith(() => scheduleRecover, source)

  return runAndRecover
}
