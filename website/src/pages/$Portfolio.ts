// TODO: Replace with actual schema type when matching rules are implemented
type ISubscribeRule = {
  id: string
  blockTimestamp: number
  transactionHash: string
  account: `0x${string}`
  collateralToken: `0x${string}`
  master: `0x${string}`
  masterMatchingKey: `0x${string}`
  allowanceRate: bigint
  throttleActivity: bigint
  expiry: bigint
}

import { type IntervalTime, PUPPET_COLLATERAL_LIST } from '@puppet/sdk/const'
import { getDuration, getMasterMatchingKey, getUnixTimestamp, readableDate, readablePercentage } from '@puppet/sdk/core'
import { getTokenDescription } from '@puppet/sdk/gmx'
import { awaitPromises, combine, constant, empty, filterNull, type IStream, just, map, op } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Address } from 'viem/accounts'
import { $caretDown, $infoLabel, $infoLabeledValue, $intermediatePromise } from '@/ui-components'
import { $card, $card2, $responsiveFlex } from '../common/elements/$common.js'
import { $profileDisplay } from '../components/$AccountProfile.js'
import { $SelectCollateralToken } from '../components/$CollateralTokenSelector.js'
import { $ConnectWalletCard } from '../components/$ConnectWalletCard.js'
import { $LastAtivity } from '../components/$LastActivity.js'
import { $Popover } from '../components/$Popover.js'
import { $ButtonCircular, $ButtonPrimary, $defaultButtonCircularContainer } from '../components/form/$Button.js'
import type { BalanceDraft } from '../components/portfolio/$DepositEditor.js'
import { $MatchingRuleEditor, type ISetMatchingRuleEditorDraft } from '../components/portfolio/$MatchingRuleEditor.js'
import { $TokenBalanceEditor } from '../components/portfolio/$TokenBalanceEditor.js'
import { type IAccountState, initializeSmartAccount, signSession } from '../wallet/wallet.js'
import { $seperator2 } from './common.js'
import type { IPageFilterParams } from './types.js'

interface IWalletPuppet extends IPageFilterParams {
  accountQuery: IStream<Promise<IAccountState>>
  draftMatchingRuleList: IStream<ISetMatchingRuleEditorDraft[]>
  draftDepositTokenList: IStream<BalanceDraft[]>
  userMatchingRuleQuery: IStream<Promise<ISubscribeRule[]>>
}

export const $PortfolioPage = ({
  accountQuery,
  activityTimeframe,
  collateralTokenList,
  indexTokenList,
  userMatchingRuleQuery,
  draftDepositTokenList,
  draftMatchingRuleList
}: IWalletPuppet) =>
  component(
    (
      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [selectIndexTokenList, selectIndexTokenListTether]: IBehavior<Address[]>,
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<ISetMatchingRuleEditorDraft[]>,
      [popRouteSubscriptionEditor, popRouteSubscriptionEditorTether]: IBehavior<any, Address>,
      [changeDraft, changeDraftTether]: IBehavior<BalanceDraft>,
      // [changeSession, changeSessionTether]: IBehavior<PointerEvent, Promise<IAccountState>>,
      [changeAccount, changeAccountTether]: IBehavior<PointerEvent, Promise<IAccountState>>
    ) => {
      const positionLinkMapQuery = op(
        combine({ activityTimeframe, collateralTokenList, accountQuery }),
        map(async params => {
          const account = await params.accountQuery

          if (!account) {
            return null
          }

          const startActivityTimeframe = getUnixTimestamp() - params.activityTimeframe

          // TODO: Update to use new schema - puppetAllocation table not yet implemented
          // Needs: query puppet's allocations to masters from allocate__Allocate events
          // For now returning empty - this page needs schema work
          void account
          void startActivityTimeframe
          return {} as Record<string, never[]>
        })
      )

      // const portfolio = op(
      //   accountQuery,
      //   map(async accountQuery => {
      //     const account = await accountQuery

      //     if (!account?.smartAccount) return null

      //     const portfolio = getPortfolio(account.smartAccount.getAddress())
      //   })
      // )

      return [
        $intermediatePromise({
          $display: op(
            combine({
              // portfolio,
              accountQuery,
              userMatchingRuleQuery,
              positionLinkMapQuery,
              activityTimeframe,
              collateralTokenList
            }),
            map(async params => {
              const account = await params.accountQuery

              if (!account) {
                return $column(
                  spacing.big,
                  style({ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' })
                )($ConnectWalletCard({}))
              }

              // Session required to use Portfolio features
              if (account.sessionSigner === null) {
                return $column(
                  spacing.big,
                  style({ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' })
                )(
                  $card(spacing.default)(
                    $column(spacing.default)(
                      $node(style({ fontSize: '1rem', fontWeight: '600' }))($text('Manage Portfolio')),
                      $node(style({ color: pallete.foreground, lineHeight: '1.5' }))(
                        $text(
                          'Sign a message to enable your session. This allows you to deposit funds and set matching rules for copy-trading.'
                        )
                      ),
                      $ButtonPrimary({
                        $content: $text('Enable')
                      })({
                        click: changeAccountTether(
                          map(async () => {
                            const sessionKey = await signSession(account)

                            return initializeSmartAccount(account, sessionKey)
                          }),
                          awaitPromises,
                          map(x => Promise.resolve(x))
                        )
                      })
                    )
                  )
                )
              }

              const positionMap = await params.positionLinkMapQuery
              const matchingRuleList = await params.userMatchingRuleQuery
              const activeRouteList =
                params.collateralTokenList.length > 0 ? params.collateralTokenList : PUPPET_COLLATERAL_LIST

              const $activityStatus =
                positionMap === null
                  ? empty
                  : Object.keys(positionMap).length === 0
                    ? $column(style({ alignItems: 'center' }), spacing.small)(
                        $text(`No matching activity in the last ${getDuration(params.activityTimeframe)}`),
                        $infoLabel($text('Try adjusting filters like Activity timeframe or collateral tokens'))
                      )
                    : empty

              // Smart account for depositing funds to be allocated to masters
              const smartAccount = account.subaccount
              const smartAccountAddress = smartAccount?.getAddress() ?? null

              return $column(spacing.default)(
                $card(spacing.big, style({ flex: 1, width: '100%' }))(
                  $card2(
                    style({
                      padding: 0,
                      height: isDesktopScreen ? '200px' : '200px',
                      position: 'relative',
                      margin: isDesktopScreen ? '-36px -36px 0' : '-12px -12px 0px'
                    })
                  )(
                    $column(style({ width: '100%', padding: 0, height: '200px', placeContent: 'center' }))(
                      $row(
                        style({
                          position: 'absolute',
                          top: '14px',
                          left: isDesktopScreen ? '20px' : '12px',
                          right: isDesktopScreen ? '20px' : '12px',
                          alignSelf: 'center',
                          zIndex: 11,
                          alignItems: 'flex-start'
                        })
                      )(
                        $row(style({ flex: 1 }))(
                          $SelectCollateralToken({
                            selectedList: collateralTokenList
                          })({
                            changeCollateralTokenList: selectCollateralTokenListTether()
                          })
                        ),

                        $row(style({ flex: 1 }))(
                          $node(style({ flex: 1 }))(),

                          $LastAtivity(activityTimeframe)({
                            changeActivityTimeframe: changeActivityTimeframeTether()
                          })
                        )
                      ),

                      $activityStatus
                    )
                  ),

                  $column(spacing.default)(
                    ...activeRouteList.map(collateralToken => {
                      const matchingRuleListForToken = matchingRuleList.filter(
                        rule => rule.collateralToken === collateralToken
                      )

                      // Balance for this collateral token in smart account (unified across chains)
                      const tokenItem = account.portfolio.find(item =>
                        item.tokenChainBalance.some(
                          tcb => tcb.tokenAddress.toLowerCase() === collateralToken.toLowerCase()
                        )
                      )
                      const routeBalance = just(tokenItem ? tokenItem.balance.locked + tokenItem.balance.unlocked : 0n)

                      // Token balance editor for this route
                      const $routeBalanceEditor = smartAccount
                        ? $TokenBalanceEditor({
                            token: collateralToken,
                            balance: routeBalance,
                            walletAccount: account,
                            model: map(
                              drafts =>
                                drafts.find(d => d.token.toLowerCase() === collateralToken.toLowerCase()) ?? {
                                  token: collateralToken,
                                  amount: 0n,
                                  chainId: account.walletClient.chain!.id
                                },
                              draftDepositTokenList
                            )
                          })({
                            changeDraft: changeDraftTether()
                          })
                        : $infoLabel($text('Enable session to deposit'))

                      return $column(style({ paddingLeft: '16px' }))(
                        // Route balance editor (shows token, balance, deposit/withdraw buttons)
                        $routeBalanceEditor,
                        $row(spacing.default)(
                          style({ marginBottom: '30px' })($seperator2),
                          $column(style({ flex: 1, padding: '12px 0' }))(
                            $column(spacing.big)(
                              // user did not set any matching rules for this collateral token
                              matchingRuleListForToken.length === 0
                                ? $infoLabel(
                                    $text(`No matching rules set for ${getTokenDescription(collateralToken).name}`)
                                  )
                                : empty,
                              ...matchingRuleListForToken.map(rule => {
                                const masterMatchingKey = getMasterMatchingKey(collateralToken, rule.master)

                                const mirrorLinkList = positionMap?.[masterMatchingKey] || []

                                return $column(
                                  $Popover({
                                    $open: filterNull(
                                      map(master => {
                                        if (master !== rule.master) {
                                          return null
                                        }

                                        return $MatchingRuleEditor({
                                          draftMatchingRuleList,
                                          model: rule,
                                          masterMatchingKey,
                                          collateralToken,
                                          master: rule.master
                                        })({
                                          changeMatchRuleList: changeMatchRuleListTether()
                                        })
                                      }, popRouteSubscriptionEditor)
                                    ),
                                    dismiss: changeMatchRuleList,
                                    $target: $row(
                                      isDesktopScreen ? spacing.big : spacing.default,
                                      style({ alignItems: 'center' })
                                    )(
                                      $ButtonCircular({
                                        $iconPath: $caretDown,
                                        $container: $defaultButtonCircularContainer(
                                          style({
                                            marginLeft: '-32px',
                                            backgroundColor: pallete.background,
                                            cursor: 'pointer'
                                          })
                                        )
                                      })({
                                        click: popRouteSubscriptionEditorTether(constant(rule.master))
                                      }),
                                      $profileDisplay({
                                        address: rule.master
                                      }),
                                      $responsiveFlex(spacing.default, style({ flex: 1 }))(
                                        $infoLabeledValue(
                                          'Allowance Rate',
                                          $text(`${readablePercentage(rule.allowanceRate)}`)
                                        ),
                                        $infoLabeledValue('Expiry', readableDate(Number(rule.expiry))),
                                        $infoLabeledValue(
                                          'Throttle Duration',
                                          $text(`${getDuration(rule.throttleActivity)}`)
                                        )
                                      )
                                    )
                                  })({}),
                                  $text(
                                    `(${mirrorLinkList.length}) ${getTokenDescription(collateralToken).name} - ${
                                      rule.master
                                    }`
                                  )
                                )
                              })
                            )
                          )
                        )
                      )
                    })
                  )
                )
              )
            })
          )
        }),

        {
          changeActivityTimeframe,
          selectCollateralTokenList,
          selectIndexTokenList,
          changeMatchRuleList,
          changeDraft,
          changeAccount
        }
      ]
    }
  )
