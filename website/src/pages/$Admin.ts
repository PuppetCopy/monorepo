import type { IBehavior } from 'aelea/core'
import { $text, component, style } from 'aelea/core'
import { $column, layoutSheet, spacing } from 'aelea/ui-components'
import type { EIP6963ProviderDetail } from 'mipd'
import { $heading1 } from '../common/$text.js'
import type { IWalletClient } from '../wallet/wallet.js'
import type { IComponentPageParams } from './type.js'

interface IAdminPageParams extends IComponentPageParams {}

export const $Admin = (config: IAdminPageParams) =>
  component(
    (
      [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,
      [requestAdvanceEpoch, requestAdvanceEpochTether]: IBehavior<IWalletClient, any>
    ) => {
      return [
        $column(
          spacing.default,
          style({ alignSelf: 'center', minWidth: '680px' })
        )(
          $heading1($text('Epoch Starter'))

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
          //
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
//   [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,
// ) => {

//   return [
//     $column(spacing.default, style({ alignSelf: 'center' }))(
//       $heading1('Minter'),

//       $SubmitBar({
//
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
