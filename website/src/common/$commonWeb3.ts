import { $anchor } from '@puppet/middleware/ui-components'
import { getExplorerUrl, shortenTxAddress } from '@puppet/middleware/utils'
import { $text, attr, type I$Node } from 'aelea/core'
import type * as viem from 'viem'

export const $txHashRef = (txHash: string, chain: viem.Chain, label?: I$Node) => {
  const href = `${getExplorerUrl(chain)}/tx/${txHash}` // (chain, txHash)

  return $anchor(attr({ href }))(label ?? $text(shortenTxAddress(txHash)))
}
