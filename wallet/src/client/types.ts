import type { Hex } from 'viem'

// Message types for extension communication
export const MessageType = {
  GET_WALLET_STATE: 'PUPPET_GET_WALLET_STATE',
  SET_WALLET_STATE: 'PUPPET_SET_WALLET_STATE',
  SET_ACTIVE_WALLET: 'PUPPET_SET_ACTIVE_WALLET',
  CLEAR_WALLET_STATE: 'PUPPET_CLEAR_WALLET_STATE',
  CLEAR_ALL: 'PUPPET_CLEAR_ALL'
} as const

export type MessageType = (typeof MessageType)[keyof typeof MessageType]

export interface WalletState {
  smartWalletAddress: string
  subaccountName: Hex
  privateKey: Hex
}
