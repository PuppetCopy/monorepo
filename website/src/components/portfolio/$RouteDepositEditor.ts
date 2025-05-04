import { map, now, snapshot } from '@most/core'
import type { Stream } from '@most/types'
import { getTokenDescription } from '@puppet/middleware/gmx'
import { $infoLabel, $labeledhintAdjustment } from '@puppet/middleware/ui-components'
import { readableTokenAmount, switchMap } from '@puppet/middleware/utils'
import { $text, combineState, component, type IBehavior, style } from 'aelea/core'
import { $row, layoutSheet, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import type * as viem from 'viem'
import { $route } from '../../common/$common.js'
import puppetReader from '../../logic/puppetReader.js'
import type { IComponentPageParams } from '../../pages/type.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $DepositEditor, DepositEditorAction, type IDepositEditorChange } from './$DepositEditor.js'

interface IRouteDepositEditor extends IComponentPageParams {
  collateralToken: viem.Address
  depositTokenList: Stream<IDepositEditorChange[]>
}

export const $RouteDepositEditor = (config: IRouteDepositEditor) =>
  component(
    (
      [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>,

      [popDepositEdtior, popDepositEdtiorTether]: IBehavior<any>,
      [saveChange, saveChangeTether]: IBehavior<IDepositEditorChange>
    ) => {
      const { depositTokenList, collateralToken } = config

      const change = map((list) => {
        const newLocal = list.find((ct) => ct.token === collateralToken)
        return newLocal
      }, depositTokenList)

      const initialDepositAmountQuery = map(async (walletQuery) => {
        const wallet = await walletQuery

        if (wallet === null) return 0n

        return puppetReader.getUserBalance(wallet, collateralToken, wallet.account.address)
      }, walletClientQuery)
      const collateralTokenDescription = getTokenDescription(collateralToken)

      return [
        $Popover({
          open: snapshot(
            (change) => {
              return $DepositEditor({
                depositBalanceQuery: initialDepositAmountQuery,
                walletClientQuery,
                providerClientQuery,
                change: change || {
                  token: collateralToken,
                  action: DepositEditorAction.DEPOSIT,
                  value: { amount: 0n }
                }
              })({
                changeWallet: changeWalletTether(),
                save: saveChangeTether()
              })
            },
            change,
            popDepositEdtior
          ),
          $target: $row(spacing.big, style({ padding: '6px 0' }))(
            $route(collateralTokenDescription),
            $row(spacing.default)(
              $row(spacing.small, style({ alignItems: 'center' }))(
                $infoLabel('Balance'),
                $labeledhintAdjustment({
                  color: map(
                    (c) =>
                      c ? (c.action === DepositEditorAction.DEPOSIT ? pallete.positive : pallete.negative) : undefined,
                    change
                  ),
                  change: switchMap(async (params) => {
                    if (!params.change) return ''

                    return params.change.action === DepositEditorAction.DEPOSIT
                      ? readableTokenAmount(
                          collateralTokenDescription,
                          params.change.value.amount + (await params.initialDepositAmountQuery)
                        )
                      : readableTokenAmount(
                          collateralTokenDescription,
                          (await params.initialDepositAmountQuery) - params.change.value.amount
                        )
                  }, combineState({ initialDepositAmountQuery, change })),
                  $val: $text(
                    switchMap(async (amount) => {
                      return readableTokenAmount(collateralTokenDescription, await amount)
                    }, initialDepositAmountQuery)
                  )
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
        })({}),

        {
          changeDepositTokenList: snapshot(
            (changeList, params) => {
              const index = changeList.findIndex((ct) => ct.token === params.saveChange.token)

              if (index === -1) {
                changeList.push(params.saveChange)
              } else {
                changeList[index] = params.saveChange
              }

              return changeList
            },
            depositTokenList,
            combineState({ saveChange, walletClientQuery })
          ),
          changeWallet
        }
      ]
    }
  )
