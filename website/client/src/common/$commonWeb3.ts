import { $Node, attr, $text } from "@aelea/dom"
import { getExplorerUrl, shortenTxAddress } from "@puppet/middleware/utils"
import { $anchor } from "@puppet/middleware/ui-components"
import * as viem from "viem"



export const $txHashRef = (txHash: string, chain: viem.Chain, label?: $Node) => {
  const href = getExplorerUrl(chain) + '/tx/' + txHash // (chain, txHash)

  return $anchor(attr({ href }))(label ?? $text(shortenTxAddress(txHash)))
}
