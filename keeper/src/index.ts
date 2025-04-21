import { continueWith, map, mergeArray, snapshot } from '@most/core'
import { newDefaultScheduler } from '@most/scheduler'
import { Stream } from '@most/types'
import { cacheExchange, Client, fetchExchange } from '@urql/core'
import * as viem from 'viem'
import { createPublicClient, createWalletClient, Hex, WalletClient, webSocket, WebSocketTransport, WebSocketTransportConfig } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import { createOrderCancelled, createOrderFrozen, createPositionDecrease, createPositionIncrease } from './dto'
import { getState, IState } from './query'
import { streamGmxEventLog1 } from './source'
import { GMX_Event1 } from './type'
import { target } from './utils/common'


const VITE_INDEXR_ENDPOINT = process.env.VITE_INDEXR_ENDPOINT;

if (!VITE_INDEXR_ENDPOINT) throw new Error('VITE_INDEXR_ENDPOINT is not defined')

    const subgraphClient = new Client({
    url: VITE_INDEXR_ENDPOINT,
    exchanges: [cacheExchange, fetchExchange]
})

type IStoredOrder = {
    timestamp: number,
    log: GMX_Event1
}

type IConnectionMetric = {
    lastEventTime: number
}

type IConnection = {
    name: string
    transport: WebSocketTransport
}



const websocketConfig: WebSocketTransportConfig = {
    keepAlive: {
        interval: 10_000
    },
    reconnect: true
}

const account = privateKeyToAccount(process.env.KEY as Hex)
const alchemyTransport = { name: 'Alchemy', transport: webSocket('wss://arb-mainnet.g.alchemy.com/v2/rCU2HOpKg6sjbq-CvbP4J698kE_pdYQK'), websocketConfig }
const infuraTransport = { name: 'Infura', transport: webSocket('wss://arbitrum-mainnet.infura.io/ws/v3/6d7e461ad6644743b92327579860b662'), websocketConfig }
const publicnodeTransport = { name: 'publicnode', transport: webSocket('wss://arbitrum-one-rpc.publicnode.com'), websocketConfig }
const chainstackTransport = { name: 'chainstack', transport: webSocket('wss://arbitrum-mainnet.core.chainstack.com/b54a7b97edd4b319ec19fd5d842fa91c'), websocketConfig }

const connectionMetricMap: Record<string, IConnectionMetric> = {}

const processedTxnsMap = new Map<string, IStoredOrder>()
const openAllocations = new Map<viem.Address, {
    allocationKey: string
    allocationId: bigint
    puppetList: viem.Address[]
    matchKey: string
    order: ReturnType<typeof createPositionIncrease>
}>()


type IWallet = WalletClient<WebSocketTransport, typeof arbitrum, typeof account>

let allocationId = 0n
let allocationStoreImplementation: Hex

async function orderStream(connection: IConnection) {
    console.log(`Connection ${connection.name} started, ${Bun.nanoseconds()}`)
    connectionMetricMap[connection.name] = {} as IConnectionMetric

    const walletClient = createWalletClient({
        account,
        chain: arbitrum,
        transport: connection.transport
    })

    const rpcClient = createPublicClient({
        chain: arbitrum,
        transport: connection.transport
    })



    const eventLog1 = streamGmxEventLog1(rpcClient)

    allocationId = await rpcClient.readContract({
        ...CONTRACT[42161].MirrorPosition,
        functionName: 'nextAllocationId'
    })
    allocationStoreImplementation = await rpcClient.readContract({
        ...CONTRACT[42161].MirrorPosition,
        functionName: 'allocationStoreImplementation'
    })


    connectionMetricMap[connection.name] = {} as IConnectionMetric

    const state = getState(subgraphClient, rpcClient)

    return snapshot((state, logList) => {
        if (logList.length > 1) throw new Error('More than one log')

        const [log] = logList
        const hanlder = orderHandlerMap[target('GMX_EventEmitter', log.args.eventName)]

        if (!hanlder) return

        const transactionId = `${log.transactionHash}:${log.logIndex}:${log.blockNumber}`

        const processedItem = processedTxnsMap.get(transactionId)
        if (processedItem) {
            console.log(`${connection.name} Delay: ${Date.now() - processedItem.timestamp}`)

            return
        }


        processedTxnsMap.set(transactionId, {
            timestamp: Date.now(),
            log
        })

        hanlder(walletClient, connection, log as any as GMX_Event1, state)

    }, state, eventLog1)
}


const orderHandlerMap = {
    [target('GMX_EventEmitter', 'PositionIncrease')]: (
        wallet: IWallet,
        connection: IConnection,
        event: GMX_Event1,
        state: IState
    ) => {

        const order = createPositionIncrease(event)
        const matchKey = getMatchKey(order.collateralToken, order.account)
        const puppetList = state.matchKeyMap[matchKey].map(v => v.puppet)
        const allocationKey = getAllocationKey(puppetList, matchKey, ++allocationId)

        // wallet.writeContract({
        //     ...CONTRACT[42161].MirrorPosition,
        //     functionName: 'mirror',
        //     args: [
        //         {
        //             collateralToken: order.collateralToken,
        //             trader: order.account,
        //             market: order.market,
        //             isIncrease: true,
        //             isLong: order.isLong,
        //             keeperExecutionFeeReceiver: order.account,
        //             executionFee: state.executionFee.increase + state.requestLogicConfig.increaseCallbackGasLimit,
        //             collateralDelta: order.collateralDeltaAmount,
        //             sizeDeltaInUsd: order.sizeDeltaInUsd,
        //             acceptablePrice: order.executionPrice,
        //             triggerPrice: 0n,
        //             keeperExecutionFee: state.executionFee.increase + state.requestLogicConfig.increaseCallbackGasLimit,
        //         },
        //         puppetList
        //     ]
        // })

        // const allocationAddress = viem.getCreate2Address({
        //     from: CONTRACT[42161].MirrorPosition.address,
        //     salt: allocationKey,
        //     bytecodeHash: viem.keccak256(allocationStoreImplementation),
        // });

        // openAllocations.set(allocationAddress, {
        //     allocationKey,
        //     allocationId,
        //     puppetList,
        //     matchKey,
        //     order
        // })

        console.log(`PositionIncrease: (${order.orderType}). key ${order.id}. connection: ${connection.name}`)
    },
    [target('GMX_EventEmitter', 'PositionDecrease')]: (
        wallet: IWallet,
        connection: IConnection,
        event: GMX_Event1,
        state: IState
    ) => {

        const order = createPositionDecrease(event)
        const matchKey = getMatchKey(order.collateralToken, order.account)
        const puppetList = state.matchKeyMap[matchKey].map(v => v.puppet)
        const allocationKey = getAllocationKey(puppetList, matchKey, allocationId)

        callStack.push(
            viem.encodeFunctionData({
                ...CONTRACT[42161].PositionRouter,
                functionName: 'mirror',
                args: [{
                    collateralToken: order.collateralToken,
                    sourceRequestKey: order.id,
                    allocationKey: allocationKey,
                    trader: order.account,
                    market: order.market,
                    isIncrease: true,
                    isLong: order.isLong,
                    executionFee: state.executionFee.increase + state.requestLogicConfig.increaseCallbackGasLimit,
                    collateralDelta: order.collateralDeltaAmount,
                    sizeDeltaInUsd: order.sizeDeltaInUsd,
                    acceptablePrice: order.executionPrice,
                    triggerPrice: 0n,
                }]
            })
        )

        // wallet.writeContract({
        //     ...CONTRACT[42161].PositionRouter,
        //     functionName: 'multicall',
        //     args: [callStack]
        // })

        console.log(`PositionIncrease: (${order.orderType}). key ${order.id}. connection: ${connection.name}`)

    },
    [target('GMX_EventEmitter', 'OrderCancelled')]: (wallet: WalletClient, connection: IConnection, event: GMX_Event1) => {
        const order = createOrderCancelled(event)

        console.log(`OrderCancelled: (${order.reason}). key ${order}. connection: ${connection.name}`)
    },
    [target('GMX_EventEmitter', 'OrderFrozen')]: (wallet: WalletClient, connection: IConnection, event: GMX_Event1) => {
        const order = createOrderFrozen(event)

        console.log(`OrderFrozen: (${order.reason}). key ${order}. connection: ${connection.name}`)
    }
}


function keepSourcesAlive(list: Stream<any>[]) {
    return mergeArray(list.map(src => {
        return continueWith(() => {
            console.log('Connection closed')
            return src
        }, map(() => null, src))
    }))
}

keepSourcesAlive([
    await orderStream(alchemyTransport),
    await orderStream(infuraTransport),
    await orderStream(publicnodeTransport),
    await orderStream(chainstackTransport),
])
    .run({
        event(time, logList) { },
        error(time, err) {
            console.log('error', time, err)
        },
        end(time) {
            console.log('end', time)
        },
    }, newDefaultScheduler())

