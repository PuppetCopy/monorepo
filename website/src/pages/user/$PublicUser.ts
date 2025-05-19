import { map, mergeArray, now } from '@most/core'
import type { IntervalTime } from '@puppet/middleware/const'
import { $ButtonToggle, $defaulButtonToggleContainer } from '@puppet/middleware/ui-components'
import { ETH_ADDRESS_REGEXP } from '@puppet/middleware/utils'
import { $node, $text, component, type IBehavior, style } from 'aelea/core'
import * as router from 'aelea/router'
import { $column, $row, isDesktopScreen, spacing } from 'aelea/ui-components'
import type { Address } from 'viem/accounts'
import type { IMatchingRuleEditorDraft } from '../../components/portfolio/$MatchRuleEditor.js'
import type { IPageFilterParams, IPageParams, IUserPageParams } from '../type.js'
import { $TraderPage } from './$Trader.js'
import { $AccountLabel, $profileAvatar } from '../../components/$AccountProfile.js'

export interface IProfile extends IPageParams, IPageFilterParams, IUserPageParams {}

type IRouteOption = {
  label: string
  fragment: string
}

export const $PublicUserPage = ({
  activityTimeframe,
  collateralTokenList,
  draftDepositTokenList,
  draftMatchingRuleList,
  matchingRuleQuery,
  route
}: IProfile) =>
  component(
    (
      [changeRoute, changeRouteTether]: IBehavior<string, string>,
      [selectProfileMode, selectProfileModeTether]: IBehavior<IRouteOption, IRouteOption>,
      [changeActivityTimeframe, changeActivityTimeframeTether]: IBehavior<any, IntervalTime>,
      [selectCollateralTokenList, selectCollateralTokenListTether]: IBehavior<Address[]>,
      [changeMatchRuleList, changeMatchRuleListTether]: IBehavior<IMatchingRuleEditorDraft[]>
    ) => {
      const profileAddressRoute = route
      const traderRoute = profileAddressRoute.create({ fragment: 'trader' }).create({
        title: 'Trader',
        fragment: ETH_ADDRESS_REGEXP
      })
      const puppetRoute = profileAddressRoute
        .create({ fragment: 'puppet' })
        .create({ title: 'Puppet', fragment: ETH_ADDRESS_REGEXP })

      const options: IRouteOption[] = [
        {
          label: 'Puppet',
          fragment: 'puppet'
        },
        {
          label: 'Trader',
          fragment: 'trader'
        }
      ]

      const urlFragments = document.location.pathname.split('/')
      const account = urlFragments[urlFragments.length - 1].toLowerCase() as Address

      return [
        $column(spacing.big)(
          $node(),

          $row(spacing.big, style({ alignItems: 'center', placeContent: 'space-between' }))(
            $row(spacing.small, style({ flex: 1, textDecoration: 'none', alignItems: 'center' }))(
              $profileAvatar({ address: account, size: isDesktopScreen ? 50 : 50 }),
              $AccountLabel({
                address: account,
                primarySize: 1.25
              })
            ),
            $ButtonToggle({
              $container: $defaulButtonToggleContainer(style({ alignSelf: 'center' })),
              value: mergeArray([
                router.match<IRouteOption>(puppetRoute)(now(options[0])),
                router.match<IRouteOption>(traderRoute)(now(options[1]))
              ]),
              optionList: options,
              $$option: map((option) => {
                return $node($text(option.label))
              })
            })({ select: selectProfileModeTether() }),
            $node(style({ flex: 1 }))()
          ),

          $column(
            router.match(traderRoute)(
              $column(spacing.big)(
                $TraderPage({
                  account,
                  activityTimeframe,
                  collateralTokenList,
                  draftDepositTokenList,
                  draftMatchingRuleList,
                  matchingRuleQuery,
                  route
                })({
                  selectCollateralTokenList: selectCollateralTokenListTether(),
                  changeRoute: changeRouteTether(),
                  changeActivityTimeframe: changeActivityTimeframeTether(),
                  changeMatchRuleList: changeMatchRuleListTether()
                })
              )
            )
            // router.match(puppetRoute)(
            //   {
            //     run(sink, scheduler) {
            //       const urlFragments = document.location.pathname.split('/')
            //       const address = getAddress(urlFragments[urlFragments.length - 1])
            //       const puppetTradeRouteListQuery = queryPuppetTradeRoute(subgraphClient, { address, activityTimeframe, collateralTokenList })

            //       const settledPositionListQuery = map(async trList => {
            //         const tradeList = (await trList).flatMap(p => p.settledList.map(x => x.position))
            //         return tradeList
            //       }, puppetTradeRouteListQuery)

            //       const openPositionListQuery = map(async trList => {
            //         const tradeList = (await trList).flatMap(p => p.openList.map(x => x.position))
            //         return tradeList
            //       }, puppetTradeRouteListQuery)

            //       return $column(spacing.big)(
            //         $PuppetSummary({ ...config, account, puppet: address, positionListQuery })({}),

            //         $column(spacing.tiny)(
            //           $PuppetProfile({
            //             ...config,
            //             openPositionListQuery,
            //             settledPositionListQuery,
            //             puppetTradeRouteListQuery,
            //           })({
            //             changeRoute: changeRouteTether(),
            //             changeActivityTimeframe: changeActivityTimeframeTether(),
            //             selectCollateralTokenList: selectCollateralTokenListTether(),
            //             modifySubscriber: modifySubscriberTether()
            //           }),
            //         ),

            //       ).run(sink, scheduler)
            //     },
            //   }
            // ),
          ),

          $node(),
          $node()
        ),

        {
          selectCollateralTokenList,
          changeMatchRuleList,
          changeActivityTimeframe,
          changeRoute: mergeArray([
            changeRoute,
            map((option) => {
              const urlFragments = document.location.pathname.split('/')
              const address = urlFragments[urlFragments.length - 1] as Address
              const url = `/profile/${option.fragment}/${address}`
              history.pushState({}, '', url)
              return url
            }, selectProfileMode)
          ])
        }
      ]
    }
  )
