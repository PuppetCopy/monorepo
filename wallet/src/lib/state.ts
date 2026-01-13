import type { Address, Hex } from 'viem'

export interface Subaccount {
  account: Address // Master/controller address
  subaccount: Address
  signerKey: Hex // Session signer private key
  subaccountName: Hex // bytes32 encoded name
}

export interface StoredState {
  subaccountMap: Record<Address, Subaccount>
  activeAccount: Address | null
}

export const DEFAULT_STATE: StoredState = {
  subaccountMap: {},
  activeAccount: null
}
