import { readableTokenAmount } from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import { $infoLabel, $labeledhintAdjustment } from '../ui-components'
import { $text, component, style } from 'aelea/core'
import {
  combineState,
  constant,
  type IBehavior,
  type IStream,
  map,
  replayState,
  snapshot,
  switchMap
} from 'aelea/stream'
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
import { $DepositEditor, DepositEditorAction, type IDepositEditorDraft } from './$DepositEditor.js'

interface IRouteDepositEditor extends IComponentPageParams {
  collateralToken: Address
  draftDepositTokenList: IStream<IDepositEditorDraft[]>
}

export const $RouteDepositEditor = (config: IRouteDepositEditor) =>
  component(
    (
      [popDepositEdtior, popDepositEdtiorTether]: IBehavior<any>,
      [changeModel, changeModelTether]: IBehavior<IDepositEditorDraft>
    ) => {
      const { draftDepositTokenList, collateralToken } = config

      const model = replayState(
        map(list => {
          const match = list.find(ct => ct.token === collateralToken)
          return (
            match ?? {
              action: DepositEditorAction.DEPOSIT,
              token: collateralToken,
              amount: 0n
            }
          )
        }, draftDepositTokenList)
      )

      const walletBalance = replayState(
        switchMap(async wallet => {
          if (!wallet.address) return 0n

          return tokenBalanceOf(collateralToken, wallet.address)
        }, wallet.account)
      )

      const depositBalance = replayState(
        switchMap(async account => {
          if (!account.address) return 0n

          return puppetReader.getUserBalance(collateralToken, account.address)
        }, wallet.account)
      )

      const collateralTokenDescription = getTokenDescription(collateralToken)

      return [
        $Popover({
          $open: constant(
            $DepositEditor({
              walletBalance,
              depositBalance,
              model,
              token: collateralToken
            })({
              changeModel: changeModelTether()
            }),
            popDepositEdtior
          ),
          $target: $row(spacing.big, style({ padding: '6px 0' }))(
            $route(collateralTokenDescription),
            $row(spacing.default)(
              $row(spacing.small, style({ alignItems: 'center' }))(
                $infoLabel($text('Balance')),
                $labeledhintAdjustment({
                  color: map(
                    c =>
                      c ? (c.action === DepositEditorAction.DEPOSIT ? pallete.positive : pallete.negative) : undefined,
                    model
                  ),
                  change: map(params => {
                    if (!params.model) return ''

                    if (params.model.action === DepositEditorAction.DEPOSIT) {
                      if (params.model.amount === 0n) return ''
                    }

                    return readableTokenAmount(
                      collateralTokenDescription,
                      params.model.action === DepositEditorAction.DEPOSIT
                        ? params.model.amount + params.depositBalance
                        : params.depositBalance - params.model.amount
                    )
                  }, combineState({ depositBalance, model })),
                  $val: $text(
                    map(amount => {
                      return readableTokenAmount(collateralTokenDescription, amount)
                    }, depositBalance)
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
          dismiss: changeModel
        })({}),

        {
          changeDepositTokenList: snapshot(
            (changeList, draft) => {
              const model = changeList.find(ct => ct.token === collateralToken)

              if (model) {
                changeList[changeList.indexOf(model)] = draft
                return [...changeList]
              }

              return [...changeList, draft]
            },
            draftDepositTokenList,
            changeModel
          )
        }
      ]
    }
  )
