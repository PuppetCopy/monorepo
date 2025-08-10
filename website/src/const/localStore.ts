import { IntervalTime } from '@puppet-copy/middleware/const'
import type { ITraderRouteLatestMetric } from '@puppet-copy/sql/schema'
import { arbitrum } from 'viem/chains'
import type { ISortBy } from '@/ui-components'
import { uiStorage } from '@/ui-storage'
import { IWalletTab } from '../pages/type.js'

export const localStore = uiStorage.createStoreDefinition('root', 8, {
  global: {
    chain: arbitrum.id,
    wallet: null as null | string,
    activityTimeframe: IntervalTime.WEEK,
    collateralTokenList: [] as string[],
    indexTokenList: [] as string[]
  },
  ruleEditor: {
    advancedRouteEditorEnabled: false
  },
  leaderboard: {
    sortBy: { direction: 'desc', selector: 'pnl' } as ISortBy<ITraderRouteLatestMetric>,
    focus: 'pnl',
    isLong: undefined as boolean | undefined,
    account: undefined as string | undefined
  },
  wallet: {
    selectedTab: IWalletTab.PUPPET
  },
  earnings: {
    cashout: false,
    scheduleFactor: 1
  }
})
