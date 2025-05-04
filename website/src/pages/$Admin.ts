import type * as walletLink from '@puppet/middleware/wallet'
import type { Behavior } from 'aelea/core'
import { component, style } from 'aelea/core'
import { $column, layoutSheet } from 'aelea/ui-components'
import type { EIP6963ProviderDetail } from 'mipd'
import { $heading1 } from '../common/$text.js'
import type { IComponentPageParams } from './type.js'

interface IAdminPageParams extends IComponentPageParams {}

export const $Admin = (config: IAdminPageParams) =>
  component(
    (
      [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,
      [requestAdvanceEpoch, requestAdvanceEpochTether]: Behavior<walletLink.IWalletClient, any>
    ) => {
      const { walletClientQuery, providerClientQuery } = config

      return [
        $column(
          spacing.default,
          style({ alignSelf: 'center', minWidth: '680px' })
        )(
          $heading1('Epoch Starter')

          // $column(
          //   $heading3('Gauge Controller'),

          //   $infoLabeledValue(
          //     'Epoch',
          //     $intermediateText(
          //       map(async providerQuery => {
          //         const provider = await providerQuery
          //         const newLocal = await readEpochInfo(provider)
          //         return JSON.stringify(newLocal)
          //       }, providerClientQuery)
          //     )
          //   ),
          //   $SubmitBar({
          //     walletClientQuery,
          //     $content: $text('Advance Epoch'),
          //     txQuery: requestAdvanceEpoch
          //   })({
          //     changeWallet: changeWalletTether(),
          //     click: requestAdvanceEpochTether(
          //       map(wallet => {
          //         return writeAdvanceEpoch(wallet)
          //       })
          //     )
          //   }),
          // )
        ),

        {
          changeWallet
        }
      ]
    }
  )

// component((
//   [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,
// ) => {

//   return [
//     $column(spacing.default, style({ alignSelf: 'center' }))(
//       $heading1('Minter'),

//       $SubmitBar({
//         walletClientQuery,
//         $content: $text('Withdraw'),
//         disabled: map(val => val === 0n, amount),
//         txQuery: requestDepositAsset
//       })({
//         changeWallet: changeWalletTether(),
//         click
//       }),

//     ),

//     {

//     }
//   ]
// })
