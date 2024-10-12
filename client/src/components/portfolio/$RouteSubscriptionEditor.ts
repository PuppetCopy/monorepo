
import { Behavior, combineObject } from "@aelea/core"
import { $element, $node, $text, attr, component, style, stylePseudo } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { colorAlpha, pallete } from "@aelea/ui-components-theme"
import { empty, map, mergeArray, never, now, snapshot, startWith } from "@most/core"
import { IntervalTime, formatFixed, parseBps, switchMap, unixTimestampNow } from "common-utils"
import * as viem from "viem"
import { theme } from "../../assignThemeSync.js"
import { $FieldLabeled } from "ui-components"
import { $route } from "../../common/$common"
import { IWalletPageParams } from "../../pages/type.js"
import { $ButtonSecondary } from "../form/$Button.js"
import { $Dropdown } from "../form/$Dropdown"
import { $SelectCollateralToken } from "../$CollateralTokenSelector"
import { Stream } from "@most/types"

interface IRouteSubscriptionEditor {
  expiry: bigint
  trader: viem.Address
  selectedCollateralTokenList: Stream<viem.Address[]>
}

export interface IChangeSubscription {
  expiry: bigint
  allowance: bigint
  trader: viem.Address
  collateralToken: viem.Address
  previousSubscriptionExpiry: bigint
}

export const $RouteSubscriptionEditor = (config: IRouteSubscriptionEditor & IWalletPageParams) => component((
  [inputEndDate, inputEndDateTether]: Behavior<any, bigint>,
  [inputAllowance, inputAllowanceTether]: Behavior<any, bigint>,
  [clickUnsubscribe, clickUnsubscribeTether]: Behavior<any, IChangeSubscription>,
  [clickSubmit, clickSubmitTether]: Behavior<any, IChangeSubscription>,
  [selectMarketTokenList, selectMarketTokenListTether]: Behavior<viem.Address[]>,
) => {

  const { trader, selectedCollateralTokenList,  walletClientQuery } = config

  const allowance = mergeArray([
    // switchMap(async walletQuery => {
    //   const wallet = await walletQuery
    //   if (wallet === null) {
    //     return ''
    //   }

    //   const amount = await readPuppetAllowance(wallet, wallet.account.address)
    //   return amount || ''
    // }, walletClientQuery),
    inputAllowance
  ])

  
  const expiry = mergeArray([
    now(config.expiry ? config.expiry : BigInt(unixTimestampNow() + IntervalTime.YEAR)),
    inputEndDate
  ])

  const routeTypeKey = startWith('0x', never())
  
  const form = combineObject({
    allowance,
    expiry,
    routeTypeKey
  })


  const isSubscribed = config.expiry !== 0n

  
  return [
    $column(layoutSheet.spacing, style({ maxWidth: '350px' }))(
      $text('The following rules will apply to this trader whenever he opens and maintain a position'),

      $SelectCollateralToken({
        selectedList: selectedCollateralTokenList,
      })({
        selectMarketTokenList: selectMarketTokenListTether()
      }),


      $FieldLabeled({
        label: 'Allow %',
        value: map(x => x ? `${formatFixed(4, x) * 100}` : '', allowance),
        labelWidth: 100,
        hint: `% allocated per adjustment. 1-10% is recommended`,
      })({
        change: inputAllowanceTether(
          map(x => parseBps(x / 100))
        )
      }),

      $FieldLabeled({
        label: 'Expiration',
        $input: $element('input')(
          attr({ type: 'date' }),
          stylePseudo('::-webkit-calendar-picker-indicator', { filter: theme.name === 'dark' ? `invert(1)` : '' })
        ),
        hint: 'set a date when this rule will expire, default is 1 year',
        placeholder: 'never',
        labelWidth: 100,
        value: map(time => {
          return new Date(Number(time * 1000n)).toISOString().slice(0, 10)
        }, expiry),
      })({
        change: inputEndDateTether(
          map(x => BigInt(new Date(x).getTime() / 1000))
        )
      }),

      $node(),

      $row(style({ placeContent: 'space-between', alignItems: 'center' }))(
        // $ButtonSecondary({
        //   $content: $text('Unsubscribe'),
        //   disabled: now(!isSubscribed)
        // })({
        //   click: clickUnsubscribeTether(
        //     snapshot(params => {
        //       return { ...params, previousSubscriptionExpiry: config.expiry, trader: config.trader, expiry: 0n,  }
        //     }, form)
        //   )
        // }),

        $ButtonSecondary({
          $content: $text('Subscribe'),
          disabled: map(params => !params.allowance, form)
        })({
          click: clickSubmitTether(
            snapshot(params => {
              return { ...params, previousSubscriptionExpiry: config.expiry, trader: config.trader,  }
            }, form)
          )
        })
          
      )
    ),

    {
      selectMarketTokenList,
      modifySubscriber: mergeArray([
        clickSubmit,
        clickUnsubscribe
      ]),
    }
  ]
})
