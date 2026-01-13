import type { IMasterLatestMetric } from '@puppet/database/schema'
import { IntervalTime } from '@puppet/sdk/const'
import { arbitrum } from 'viem/chains'
import type { ISortBy } from '@/ui-components'
import { uiStorage } from '@/ui-storage'
import { WALLET_TAB } from '../pages/types.js'

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
    sortBy: { direction: 'desc', selector: 'realisedPnl' } as ISortBy<IMasterLatestMetric>,
    focus: 'realisedPnl',
    isLong: undefined as boolean | undefined,
    account: undefined as string | undefined
  },
  wallet: {
    selectedTab: WALLET_TAB.PUPPET
  },
  earnings: {
    cashout: false,
    scheduleFactor: 1
  }
})
