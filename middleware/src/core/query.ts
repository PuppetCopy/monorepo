import { map, multicast } from '@most/core'
import { replayLatest } from 'aelea/core'
import { querySignedPrices } from '../gmx/price.js'
import { periodicRun } from './stream.js'

export const latestPriceMap = replayLatest(
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
