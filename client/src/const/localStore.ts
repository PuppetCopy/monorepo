
import { IntervalTime } from 'common-utils'
import { ISortBy } from 'ui-components'
import { uiStorage } from 'ui-storage'
import { arbitrum } from 'viem/chains'
import { IWalletTab } from '../pages/type.js'

export default uiStorage.createStoreDefinition('root', 8, {
  global: {
    initialState: {
      chain: arbitrum.id,
      wallet: null as null | string,
      activityTimeframe: IntervalTime.WEEK,
      collateralTokenList: [] as string[],
    }
  },
  ruleEditor: {
    initialState: {
      advancedRouteEditorEnabled: false,
    }
  },
  leaderboard: {
    initialState: {
      sortBy: { direction: 'desc', selector: 'roi' } as ISortBy,
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


