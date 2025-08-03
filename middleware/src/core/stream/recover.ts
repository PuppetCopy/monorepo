import { at, continueWith, type IOps, type IStream, now, switchMap } from 'aelea/stream'

// Custom implementation of awaitPromises since it's not in aelea/stream
function awaitPromises<T>(stream: IStream<Promise<T>>): IStream<T> {
  return {
    run(scheduler, sink) {
      return stream.run(scheduler, {
        event(promise) {
          promise.then(
            (value) => sink.event(value),
            (error) => sink.error(error)
          )
        },
        error(err) {
          sink.error(err)
        },
        end() {
          sink.end()
        }
      })
    }
  }
}

export interface IRunPeriodically<T> {
  actionOp: IOps<any, Promise<T>>
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
  const awaitExecution = awaitPromises(run)
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
