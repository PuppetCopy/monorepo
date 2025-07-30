import { disposeWith } from '@most/disposable'
import type { Stream } from '@most/types'
import type { Abi } from 'abitype'
import type {
  ContractEventName,
  PublicClient,
  Transport,
  WatchContractEventOnLogsParameter,
  WatchContractEventParameters
} from 'viem'

export const watchContractEvent = <
  transport extends Transport,
  const abi extends Abi,
  eventName extends ContractEventName<abi>,
  strict extends boolean | undefined = undefined
>(
  client: PublicClient,
  params: Omit<WatchContractEventParameters<abi, eventName, strict, transport>, 'onLogs' | 'onError'>
): Stream<WatchContractEventOnLogsParameter<abi, eventName, strict extends undefined ? true : strict>> => {
  return {
    run(sink, scheduler) {
      const removeListenerFn = client.watchContractEvent({
        ...params,
        onLogs: (
          logList: WatchContractEventOnLogsParameter<abi, eventName, strict extends undefined ? true : strict>
        ) => {
          sink.event(scheduler.currentTime(), logList)
        },
        onError: (err: Error) => {
          sink.error(scheduler.currentTime(), err)
        }
      } as any) // Type assertion needed due to Viem's complex transport constraints

      return disposeWith(removeListenerFn, null)
    }
  }
}
