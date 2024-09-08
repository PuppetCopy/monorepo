
import { Behavior, combineObject, isStream } from "@aelea/core"
import { $Node, $text, component, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { empty, fromPromise, map, mergeArray, sample, startWith } from "@most/core"
import { Stream } from "@most/types"
import { erc20Abi } from "abitype/abis"
import { getMappedValue, parseFixed, readableTokenAmount, readableTokenAmountLabel, switchMap } from "common-utils"
import * as GMX from "gmx-middleware-const"
import { getTokenDescription } from "gmx-middleware-utils"
import * as PUPPET from "puppet-middleware-const"
import { $FieldLabeled } from "ui-components"
import * as viem from "viem"
import * as walletLink from "wallet"
import { IApproveSpendReturn, writeApproveSpend } from "../../logic/commonWrite.js"
import { IDepositFundsReturnType } from "../../logic/puppetWrite.js"
import { readAddressTokenBalance } from "../../logic/traderRead.js"
import { IComponentPageParams } from "../../pages/type.js"
import { $ButtonSecondary, $defaultMiniButtonSecondary, $Submit } from "../form/$Button.js"


interface IAssetDepositEditor extends IComponentPageParams {
  token: viem.Address
}

export const $AssetDepositEditor = (config: IAssetDepositEditor) => component((
  [requestDepositAsset, requestDepositAssetTether]: Behavior<walletLink.IWalletClient, IDepositFundsReturnType>,
  [inputDepositAmount, inputDepositAmountTether]: Behavior<string>,
  [clickMaxDeposit, clickMaxDepositTether]: Behavior<any>,
) => {

  const { walletClientQuery } = config

  const tokenDescription = getTokenDescription(config.token)
  const walletBalance = switchMap(async walletQuery => {
    const wallet = await walletQuery

    if (wallet == null) {
      return 0n
    }

    return readAddressTokenBalance(wallet, config.token, wallet.account.address)
  }, walletClientQuery)
  const indexToken = getMappedValue(GMX.TOKEN_ADDRESS_DESCRIPTION_MAP, config.token)


  const maxBalance = sample(walletBalance, clickMaxDeposit)
  const amount = startWith(0n, mergeArray([
    maxBalance,
    map(str => parseFixed(indexToken.decimals, str), inputDepositAmount)
  ]))



  return [

    $column(layoutSheet.spacing, style({ maxWidth: '310px' }))(
      $row(layoutSheet.spacingSmall, style({ position: 'relative' }))(
        $FieldLabeled({
          label: 'Amount',
          value: map(val => readableTokenAmount(tokenDescription, val), maxBalance),
          placeholder: 'Enter amount',
          hint: map(amount => `Balance: ${readableTokenAmountLabel(tokenDescription, amount)}`, walletBalance),
        })({
          change: inputDepositAmountTether()
        }),

        $ButtonSecondary({
          $container: $defaultMiniButtonSecondary(style({ position: 'absolute', right: 0, bottom: '28px' })),
          $content: $text('Max'),
        })({
          click: clickMaxDepositTether()
        })
      ),


    ),

    {
      requestDepositAsset: map(async tx => (await tx).events[0].args.amount, requestDepositAsset)
    }

  ]
})

