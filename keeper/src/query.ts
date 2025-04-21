import { combineObject } from '@aelea/core';
import { awaitPromises, fromPromise, map, periodic } from '@most/core';
import { Client } from '@urql/core';
import { groupArrayMany, InferStream } from 'common-utils';
import { querySubgraph } from 'common-utils/src/subgraph/query';
import { CONTRACT } from 'puppet-const';
import { schema } from 'puppet-middleware';
import { readContract } from 'viem/actions';
import { IClient } from './type';
import { readExecutionFees } from './utils/gmx';


export function getState(subgraphClient: Client, rpcClient: IClient) {
  const matchKeyMap = awaitPromises(map(async () => {
    const response = await querySubgraph(subgraphClient, { schema: schema.matchRule })

    return groupArrayMany(response, v => v.matchKey)
  }, periodic(3600)))

  const allocationMap = awaitPromises(map(async () => {
    const response = await querySubgraph(subgraphClient, { schema: schema.allocation, })

    return groupArrayMany(response, v => v.matchKey)
  }, periodic(10_000)))

  const executionFee = awaitPromises(map(async () => readExecutionFees(rpcClient), periodic(3600)))
  const requestLogicConfig = fromPromise(readContract(rpcClient, { ...CONTRACT[42161].MirrorPosition, functionName: 'getConfig', args: [], }))

  return combineObject({
    matchKeyMap,
    allocationMap,
    executionFee,
    requestLogicConfig
  })
}

export type IState = InferStream<ReturnType<typeof getState>>



