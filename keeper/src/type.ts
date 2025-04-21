import { Stream } from "@most/types"
import { Account, Chain, PublicClient, RpcSchema, Transport, WalletClient } from "viem"
import { arbitrum } from "viem/chains"
import { streamGmxEventLog1 } from "./source"

export type IPublicProvider = PublicClient<Transport, Chain>
export type IClient = PublicClient<Transport, typeof arbitrum>
export type IWallet = WalletClient<Transport, typeof arbitrum, Account, RpcSchema>

export type GMX_Event1 = (ReturnType<typeof streamGmxEventLog1> extends Stream<infer T> ? T : never)[number]
