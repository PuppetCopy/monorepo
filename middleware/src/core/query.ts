import { map, multicast } from '@most/core'
import type { Stream } from '@most/types'
import { replayLatest } from 'aelea/core'
import { querySignedPrices } from '../gmx/price.js'
import type { IPriceOracleMap } from '../gmx/types.js'
import { periodicRun } from '../utils/stream.js'

export const latestPriceMap: Stream<IPriceOracleMap> = replayLatest(
  multicast(
    periodicRun({
      startImmediate: true,
      interval: 2500,
      actionOp: map(async () => {
        const newLocal = await querySignedPrices()
        return newLocal
      })
    })
  )
)
