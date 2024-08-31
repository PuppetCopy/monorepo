import { Puppet_EventEmitter, EventLog, handlerContext, Puppet_EventEmitter_Event_eventArgs, Position, RequestIncreasePosition__Match } from "generated"
import { decodeAbiParameters, type Hex } from "viem"
import { parseAbiParameters } from "abitype"

type EventHandlerMap = {
  [key: string]: (_1: EventLog<any>, context: handlerContext) => void
}

type DeepReadonly<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> { }

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}

type DeepIncreaseMatch = DeepReadonly<RequestIncreasePosition__Match> & {}

const eventHandlerMapped: EventHandlerMap = {
  RequestIncreasePosition__Match: async (event: EventLog<Puppet_EventEmitter_Event_eventArgs>, context) => {

    const [
      account,
      subaccount,
      requestKey,
      positionKey,
      puppetList,
      collateralDeltaList
    ] = decodeAbiParameters(
      parseAbiParameters('address, address, bytes32, bytes32, address[], uint[]'),
      event.params.data
    )

    context.RequestIncreasePosition__Match.set({


      id: requestKey,
      trader: account,
      subaccount,
      positionKey,

      puppetList: puppetList,
      puppetCollateralDeltaList: collateralDeltaList,

      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.block.hash
    })


  },
  RequestIncreasePosition__Adjust: async (event: EventLog<Puppet_EventEmitter_Event_eventArgs>, context) => {
    const [
      account,
      subaccount,
      requestKey,
      positionKey,
      transactionCost,
      collateralDeltaList
    ] = decodeAbiParameters(
      parseAbiParameters('address, address, bytes32, bytes32, uint, uint[]'),
      event.params.data as Hex
    )

    context.RequestIncreasePosition__Adjust.set({
      id: requestKey,
      trader: account,
      subaccount,
      positionKey,
      transactionCost,
      puppetCollateralDeltaList: collateralDeltaList as bigint[],

      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.block.hash
    })
  },
  ExecuteIncreasePosition__Execute: async (event: EventLog<Puppet_EventEmitter_Event_eventArgs>, context) => {
    const [
      account,
      subaccount,
      requestKey,
      positionKey,
      puppetList,
      collateralDeltaList
    ] = decodeAbiParameters(
      parseAbiParameters('address, address, bytes32, bytes32, address[], uint[]'),
      event.params.data as Hex
    )

    let positionRef = await context.PositionRef.get(positionKey)

    if (!positionRef) {
      context.log.error("PositionRef not found")
      return
    }

    const match = await context.RequestIncreasePosition__Match.get(requestKey)

    if (!match) {
      context.log.error("RequestIncreasePosition__Match not found")
      return
    }

    const length = match.puppetList.length
    for (let index = 0; index < length; index++) {
      const address = match.puppetList[index];
      context.PuppetPosition.set({
        id: requestKey,
        key: positionKey,
        account: address,

        trader: match.trader,
        collateralToken: '0x',

        collateral: match.puppetCollateralDeltaList[index],

        subaccount: match.subaccount,
        positionKey: positionRef.id,
        position_id: positionRef.position_id,
      })
    }



  },
}

Puppet_EventEmitter.Event.handler(async ({ event, context }) => eventHandlerMapped[event.params.name](event, context))


