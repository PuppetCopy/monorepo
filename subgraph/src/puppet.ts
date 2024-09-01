import { Puppet_EventEmitter, EventLog, handlerContext, Puppet_EventEmitter_LogEvent_eventArgs } from "generated"
import { decodeAbiParameters, type Hex } from "viem"
import { parseAbiParameters } from "abitype"
import { target } from "./utils"

type EventHandlerMap = {
  [key: string]: (_1: EventLog<Puppet_EventEmitter_LogEvent_eventArgs>, context: handlerContext) => void
}


const eventHandlerMapped: EventHandlerMap = {
  [target('RequestIncreasePositionLogic', 'matchUp')]: async (event, context) => {

    const [
      trader,
      subaccount,
      requestKey,
      positionKey,
      puppetList,
      collateralDeltaList
    ] = decodeAbiParameters(
      parseAbiParameters('address, address, bytes32, bytes32, address[], uint[]'),
      event.params.data as Hex
    )

    context.RequestIncreasePosition__Match.set({


      id: requestKey,
      trader,
      subaccount,
      positionKey,

      puppetList: puppetList as any,
      puppetCollateralDeltaList: collateralDeltaList as any,

      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.block.hash
    })


  },
  [target('RequestIncreasePositionLogic', 'adjust')]: async (event, context) => {
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
  [target('ExecuteIncreasePositionLogic', 'execute')]: async (event, context) => {
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
        market: '0x',

        collateralToken: '0x',

        collateral: match.puppetCollateralDeltaList[index],

        positionKey: positionRef.id,
        position_id: positionRef.position_id,
      })
    }



  },
}

Puppet_EventEmitter.LogEvent.handler(async ({ event, context }) => eventHandlerMapped[target(event.params.name, event.params.method, event.params.version)](event, context))


