import { Address, Hex } from "viem"
import { GMX_Event1, IClient } from "../type"
import { getMappedValue, applyFactor } from "common-utils"
import { CONTRACT } from "puppet-const"
import { readContract } from "viem/actions"
import { hashData } from "gmx-middleware"


export function getAddressItem(log: GMX_Event1, idx: number): Address {
    return log.args.eventData.addressItems.items[idx].value
}

export function getAddressItemList(log: GMX_Event1, idx: number): Address[] {
    return log.args.eventData.addressItems.arrayItems[idx].value.map(value => value)
}

export function getUintItem(log: GMX_Event1, idx: number): bigint {
    return log.args.eventData.uintItems.items[idx].value
}

export function getUintItemList(log: GMX_Event1, idx: number): bigint[] {
    return log.args.eventData.uintItems.arrayItems[idx].value.map(value => value)
}

export function getIntItem(log: GMX_Event1, idx: number): bigint {
    return log.args.eventData.intItems.items[idx].value
}

export function getIntItemList(log: GMX_Event1, idx: number): bigint[] {
    return log.args.eventData.intItems.arrayItems[idx].value.map(value => value)
}

export function getBoolItem(log: GMX_Event1, idx: number): boolean {
    return log.args.eventData.boolItems.items[idx].value
}

export function getBoolItemList(log: GMX_Event1, idx: number): boolean[] {
    return log.args.eventData.boolItems.arrayItems[idx].value.map(value => value)
}

export function getBytes32Item(log: GMX_Event1, idx: number): Hex {
    return log.args.eventData.bytes32Items.items[idx].value
}

export function getBytes32ItemList(log: GMX_Event1, idx: number): Hex[] {
    return log.args.eventData.bytes32Items.arrayItems[idx].value.map(value => value)
}

export function getBytesItem(log: GMX_Event1, idx: number): Hex {
    return log.args.eventData.bytes32Items.items[idx].value
}

export function getBytesItemList(log: GMX_Event1, idx: number): Hex[] {
    return log.args.eventData.bytes32Items.arrayItems[idx].value.map(value => value)
}

export function getStringItem(log: GMX_Event1, idx: number): string {
    return log.args.eventData.stringItems.items[idx].value
}

export function getStringItemList(log: GMX_Event1, idx: number): string[] {
    return log.args.eventData.stringItems.arrayItems[idx].value.map(value => value)
}

export function getPositionPnlUsd(isLong: boolean, sizeInUsd: bigint, sizeInTokens: bigint, markPrice: bigint) {
    const positionValueUsd = sizeInTokens * markPrice
    const totalPnl = isLong ? positionValueUsd - sizeInUsd : sizeInUsd - positionValueUsd

    return totalPnl
}

export function hashKey(key: string) {
    return hashData(["string"], [key])
}

export async function readExecutionFees(
    provider: IClient,
    contractDefs = getMappedValue(CONTRACT, provider.chain.id).Datastore
) {
    const queryGasPrice = provider.getGasPrice()
    const estimatedFeeBaseGasLimit = readContract(provider, { ...contractDefs, functionName: 'getUint', args: [hashKey('ESTIMATED_GAS_FEE_BASE_AMOUNT_V2_1')] })
    const queryEstimatedFeeMultiplierFactor = readContract(provider, { ...contractDefs, functionName: 'getUint', args: [hashKey('ESTIMATED_GAS_FEE_MULTIPLIER_FACTOR')], })
    const increaseGasLimit = readContract(provider, { ...contractDefs, functionName: 'getUint', args: [hashKey('INCREASE_ORDER_GAS_LIMIT')], })
    const decreaseGasLimit = readContract(provider, { ...contractDefs, functionName: 'getUint', args: [hashKey('DECREASE_ORDER_GAS_LIMIT')], })

    const estimatedFeeMultiplierFactor = await queryEstimatedFeeMultiplierFactor
    const gasPrice = await queryGasPrice

    return {
        increase: await estimatedFeeBaseGasLimit + applyFactor(await increaseGasLimit, estimatedFeeMultiplierFactor) * gasPrice,
        decrease: await estimatedFeeBaseGasLimit + applyFactor(await decreaseGasLimit, estimatedFeeMultiplierFactor) * gasPrice,
        gasPrice,
    }
}


