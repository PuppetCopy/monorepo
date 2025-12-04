import * as PUPPET from '@puppet-copy/middleware/const'
import { readableTokenAmountLabel } from '@puppet-copy/middleware/core'
import { getTokenDescription } from '@puppet-copy/middleware/gmx'
import { type IStream, just, map, op, sampleMap, switchMap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $text, component, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $infoLabel, $intermediatePromise, $labeledhintAdjustment } from '@/ui-components'
import { $route } from '../../common/$common.js'
import { tokenBalanceOf } from '../../logic/commonRead.js'
import type { IComponentPageParams } from '../../pages/types.js'
import wallet, { type IAccountState } from '../../wallet/wallet.js'
import { $Popover } from '../$Popover.js'
import { $ButtonSecondary, $defaultMiniButtonSecondary } from '../form/$Button.js'
import { $DepositEditor, DEPOSIT_EDITOR_ACTION, type IDepositEditorDraft } from './$DepositEditor.js'

interface IRouteDepositEditor extends IComponentPageParams {
  walletAddress?: Address
  collateralToken: Address
  draftDepositTokenList: IStream<IDepositEditorDraft[]>
}

export const $RouteDepositEditor = (config: IRouteDepositEditor) =>
  component(
    (
      [popDepositEdtior, popDepositEdtiorTether]: IBehavior<any, IAccountState>,
      [changeModel, changeModelTether]: IBehavior<IDepositEditorDraft>
    ) => {
      const { draftDepositTokenList, collateralToken } = config

      const model = op(
        draftDepositTokenList,
        map(list => {
          const match = list.find(ct => ct.token === collateralToken)
          return (
            match ?? {
              action: DEPOSIT_EDITOR_ACTION.DEPOSIT,
              token: collateralToken,
              amount: 0n
            }
          )
        }),
        state
      )

      const collateralTokenDescription = getTokenDescription(collateralToken)

      return [
        $Popover({
          $open: op(
            popDepositEdtior,
            map(account => {
              const walletBalance = op(
                just(account),
                switchMap(async acc => tokenBalanceOf(acc, collateralToken, acc.address)),
                state
              )

              const depositBalance = op(
                just(account),
                switchMap(async acc => {
                  const readResult = await wallet.read({
                    ...PUPPET.CONTRACT.Account,
                    functionName: 'userBalanceMap',
                    args: [collateralToken, acc.subAccount.getAddress()]
                  })
                  return readResult
                }),
                state
              )

              return $DepositEditor({
                walletBalance,
                depositBalance,
                model,
                token: collateralToken,
                account
              })({
                changeModel: changeModelTether()
              })
            })
          ),
          $target: $intermediatePromise({
            $display: map(async accountQuery => {
              const account = await accountQuery

              const depositBalance = account
                ? await wallet.read({
                    ...PUPPET.CONTRACT.Account,
                    functionName: 'userBalanceMap',
                    args: [collateralToken, account.subAccount.getAddress()]
                  })
                : 0n

              return $row(spacing.big, style({ padding: '6px 0' }))(
                $route(collateralTokenDescription),
                $row(spacing.default)(
                  $row(spacing.small, style({ alignItems: 'center' }))(
                    $infoLabel($text('Deposit')),
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
                      change: map(m => {
                        if (!m) return ''

                        if (m.action === DEPOSIT_EDITOR_ACTION.DEPOSIT) {
                          if (m.amount === 0n) return ''
                        }

                        return readableTokenAmountLabel(
                          collateralTokenDescription,
                          m.action === DEPOSIT_EDITOR_ACTION.DEPOSIT
                            ? m.amount + depositBalance
                            : depositBalance - m.amount
                        )
                      }, model),
                      $val: $text(readableTokenAmountLabel(collateralTokenDescription, depositBalance))
                    })
                  ),
                  $ButtonSecondary({
                    $container: $defaultMiniButtonSecondary,
                    $content: $text('Update'),
                    disabled: just(!account)
                  })({
                    click: popDepositEdtiorTether(map(() => account))
                  })
                )
              )
            }, wallet.account)
          }),
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
