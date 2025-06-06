// import { constant, map, mergeArray, multicast, now, startWith } from '@most/core'
// import { disposeWith } from '@most/disposable'
// import type { Stream } from '@most/types'
// import { createAppKit } from '@reown/appkit/core'
// import { combineState, fromCallback, replayLatest } from 'aelea/core'
// import type { EIP1193Provider } from 'mipd'
// import {
//   type Account,
//   type Chain,
//   type CustomTransport,
//   createPublicClient,
//   createWalletClient,
//   custom,
//   type EIP1193EventMap,
//   fallback,
//   getAddress,
//   type PublicClient,
//   type Transport,
//   type WalletClient
// } from 'viem'

// export type IPublicProvider = PublicClient<Transport, Chain>
// export type IWalletClient = WalletClient<Transport, Chain, Account>
// export type IClient = IPublicProvider | IWalletClient

// export interface IWalletLink {
//   publicProviderClientQuery: Stream<Promise<IPublicProvider>>
//   providerClientQuery: Stream<Promise<IPublicProvider>>
//   walletClientQuery: Stream<Promise<IWalletClient | null>>
// }

// export interface IWalletLinkConfig {
//   publicTransportMap: { [chainId: number]: Transport }
//   walletProvider: Stream<EIP1193Provider | null>
//   chainQuery: Stream<Promise<Chain>>
// }

// export function initWalletLink(config: IWalletLinkConfig): IWalletLink {
//   const { chainQuery, publicTransportMap } = config

//   const walletProvider: Stream<EIP1193Provider | null> = switchMap((provider) => {
//     if (provider === null) {
//       return now(null)
//     }

//     const reEmitProvider = constant(provider, eip1193ProviderEventFn(provider, 'accountsChanged'))
//     const disconnect = constant(null, eip1193ProviderEventFn(provider, 'disconnect'))

//     provider.on('chainChanged', () => {
//       // TODO: handle chain change throught the app
//       window.location.reload()
//     })

//     return startWith(provider, mergeArray([disconnect, reEmitProvider]))
//   }, config.walletProvider)

//   const providerList = Object.values(publicTransportMap)
//   if (providerList.length === 0) {
//     throw new Error('no global provider map')
//   }

//   const publicTransportParamsQuery = replayLatest(
//     multicast(
//       map(async (params) => {
//         const chain = await params.chainQuery
//         const transport = getPublicTransport(publicTransportMap, chain)
//         return { transport, chain }
//       }, combineState({ chainQuery }))
//     )
//   )

//   const providerClientQuery = replayLatest(
//     multicast(
//       map(async (params) => {
//         const { chain, transport } = await params.publicTransportParamsQuery

//         return createPublicClient({ chain, transport })
//       }, combineState({ publicTransportParamsQuery }))
//     )
//   )

//   const walletClientQuery: Stream<Promise<IWalletClient | null>> = replayLatest(
//     multicast(
//       map(async (params) => {
//         const { chain, transport } = await params.publicTransportParamsQuery

//         if (params.walletProvider === null) {
//           return null
//         }

//         const accountList = await params.walletProvider.request({ method: 'eth_accounts' })

//         // await params.walletProvider.request({
//         //   method: "wallet_switchEthereumChain",
//         //   params: [ { chainId: toHex(arbitrum.id) } ]
//         // })

//         // const chainId = await params.walletProvider.request({ method: 'eth_chainId' })

//         if (accountList.length === 0 || !accountList[0]) {
//           return null
//         }

//         const walletClient: IWalletClient = createWalletClient({
//           account: getAddress(accountList[0]),
//           chain,
//           transport: fallback([custom(params.walletProvider), transport])
//         }) as any

//         const addressList = await walletClient.getAddresses()

//         if (addressList.length === 0) {
//           return null
//         }

//         return walletClient
//       }, combineState({ walletProvider, publicTransportParamsQuery }))
//     )
//   )

//   const publicProviderClientQuery = replayLatest(
//     multicast(
//       map(async (params) => {
//         const { chain, transport } = await params.publicTransportParamsQuery

//         return createPublicClient({ chain, transport })
//       }, combineState({ publicTransportParamsQuery }))
//     )
//   )

//   return { providerClientQuery, publicProviderClientQuery }
// }

// export function getPublicTransport(publicTransportMap: Partial<Record<number, Transport>>, chain: Chain): Transport {
//   const providerList = Object.values(publicTransportMap)

//   if (providerList.length === 0) {
//     throw new Error('no global provider map')
//   }

//   const matchedPublicTransport = publicTransportMap[chain.id]

//   if (!matchedPublicTransport) {
//     console.error(`no provider for chain ${chain.name || chain.id}`)
//   }

//   const publicTransport = matchedPublicTransport || providerList[0]

//   if (!publicTransport) {
//     throw new Error('no provider for chain')
//   }

//   return publicTransport
// }

// export async function getPublicClient(
//   publicTransportQuery: Promise<Transport>,
//   walletProviderQuery: Promise<EIP1193Provider | null>,
//   chainQuery: Promise<Chain>
// ): Promise<PublicClient> {
//   const walletProvider = await walletProviderQuery
//   const publicTransport = await publicTransportQuery
//   const chain = await chainQuery

//   const transport = walletProvider ? [custom(walletProvider), publicTransport] : [publicTransport]
//   return createPublicClient({
//     chain,
//     transport: fallback(transport)
//   })
// }

// type EthereumProvider = { request(...args: any): Promise<any>; name: string }

// export const getInjectedProviderList = (): EthereumProvider[] => {
//   const providerList: EthereumProvider[] = (window as any)?.ethereum?.providers
//   if (!providerList) {
//     return []
//   }

//   return providerList
// }

// export const getInjectedTransport = (name: string): CustomTransport | null => {
//   const providerList: EthereumProvider[] = (window as any)?.ethereum?.providers

//   if (!providerList) {
//     return null
//   }

//   const match = providerList.find((provider) => provider.name === name)

//   if (!match) {
//     return null
//   }

//   return custom(match)
// }

// export const eip1193ProviderEventFn = <TEvent extends keyof EIP1193EventMap>(
//   provider: EIP1193Provider,
//   eventName: TEvent
// ) =>
//   fromCallback<any, any>(
//     (cb) => {
//       provider.on(eventName as any, cb)
//       return disposeWith(() => provider.removeListener(eventName, cb), null)
//     },
//     (a) => {
//       return a
//     }
//   )

// export const getGasPrice = (providerQuerySrc: Stream<Promise<IPublicProvider>>) => {
//   return switchMap(async (clientQuery) => {
//     return (await clientQuery).getGasPrice()
//   }, providerQuerySrc)
// }

// export const getEstimatedGasPrice = (clientQuerySource: Stream<Promise<IPublicProvider>>) => {
//   return switchMap(async (clientQuery) => {
//     return (await clientQuery).estimateFeesPerGas()
//   }, clientQuerySource)
// }
