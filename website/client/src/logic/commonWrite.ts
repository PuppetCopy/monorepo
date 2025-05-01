import { Address } from "abitype"
import { getMappedValue } from "@puppet/middleware/utils"
import * as PUPPET from "@puppet/middleware/const"
import { erc20Abi } from "viem"
import * as walletLink from "@puppet/middleware/wallet"
import { MAX_UINT256 } from "@puppet/middleware/const"



export type IApproveSpendReturn = ReturnType<typeof writeApproveSpend>
export async function writeApproveSpend(
  walletClient: walletLink.IWalletClient,
  token: Address,
  amount = MAX_UINT256,
  contractDefs = getMappedValue(PUPPET.CONTRACT, walletClient.chain.id),
  spender = contractDefs.Router.address
): walletLink.IWriteContractReturn<typeof erc20Abi, 'Approval'> {
  return walletLink.writeContract({
    walletClient,
    address: token,
    abi: erc20Abi,
    eventName: 'Approval',
    functionName: 'approve',
    args: [spender, amount]
  })
}
