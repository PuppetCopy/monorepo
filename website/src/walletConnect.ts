import type { Stream } from '@most/types'
import { createAppKit } from '@reown/appkit'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createConfig, type GetAccountReturnType, watchAccount, watchBlockNumber } from '@wagmi/core'
import { fromCallback, replayLatest } from 'aelea/core'
import { fallback, http, webSocket } from 'viem'
import { arbitrum } from 'viem/chains'

const projectId = import.meta.env.VITE_WC_PROJECT_ID as string

export const publicTransportMap = {
  [arbitrum.id]: fallback([
    webSocket('wss://arb-mainnet.g.alchemy.com/v2/sI7JV4ahbI8oNlOosnZ7klOi8vsxdVwm'),
    http('https://arb1.arbitrum.io/rpc')
  ])
  // [CHAIN.AVALANCHE]: avaGlobalProvider,
} as const

export const wagmiConfig = createConfig({
  chains: [arbitrum],
  transports: publicTransportMap
})

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: wagmiConfig.chains as any as [AppKitNetwork]
})

export const walletConnectAppkit = createAppKit({
  adapters: [wagmiAdapter],
  networks: wagmiConfig.chains as any as [AppKitNetwork],
  showWallets: false,
  allWallets: 'HIDE',
  projectId,
  features: {
    connectMethodsOrder: ['wallet', 'social'],
    collapseWallets: false,
    analytics: true
  },
  metadata: {
    name: '__APP_NAME__',
    description: '__APP_DESC_SHORT__',
    url: window.location.host,
    icons: ['https://imagedelivery.net/_aTEfDRm7z3tKgu9JhfeKA/5a7df101-00dc-4856-60a9-921b2879e200/lg']
  }
})

// Subscribe to state changes
// walletConnectAppkit.subscribeAccount(state => {
//   console.log('account state', state)
// })

// walletConnectAppkit.subscribeNetwork(state => {
//   console.log('network state', state)

// })

// walletConnectAppkit.subscribeState(state => {
//   console.log('state', state)
// })

// walletConnectAppkit.subscribeTheme(state => {
//   console.log('theme', state)
// })

// walletConnectAppkit.subscribeEvents(state => {
//   console.log('events', state)
// })

// walletConnectAppkit.subscribeWalletInfo(state => {
//   console.log('wallet info', state)
// })

// walletConnectAppkit.subscribeProviders(state => {
//   console.log('providers', state)
// })

export const blockChange: Stream<bigint> = fromCallback((cb) => {
  return watchBlockNumber(wagmiConfig, { onBlockNumber: (res) => cb(res) })
})
export const accountChange: Stream<GetAccountReturnType> = replayLatest(
  fromCallback((cb) => {
    return watchAccount(wagmiConfig, { onChange: (res) => cb(res) })
  })
)
