import { $anchor } from '@puppet-copy/middleware/ui-components'
import { getExplorerUrl, shortenTxAddress } from '@puppet-copy/middleware/utils'
import { $text, attr, type I$Node } from 'aelea/core'
import type { Chain } from 'viem/chains'

export const $txHashRef = (txHash: string, chain: Chain, label?: I$Node) => {
  const href = `${getExplorerUrl(chain)}/tx/${txHash}` // (chain, txHash)

  return $anchor(attr({ href }))(label ?? $text(shortenTxAddress(txHash)))
}
