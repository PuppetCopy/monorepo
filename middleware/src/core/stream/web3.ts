import type { Abi } from 'abitype'
import { disposeWith, type IStream } from 'aelea/stream'
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
): IStream<WatchContractEventOnLogsParameter<abi, eventName, strict extends undefined ? true : strict>> => {
  return {
    run(sink, scheduler) {
      try {
        const removeListenerFn = client.watchContractEvent({
          ...params,
          onLogs: (
            logList: WatchContractEventOnLogsParameter<abi, eventName, strict extends undefined ? true : strict>
          ) => {
            sink.event(logList)
          },
          onError: (err: Error) => {
            sink.error(err)
          }
        } as any) // Type assertion needed due to Viem's complex transport constraints

        return disposeWith(removeListenerFn)
      } catch (err) {
        return scheduler.asap(() => sink.error(err as Error))
      }
    }
  }
}
