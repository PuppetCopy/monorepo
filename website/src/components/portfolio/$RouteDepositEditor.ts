import { readableTokenAmountLabel } from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import { awaitPromises, combine, constant, type IStream, map, op, sampleMap, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $text, component, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $infoLabel, $labeledhintAdjustment } from '@/ui-components'
import { $route } from '../../common/$common.js'
import { tokenBalanceOf } from '../../logic/commonRead.js'
import puppetReader from '../../logic/puppetReader.js'
import type { IComponentPageParams } from '../../pages/types.js'
import { wallet } from '../../wallet/wallet.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $DepositEditor, DEPOSIT_EDITOR_ACTION, type IDepositEditorDraft } from './$DepositEditor.js'

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

      const model = state(
        map(list => {
          const match = list.find(ct => ct.token === collateralToken)
          return (
            match ?? {
              action: DEPOSIT_EDITOR_ACTION.DEPOSIT,
              token: collateralToken,
              amount: 0n
            }
          )
        }, draftDepositTokenList)
      )

      const walletBalance = op(
        wallet.account,
        awaitPromises,
        switchMap(async wallet => {
          if (!wallet) return 0n

          return tokenBalanceOf(collateralToken, wallet.address)
        }),
        state
      )

      const depositBalance = op(
        wallet.account,
        awaitPromises,
        switchMap(async account => {
          if (!account) return 0n

          return puppetReader.getUserBalance(account, collateralToken, account.address)
        }),
        state
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
                      c
                        ? c.action === DEPOSIT_EDITOR_ACTION.DEPOSIT
                          ? pallete.positive
                          : pallete.negative
                        : undefined,
                    model
                  ),
                  change: map(params => {
                    if (!params.model) return ''

                    if (params.model.action === DEPOSIT_EDITOR_ACTION.DEPOSIT) {
                      if (params.model.amount === 0n) return ''
                    }

                    return readableTokenAmountLabel(
                      collateralTokenDescription,
                      params.model.action === DEPOSIT_EDITOR_ACTION.DEPOSIT
                        ? params.model.amount + params.depositBalance
                        : params.depositBalance - params.model.amount
                    )
                  }, combine({ depositBalance, model })),
                  $val: $text(
                    map(amount => {
                      return readableTokenAmountLabel(collateralTokenDescription, amount)
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
          changeDepositTokenList: sampleMap(
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
