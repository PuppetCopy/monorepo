import { startWith, switchLatest, tap } from '@most/core'
import { ignoreAll, switchMap } from '@puppet/middleware/utils'
import { getAccount } from '@wagmi/core'
import { $text, behavior, nodeEvent, style } from 'aelea/core'
import { $column, $row, layoutSheet } from 'aelea/ui-components'
import { $seperator2 } from '../pages/common.js'
import type { IWalletPageParams } from '../pages/type.js'
import { accountChange, wagmiConfig, walletConnectAppkit } from '../walletConnect.js'
import { $disconnectedWalletDisplay, $profileDisplay } from './$AccountProfile.js'

export interface IWalletDisplay extends IWalletPageParams {}

export const $walletProfileDisplay = (config: IWalletDisplay) => {
  const accountStatus = getAccount(wagmiConfig)
  const account = accountStatus.connector === undefined ? startWith(accountStatus, accountChange) : accountChange

  const [click, clickTether] = behavior()

  return switchLatest(
    switchMap(async (accountInfo) => {
      if (!accountInfo.address) {
        return $row(
          clickTether(
            nodeEvent('pointerdown'),
            tap((es) => {
              walletConnectAppkit.open()
            })
          ),
          spacing.small,
          style({ alignItems: 'center', paddingRight: '16px' })
        )(
          ignoreAll(click),
          $disconnectedWalletDisplay(),
          $seperator2,
          $column(
            style({ fontSize: '.75rem' })($text('Click to')),
            style({ fontSize: '.75rem', fontWeight: 'bold' })($text('Connect'))
          )
        )
      }

      return $row(
        spacing.small,
        style({ alignItems: 'center', pointerEvents: 'none', paddingRight: '16px' })
      )(
        accountInfo.address
          ? $profileDisplay({ account: accountInfo.address })
          : style({ cursor: 'pointer' }, $disconnectedWalletDisplay())

        // $seperator2,

        // $column(
        //   style({ fontSize: '.85em' })(
        //     $infoLabel(
        //       'Claimable'
        //     )
        //   ),
        //   $text(style({ whiteSpace: 'nowrap' }))(
        //     intermediateText(map(async params => {
        //       const claimableContributionReward = await params.claimableContributionQuery
        //       const claimableLockReward = await params.claimableLockRewardQuery
        //       const claimableVested = await params.claimableVestedQuery
        //       const vested = await params.vestedQuery
        //       const total = applyFactor(await params.baselineEmissionRateQuery, claimableContributionReward) + claimableLockReward + claimableVested

        //       console.log(claimableVested, vested)

        //       return readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, total)
        //     }, combineState({
        //       baselineEmissionRateQuery: tokenomicsReader.ContributeLogic.getConfig(wallet),
        //       claimableContributionQuery: tokenomicsReader.ContributeLogic.getClaimable(wallet, [ARBITRUM_ADDRESS.USDC, ARBITRUM_ADDRESS.NATIVE_TOKEN], wallet.account.address),
        //       claimableLockRewardQuery: tokenomicsReader.RewardLogic.getClaimable(wallet, wallet.account.address),
        //       claimableVestedQuery: tokenomicsReader.VotingEscrowLogic.getClaimable(wallet, wallet.account.address),
        //       vestedQuery: tokenomicsReader.VotingEscrowStore.getVested(wallet, wallet.account.address),
        //     })))
        //   )
        // )
      )
    }, account)
  )
}
