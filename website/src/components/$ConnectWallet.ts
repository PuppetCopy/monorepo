import { awaitPromises, join, map, now } from '@most/core'
import { $caretDown, $icon } from '@puppet/middleware/ui-components'
import { switchMap } from '@puppet/middleware/utils'
import * as wallet from '@puppet/middleware/wallet'
import { CoreHelperUtil } from '@reown/appkit-controllers'
import { ConstantsUtil, PresetsUtil } from '@reown/appkit-utils'
import type { GetAccountReturnType } from '@wagmi/core'
import type { IBehavior, IOps } from 'aelea/core'
import { $text, component, type I$Node, type INodeCompose, style } from 'aelea/core'
import { $row, layoutSheet, spacing } from 'aelea/ui-components'
import type { EIP6963ProviderDetail } from 'mipd'
import { type Chain, type HttpTransport, http } from 'viem'
import type { IWalletPageParams } from '../pages/type.js'
import { accountChange, walletConnectAppkit } from '../walletConnect.js'
import { $ButtonSecondary } from './form/$Button.js'
import type { IButtonCore } from './form/$ButtonCore.js'

// -- Helpers ------------------------------------------------------------------
const RPC_URL = CoreHelperUtil.getBlockchainApiUrl()

// -- Types --------------------------------------------------------------------
interface Options {
  projectId: string
}

export function walletConnectProvider({ projectId }: Options): (chain: Chain) => HttpTransport | null {
  return function provider(chain: Chain): HttpTransport | null {
    if (!PresetsUtil.WalletConnectRpcChainIds.includes(chain.id)) {
      return null
    }

    const baseHttpUrl = `${RPC_URL}/v1/?chainId=${ConstantsUtil.EIP155}:${chain.id}&projectId=${projectId}`

    return http(baseHttpUrl)
  }
}

// const walletConnectProviderQuery: Stream<EIP6963ProviderDetail> = fromPromise(provider.then(async walletConnectProvider => {
//   if (walletConnectProvider.connected) {
//     walletConnectProvider.on('disconnect', async () => {
//       window.location.reload()
//     })
//   }

//   const provider = walletConnectProvider as EIP1193Provider
//   const info = {
//     icon: `data:image/svg+xml,<svg width="32" height="32" fill="white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> <path d="M7.14162 9.77812C12.034 4.74063 19.9661 4.74063 24.8584 9.77812L25.4472 10.3844C25.6918 10.6363 25.6918 11.0446 25.4472 11.2965L23.433 13.3704C23.3107 13.4964 23.1124 13.4964 22.9901 13.3704L22.1799 12.5361C18.7668 9.02186 13.2332 9.02186 9.82018 12.5361L8.95246 13.4296C8.83015 13.5555 8.63184 13.5555 8.50953 13.4296L6.49536 11.3557C6.25074 11.1038 6.25074 10.6954 6.49536 10.4436L7.14162 9.77812ZM29.0239 14.0672L30.8165 15.913C31.0612 16.1649 31.0612 16.5733 30.8165 16.8251L22.7335 25.1481C22.4889 25.4 22.0923 25.4 21.8476 25.1481C21.8476 25.1481 21.8476 25.1481 21.8476 25.1481L16.1108 19.2411C16.0496 19.1781 15.9505 19.1781 15.8893 19.2411L10.1526 25.1481C9.90797 25.4 9.51137 25.4 9.26675 25.1481C9.26675 25.1481 9.26675 25.1481 9.26675 25.1481L1.18346 16.825C0.938846 16.5732 0.938846 16.1648 1.18346 15.9129L2.97609 14.0671C3.22071 13.8152 3.61731 13.8152 3.86193 14.0671L9.59887 19.9743C9.66002 20.0372 9.75918 20.0372 9.82033 19.9743C9.82033 19.9743 9.82033 19.9743 9.82033 19.9743L15.557 14.0671C15.8016 13.8152 16.1982 13.8152 16.4428 14.0671C16.4428 14.0671 16.4428 14.0671 16.4428 14.0671L22.1798 19.9743C22.2409 20.0372 22.3401 20.0372 22.4012 19.9743L28.1381 14.0672C28.3827 13.8154 28.7793 13.8154 29.0239 14.0672Z" /> </svg>`,
//     name: 'WalletConnect',
//     rdns: 'com.WalletConnect',
//     uuid: '00000000-0000-0000-0000-000000000000'
//   } as const
//   return { info, provider }
// }))

export interface IConnectWalletPopover extends IWalletPageParams {
  $$display: IOps<GetAccountReturnType, I$Node>
  primaryButtonConfig?: Partial<IButtonCore>
  $container?: INodeCompose
}

export const $IntermediateConnectButton = (config: IConnectWalletPopover) =>
  component(([changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>) => {
    const $container = config.$container || $row(style({ minHeight: '48px', minWidth: '0px' }))

    return [
      $container(
        switchMap((wallet) => {
          // no wallet connected, show connection flow
          if (!wallet) {
            return $ConnectChoiceList()({
              changeWallet: changeWalletTether()
            })
          }

          return join(config.$$display(now(wallet)))
        }, accountChange)
      ),

      {
        changeWallet
      }
    ]
  })

export const $ConnectChoiceList = () =>
  component(([changeWallet, changeWalletTether]: IBehavior<any>) => {
    return [
      $ButtonSecondary({
        $content: $row(spacing.default, style({ alignItems: 'center' }))(
          $text('Connect Wallet'),
          $icon({ $content: $caretDown, width: '14px', viewBox: '0 0 32 32' })
        )
      })({
        click: changeWalletTether(
          map(async (xx) => {
            walletConnectAppkit.open({})

            return null
          })
        )
      }),
      // switchMap(announcedProviderList => {
      //   return $Dropdown({
      //     $selection: $ButtonSecondary({
      //       $content: $row(spacing.default, style({ alignItems: 'center' }))(
      //         $text('Connect Wallet'),
      //         $icon({ $content: $caretDown, width: '14px', viewBox: '0 0 32 32' }),
      //       )
      //     })({}),
      //     selector: {
      //       value: now(null) as Stream<EIP6963ProviderDetail | null>,
      //       list: announcedProviderList,
      //       $$option: map(providerDetail => {
      //         if (providerDetail === null) return empty()

      //         return $row(spacing.small, style({ alignItems: 'center' }))(
      //           ignoreAll(changeWallet),
      //           providerDetail.info.icon ?
      //             $element('img')(
      //               style({ width: '24px', height: '24px' }),
      //               attr({ src: providerDetail.info.icon })
      //             )()
      //             : empty(),
      //           $text(providerDetail.info.name),
      //         )
      //       })
      //     },
      //   })({
      //     select: changeWalletTether(
      //       map(async providerDetail => {
      //         const provider = providerDetail.provider
      //         if (providerDetail.info.rdns === 'com.WalletConnect') {
      //           await providerDetail.provider.connect()
      //         } else {
      //           await provider.request({ method: 'eth_requestAccounts' })
      //         }

      //         return providerDetail
      //       }),
      //       awaitPromises,
      //       multicast
      //     )
      //   })
      // }, announcedProviderList ),

      {
        changeWallet
      }
    ]
  })
