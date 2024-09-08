
import * as GMX from 'gmx-middleware-const'
import { IWalletTab, ITradeFocusMode } from '../pages/type.js'
import { ISortBy } from 'ui-components'
import { MARKET_TOKEN_MAP } from 'gmx-middleware-utils'
import * as viem from 'viem'
import { IntervalTime } from 'common-utils'
import { arbitrum } from 'viem/chains'
import { uiStorage } from 'ui-storage'

export const store = uiStorage.createStoreDefinition('root', 4, {
  global: {
    initialState: {
      chain: arbitrum.id,
      wallet: null as null | string,
      activityTimeframe: IntervalTime.WEEK,
      collateralTokenList: [] as viem.Address[],
    }
  },
  tradeBox: {
    initialState: {
      chartInterval: IntervalTime.MIN15,
      isTradingEnabled: false,
      isLong: true,
      focusMode: ITradeFocusMode.collateral,
      slippage: 30n,
      executionFeeBuffer: 3000n,
      primaryToken: GMX.ARBITRUM_ADDRESS.USDC,
      isUsdCollateralToken: true,
      feeRateIntervalDisplay: IntervalTime.HR,
      leverage: GMX.MAX_LEVERAGE_FACTOR / 4n,
      tradeRoute: null as viem.Address | null,
      marketToken: Object.values(MARKET_TOKEN_MAP)[0],
      traderRouteMap: {} as Record<string, viem.Address>
    },
  },
  leaderboard: {
    initialState: {
      sortBy: { direction: 'desc', selector: 'pnl' } as ISortBy,
      isLong: undefined as boolean | undefined,
    }
  },
  wallet: {
    initialState: {
      selectedTab: IWalletTab.PUPPET,
    }
  },
  earnings: {
    initialState: {
      cashout: false,
      scheduleFactor: 1,
    }
  }
})



