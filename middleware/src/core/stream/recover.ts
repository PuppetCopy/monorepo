import { at, continueWith, fromPromise, type IOps, type IStream, joinMap, now, switchLatest } from 'aelea/stream'

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

export interface IRecoverConfig {
  delay: number
  message?: string
  backoffMultiplier?: number
  maxDelay?: number
}

export function recover<T>(config: IRecoverConfig | number): (source: IStream<T>) => IStream<T>
export function recover<T>(config: IRecoverConfig | number, source: IStream<T>): IStream<T>
export function recover<T>(config: IRecoverConfig | number, source?: IStream<T>) {
  // Normalize config
  const recoverConfig: IRecoverConfig = typeof config === 'number' ? { delay: config } : config

  const {
    delay,
    message = `Stream error detected, recovering in ${delay}ms...`,
    backoffMultiplier = 2,
    maxDelay = 300000 // 5 minutes max
  } = recoverConfig

  const recoverImpl =
    (currentDelay: number) =>
    (src: IStream<T>): IStream<T> =>
      continueWith(() => {
        console.warn(`⚠️ ${message}`)
        const nextDelay = Math.min(currentDelay * backoffMultiplier, maxDelay)
        return switchLatest(at(currentDelay, recoverImpl(nextDelay)(src)))
      }, src)

  // If source is provided, apply immediately
  if (source) {
    return recoverImpl(delay)(source)
  }

  // Otherwise return curried function
  return recoverImpl(delay)
}
