import { $text, style } from "@aelea/dom"
import { $column, $row, layoutSheet } from "@aelea/ui-components"
import { map, switchLatest } from "@most/core"
import { applyFactor, combineState, readableTokenAmountLabel, switchMap } from "../utils/index.js"
import { ARBITRUM_ADDRESS, TOKEN_DESCRIPTION_MAP } from "../const/index.js"
import { $infoLabel, intermediateText } from "ui-components"
import tokenomicsReader from "../logic/tokenomicsReader"
import { $seperator2 } from "../pages/common"
import { IWalletPageParams } from "../pages/type"
import { $disconnectedWalletDisplay, $profileDisplay } from "./$AccountProfile.js"

export interface IWalletDisplay extends IWalletPageParams {
}

export const $walletProfileDisplay = (config: IWalletDisplay) => {
  const { walletClientQuery } = config


  return switchLatest(switchMap(async walletQuery => {
    const wallet = await walletQuery

    if (wallet === null) {
      return $row(layoutSheet.spacingSmall, style({ alignItems: 'center', pointerEvents: 'none', paddingRight: '16px' }))(
        $disconnectedWalletDisplay(),
        $seperator2,
        style({ fontSize: '.75rem', fontWeight: 'bold' })($text('Not connected'))
      )
    }

    const address = wallet.account.address

    return $row(layoutSheet.spacingSmall, style({ alignItems: 'center', pointerEvents: 'none', paddingRight: '16px' }))(
      address
        ? $profileDisplay({ account: address })
        : style({ cursor: 'pointer' }, $disconnectedWalletDisplay()),

      $seperator2,

      $column(
        style({ fontSize: '.85em' })(
          $infoLabel(
            'Claimable'
          )
        ),
        $text(style({ whiteSpace: 'nowrap' }))(
          intermediateText(map(async params => {
            const claimableContributionReward = await params.claimableContributionQuery
            const claimableLockReward = await params.claimableLockRewardQuery
            const claimableVested = await params.claimableVestedQuery
            const vested = await params.vestedQuery
            const total = applyFactor(await params.baselineEmissionRateQuery, claimableContributionReward) + claimableLockReward + claimableVested


            console.log(claimableVested, vested)

            return readableTokenAmountLabel(TOKEN_DESCRIPTION_MAP.PUPPET, total)
          }, combineState({
            baselineEmissionRateQuery: tokenomicsReader.ContributeLogic.getConfig(wallet),
            claimableContributionQuery: tokenomicsReader.ContributeLogic.getClaimable(wallet, [ARBITRUM_ADDRESS.USDC, ARBITRUM_ADDRESS.NATIVE_TOKEN], wallet.account.address),
            claimableLockRewardQuery: tokenomicsReader.RewardLogic.getClaimable(wallet, wallet.account.address),
            claimableVestedQuery: tokenomicsReader.VotingEscrowLogic.getClaimable(wallet, wallet.account.address),
            vestedQuery: tokenomicsReader.VotingEscrowStore.getVested(wallet, wallet.account.address),
          })))
        )
      )
    )
  }, walletClientQuery))
}


