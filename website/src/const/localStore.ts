import { IntervalTime } from '@puppet-copy/middleware/const'
import type { ISortBy } from '@puppet-copy/middleware/ui-components'
import { uiStorage } from '@puppet-copy/middleware/ui-storage'
import { arbitrum } from 'viem/chains'
import { IWalletTab } from '../pages/type.js'

export const localStore = uiStorage.createStoreDefinition('root', 8, {
  global: {
    initialState: {
      chain: arbitrum.id,
      wallet: null as null | string,
      activityTimeframe: IntervalTime.WEEK,
      collateralTokenList: [] as string[]
    }
  },
  ruleEditor: {
    initialState: {
      advancedRouteEditorEnabled: false
    }
  },
  leaderboard: {
    initialState: {
      sortBy: { direction: 'desc', selector: 'pnl' } as ISortBy,
      focus: 'pnl',
      isLong: undefined as boolean | undefined,
      account: undefined as string | undefined
    }
  },
  wallet: {
    initialState: {
      selectedTab: IWalletTab.PUPPET
    }
  },
  earnings: {
    initialState: {
      cashout: false,
      scheduleFactor: 1
    }
  }
})
