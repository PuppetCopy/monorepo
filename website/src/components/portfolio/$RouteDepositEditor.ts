import { map, snapshot } from '@most/core'
import type { Stream } from '@most/types'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import { $infoLabel, $labeledhintAdjustment } from '@puppet-copy/middleware/ui-components'
import { readableTokenAmount, replayState } from '@puppet-copy/middleware/utils'
import { $text, combineState, component, type IBehavior, style, switchMap } from 'aelea/core'
import { $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $route } from '../../common/$common.js'
import { tokenBalanceOf } from '../../logic/commonRead.js'
import puppetReader from '../../logic/puppetReader.js'
import type { IComponentPageParams } from '../../pages/type.js'
import { wallet } from '../../wallet/wallet.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $DepositEditor } from './$DepositEditor.js'

export enum DepositEditorAction {
  DEPOSIT,
  WITHDRAW
}

export interface IDepositEditorDraft {
  action: DepositEditorAction
  token: Address
  amount: bigint
}

interface IRouteDepositEditor extends IComponentPageParams {
  collateralToken: Address
  draftDepositTokenList: Stream<IDepositEditorDraft[]>
}

export const $RouteDepositEditor = (config: IRouteDepositEditor) =>
  component(
    (
      [popDepositEdtior, popDepositEdtiorTether]: IBehavior<any>,
      [draft, draftTether]: IBehavior<bigint, IDepositEditorDraft>
    ) => {
      const { draftDepositTokenList, collateralToken } = config

      const model = replayState(
        map((list) => {
          return list.find((ct) => ct.token === collateralToken)
        }, draftDepositTokenList)
      )

      const walletBalance = replayState(
        switchMap(async (wallet) => {
          if (!wallet.address) return 0n

          return tokenBalanceOf(collateralToken, wallet.address)
        }, wallet.account)
      )

      const depositBalance = replayState(
        switchMap(async (account) => {
          if (!account.address) return 0n

          return puppetReader.getUserBalance(collateralToken, account.address)
        }, wallet.account)
      )

      const collateralTokenDescription = getTokenDescription(collateralToken)

      return [
        $Popover({
          $open: snapshot(
            (change) => {
              return $DepositEditor({
                walletBalance,
                initialAmount: change?.amount ?? 0n,
                token: collateralToken
              })({
                changeAmount: draftTether(
                  map((amount) => ({ amount, action: DepositEditorAction.DEPOSIT, token: collateralToken }))
                )
              })
            },
            model,
            popDepositEdtior
          ),
          $target: $row(spacing.big, style({ padding: '6px 0' }))(
            $route(collateralTokenDescription),
            $row(spacing.default)(
              $row(spacing.small, style({ alignItems: 'center' }))(
                $infoLabel($text('Balance')),
                $labeledhintAdjustment({
                  color: map(
                    (c) =>
                      c ? (c.action === DepositEditorAction.DEPOSIT ? pallete.positive : pallete.negative) : undefined,
                    model
                  ),
                  change: map((params) => {
                    if (!params.model) return ''

                    return readableTokenAmount(
                      collateralTokenDescription,
                      params.model.action === DepositEditorAction.DEPOSIT
                        ? params.model.amount + params.depositBalance
                        : params.depositBalance - params.model.amount
                    )
                  }, combineState({ depositBalance, model })),
                  $val: $text(
                    map((amount) => {
                      return readableTokenAmount(collateralTokenDescription, amount)
                    }, depositBalance)
                  )
                })
              ),
              $ButtonSecondary({
                $container: $defaultMiniButtonSecondary,
                $content: $text('Add')
              })({
                click: popDepositEdtiorTether()
              })
            )
          ),
          dismiss: draft
        })({}),

        {
          changeDepositTokenList: snapshot(
            (changeList, draft) => {
              const model = changeList.find((ct) => ct.token === collateralToken)

              if (model) {
                changeList[changeList.indexOf(model)] = draft
                return [...changeList]
              }

              return [...changeList, draft]
            },
            draftDepositTokenList,
            draft
          )
        }
      ]
    }
  )
