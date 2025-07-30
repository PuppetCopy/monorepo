import { at, awaitPromises, continueWith, empty, now, recoverWith } from '@most/core'
import type { Stream } from '@most/types'
import { type IOps, switchMap } from 'aelea/core'

export interface IRunPeriodically<T> {
  actionOp: IOps<any, Promise<T>>
  interval?: number
  startImmediate?: boolean
}
export const periodicRun = <T>({
  actionOp, //
  interval = 1000,
  startImmediate = true
}: IRunPeriodically<T>): Stream<T> => {
  const run = startImmediate
    ? actionOp(now(undefined)) //
    : actionOp(at(interval, undefined))
  const awaitExecution = awaitPromises(run)
  const runArgs = { actionOp, interval, startImmediate: false }

  return continueWith(() => periodicRun<T>(runArgs), awaitExecution)
}

export const recover = <T>(source: Stream<T>, recoveryDelay = 1000): Stream<T> => {
  const startAt = at(recoveryDelay, null)
  const recoverFn = () => recover(source, recoveryDelay * 2)
  const scheduleRecover = switchMap(recoverFn, startAt)
  const runAndRecover = continueWith(() => scheduleRecover, source)

  return runAndRecover
}

export const switchFailedSources = <T>(sourceList: Stream<T>[], activeSource = 0): Stream<T> => {
  const source = sourceList[activeSource]
  return recoverWith((err) => {
    console.warn(err)
    const nextActive = activeSource + 1
    if (!sourceList[nextActive]) {
      console.warn(new Error('No sources left to recover with'))

      return empty()
    }

    return switchFailedSources(sourceList, nextActive)
  }, source)
}
