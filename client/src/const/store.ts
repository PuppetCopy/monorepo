
import { IntervalTime } from 'common-utils'
import { ISortBy } from 'ui-components'
import { uiStorage } from 'ui-storage'
import { arbitrum } from 'viem/chains'
import { IWalletTab } from '../pages/type.js'

export const store = uiStorage.createStoreDefinition('root', 5, {
  global: {
    initialState: {
      chain: arbitrum.id,
      wallet: null as null | string,
      activityTimeframe: IntervalTime.WEEK,
      collateralTokenList: [] as string[],
    }
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



