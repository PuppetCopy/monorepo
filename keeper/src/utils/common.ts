import { disposeWith } from "@most/disposable"
import type { Stream } from "@most/types"
import type { Abi, ContractEventName, EIP1193EventMap, EIP1193Provider, Transport, WatchContractEventOnLogsParameter, WatchContractEventParameters } from "viem"
import { BASIS_POINTS_DIVISOR } from "../const"
import { IClient } from "../type"
import { switchMap } from "common-utils"
import { fromCallback } from "@aelea/core"



export const watchContractEvent = <
    transport extends Transport,
    const abi extends Abi | readonly unknown[],
    eventName extends ContractEventName<abi>,
    strict extends boolean | undefined = undefined,
>(
    client: IClient,
    params: Omit<WatchContractEventParameters<abi, eventName, strict, transport>, 'onLogs' | 'onError' | 'batch' | 'strict'>
): Stream<WatchContractEventOnLogsParameter<abi, eventName, true>> => {
    return fromCallback<any>((callEvent, callError) => {
        const removeListenerFn = client.watchContractEvent({
            ...params,
            false: true,
            strict: true,
            reconnect: false,
            onLogs: (logList: any[]) => callEvent(logList),
            onerror: (err: Error) => {
                console.error(err)
                callError(err)
            }
        } as any)

        return disposeWith(() => {
            console.log(`Connection ${client.name} closed`)
            removeListenerFn()
        }, null)
    })
}

export const eip1193ProviderEventFn = <TEvent extends keyof EIP1193EventMap>(provider: EIP1193Provider, eventName: TEvent) => {
    return fromCallback<any>(
        (cb) => {
            provider.on(eventName as any, cb)
            return disposeWith(() => provider.removeListener(eventName, cb), null)
        }
    )
}

export const getGasPrice = (providerQuerySrc: Stream<Promise<IClient>>) => {
    return switchMap(async (clientQuery) => {
        return (await clientQuery).getGasPrice()
    }, providerQuerySrc)
}

export const getEstimatedGasPrice = (clientQuerySource: Stream<Promise<IClient>>) => {
    return switchMap(async (clientQuery) => {
        return (await clientQuery).estimateFeesPerGas()
    }, clientQuerySource)
}

export function toBasisPoints(value: bigint, divisor: bigint): bigint {
    if (divisor === 0n) return 0n

    return value * BASIS_POINTS_DIVISOR / divisor
}

export function applyBasisPoints(bps: bigint, value: bigint): bigint {
    return value * bps / BASIS_POINTS_DIVISOR
}

export function getUnixTime() {
    return BigInt(Math.floor(Date.now() / 1000))
}

export function target(contractName: string, eventName: string, version = "1") {
    return `${contractName}${eventName}${version}`
}

