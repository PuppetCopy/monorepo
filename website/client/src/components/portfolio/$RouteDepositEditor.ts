import { Behavior, combineObject } from "@aelea/core"
import { $text, component, style } from "@aelea/dom"
import { $row, layoutSheet } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { map, now, snapshot } from "@most/core"
import { Stream } from "@most/types"
import { readableTokenAmount, switchMap } from "@puppet/middleware/utils"
import { getTokenDescription } from "@puppet/middleware/gmx"
import { EIP6963ProviderDetail } from "mipd"
import { $infoLabel, $labeledhintAdjustment } from "@puppet/middleware/ui-components"
import * as viem from "viem"
import { $Popover } from "../$Popover.js"
import { $route } from "../../common/$common.js"
import puppetReader from "../../logic/puppetReader.js"
import { IComponentPageParams } from "../../pages/type.js"
import { $ButtonSecondary, $defaultMiniButtonSecondary } from "../form/$Button.js"
import { $DepositEditor, DepositEditorAction, IDepositEditorChange } from "./$DepositEditor.js"



interface IRouteDepositEditor extends IComponentPageParams {
  collateralToken: viem.Address
  depositTokenList: Stream<IDepositEditorChange[]>
}

export const $RouteDepositEditor = (config: IRouteDepositEditor) => component((
  [changeWallet, changeWalletTether]: Behavior<EIP6963ProviderDetail>,

  [popDepositEdtior, popDepositEdtiorTether]: Behavior<any>,
  [saveChange, saveChangeTether]: Behavior<IDepositEditorChange>,
) => {
  const { providerClientQuery, depositTokenList, walletClientQuery, collateralToken } = config

  const change = map(list => {
    const newLocal = list.find(ct => ct.token === collateralToken)
    return newLocal
  }, depositTokenList)

  const initialDepositAmountQuery = map(async walletQuery => {
    const wallet = await walletQuery

    if (wallet === null) return 0n

    return puppetReader.getUserBalance(wallet, collateralToken, wallet.account.address)
  }, walletClientQuery)
  const collateralTokenDescription = getTokenDescription(collateralToken)


  return [
    $Popover({
      open: snapshot(change => {
        return $DepositEditor({
          depositBalanceQuery: initialDepositAmountQuery,
          walletClientQuery,
          providerClientQuery,
          change: change || { token: collateralToken, action: DepositEditorAction.DEPOSIT, value: { amount: 0n } }
        })({
          changeWallet: changeWalletTether(),
          save: saveChangeTether(),
        })
      }, change, popDepositEdtior),
      $target: $row(layoutSheet.spacingBig, style({ padding: '6px 0' }))(
        $route(collateralTokenDescription),
        $row(layoutSheet.spacing)(
          $row(layoutSheet.spacingSmall, style({ alignItems: 'center' }))(
            $infoLabel('Balance'),
            $labeledhintAdjustment({
              color: map(c => c ? c.action === DepositEditorAction.DEPOSIT ? pallete.positive : pallete.negative : undefined, change),
              change: switchMap(async params => {
                if (!params.change) return ''

                return params.change.action === DepositEditorAction.DEPOSIT
                  ? readableTokenAmount(collateralTokenDescription, params.change.value.amount + await params.initialDepositAmountQuery)
                  : readableTokenAmount(collateralTokenDescription, await params.initialDepositAmountQuery - params.change.value.amount)
              }, combineObject({ initialDepositAmountQuery, change })),
              $val: $text(switchMap(async amount => {
                return readableTokenAmount(collateralTokenDescription, await amount)
              }, initialDepositAmountQuery)),
            })
          ),
          $ButtonSecondary({
            $container: $defaultMiniButtonSecondary,
            $content: $text('Change')
          })({
            click: popDepositEdtiorTether()
          })
        )
      ),
      dismiss: saveChange
    })({

    }),

    {
      changeDepositTokenList: snapshot((changeList, params) => {
        const index = changeList.findIndex(ct => ct.token === params.saveChange.token)

        if (index == -1) {
          changeList.push(params.saveChange)
        } else {
          changeList[index] = params.saveChange
        }

        return changeList
      }, depositTokenList, combineObject({ saveChange, walletClientQuery })),
      changeWallet,

    }
  ]
})





