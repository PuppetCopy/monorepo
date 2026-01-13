import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { setExtensionWalletState } from '@puppet/wallet/client'
import { type RhinestoneAccount, RhinestoneSDK, walletClientToAccount } from '@rhinestone/sdk'
import type { GetConnectionReturnType } from '@wagmi/core'
import { getWalletClient } from '@wagmi/core'
import {
  type Chain,
  encodeAbiParameters,
  getAddress,
  type Hex,
  keccak256,
  type Transport,
  toBytes,
  toHex,
  type WalletClient
} from 'viem'
import { type Address, privateKeyToAccount } from 'viem/accounts'
import wallet from './wallet.js'

// Rhinestone SDK for smart account creation and orchestration
export const rhinestoneSDK = new RhinestoneSDK({
  apiKey: 'proxy',
  endpointUrl: `${window.location.origin}/api/orchestrator`
})

export type SessionSigner = ReturnType<typeof privateKeyToAccount>

export type IConnectedAccountState = {
  connection: GetConnectionReturnType<typeof wallet.wagmi>
  walletClient: WalletClient<Transport, Chain>
  address: Address
  sessionSigner: null
}

// Base type for any account with session signer
export type ISignerAccountBase = {
  connection: GetConnectionReturnType<typeof wallet.wagmi>
  walletClient: WalletClient<Transport, Chain>
  address: Address
  sessionSigner: SessionSigner
  portfolio: PortfolioItem[]
}

export type IPuppetAccountState = ISignerAccountBase & {
  subaccount: RhinestoneAccount
}

export type IMasterAccountState = ISignerAccountBase & {
  subaccount: RhinestoneAccount
  baseTokenId: Hex
}

// Union type for any smart account (Puppet or Master)
export type ISmartAccountState = IPuppetAccountState | IMasterAccountState

export type IAccountState = IConnectedAccountState | ISmartAccountState | null

const PUPPET_ADDRESS_STORAGE_KEY = 'puppet:account:'
const PUPPET_SIGNER_STORAGE_KEY = 'puppet:signer:'

const SIGNER_DERIVATION_MESSAGE = `Puppet Protocol Session Authorization

Sign this message to authorize your trading session.

This signature will not cost any gas and does not grant access to your funds.`

export async function signSession(account: IConnectedAccountState): Promise<Hex> {
  const message = await account.walletClient.signMessage({
    message: SIGNER_DERIVATION_MESSAGE,
    account: account.address
  })

  const privateKey = keccak256(toBytes(message))

  // Store only the privateKey in localStorage as fallback
  // The full wallet state (with smartWalletAddress) is set when the smart account is created
  localStorage.setItem(PUPPET_SIGNER_STORAGE_KEY + account.address, privateKey)

  return privateKey
}

export async function initializeAccountState(
  connection: GetConnectionReturnType
): Promise<IConnectedAccountState | null> {
  if (connection.status !== 'connected' || !connection.connector || !connection.chainId) return null
  if (typeof connection.connector.getChainId !== 'function') return null

  const walletClient = await getWalletClient(wallet.wagmi, { chainId: connection.chainId })
  const address = walletClient.account.address

  return {
    sessionSigner: null,
    walletClient,
    address,
    connection
  }
}

export async function initializePuppetAccount(
  connectedAccount: IConnectedAccountState,
  sessionKey: Hex
): Promise<IPuppetAccountState> {
  const sessionSigner = privateKeyToAccount(sessionKey)

  const subaccount = await rhinestoneSDK.createAccount({
    account: {
      type: 'kernel',
      version: '3.3'
    },
    owners: {
      type: 'ecdsa',
      accounts: [sessionSigner, walletClientToAccount(connectedAccount.walletClient)]
    },
    modules: [
      {
        type: 'executor',
        address: PUPPET_CONTRACT_MAP.Allocate.address,
        initData: '0x'
      }
    ]
  })

  const portfolio = await getPortfolio(subaccount.getAddress(), false)

  const smartAccountAddress = subaccount.getAddress()

  try {
    await setExtensionWalletState(connectedAccount.address, {
      smartWalletAddress: smartAccountAddress,
      subaccountName: toHex('default', { size: 32 }),
      privateKey: sessionKey
    })
  } catch {
    localStorage.setItem(PUPPET_ADDRESS_STORAGE_KEY + connectedAccount.address, smartAccountAddress)
  }

  return {
    ...connectedAccount,
    portfolio,
    subaccount,
    sessionSigner
  }
}

// Legacy alias
export const initializeSmartAccount = initializePuppetAccount

export async function createMasterAccount(
  connectedAccount: IConnectedAccountState,
  sessionSigner: SessionSigner,
  params: MasterAccountParams
): Promise<RhinestoneAccount> {
  const master = await rhinestoneSDK.createAccount({
    account: {
      type: 'kernel',
      version: '3.3'
    },
    owners: {
      type: 'ecdsa',
      accounts: [sessionSigner, walletClientToAccount(connectedAccount.walletClient)]
    },
    modules: [
      {
        type: 'hook',
        address: PUPPET_CONTRACT_MAP.MasterHook.address,
        initData: encodeAbiParameters(
          [
            { name: 'user', type: 'address' },
            { name: 'signer', type: 'address' },
            { name: 'baseTokenId', type: 'bytes32' },
            { name: 'name', type: 'bytes32' }
          ],
          [connectedAccount.address, sessionSigner.address, params.baseTokenId, params.name ?? toHex('', { size: 32 })]
        )
      }
    ]
  })

  return master
}

export async function initializeMasterAccount(
  connectedAccount: IConnectedAccountState,
  sessionKey: Hex,
  params: MasterAccountParams
): Promise<IMasterAccountState> {
  const sessionSigner = privateKeyToAccount(sessionKey)
  const master = await createMasterAccount(connectedAccount, sessionSigner, params)

  const portfolio = await getPortfolio(master.getAddress(), false)
  const masterAddress = master.getAddress()

  try {
    await setExtensionWalletState(connectedAccount.address, {
      smartWalletAddress: masterAddress,
      subaccountName: toHex('master', { size: 32 }),
      privateKey: sessionKey
    })
  } catch {
    localStorage.setItem(PUPPET_ADDRESS_STORAGE_KEY + connectedAccount.address, masterAddress)
  }

  return {
    ...connectedAccount,
    portfolio,
    subaccount: master,
    sessionSigner,
    baseTokenId: params.baseTokenId
  }
}

export interface MasterAccountParams {
  baseTokenId: Hex // Chain-agnostic token ID (e.g., TOKEN_ID.USDC)
  name?: Hex
}

// Common token IDs for cross-chain deterministic addresses
export const TOKEN_ID = {
  USDC: keccak256(toHex('USDC')),
  USDT: keccak256(toHex('USDT')),
  WETH: keccak256(toHex('WETH')),
  WBTC: keccak256(toHex('WBTC')),
  FRAX: keccak256(toHex('FRAX'))
} as const

export type PortfolioTokenBalance = {
  tokenAddress: Address
  chainId: number
  balance: { locked: bigint; unlocked: bigint }
}

export type PortfolioItem = {
  tokenName: string
  tokenDecimals: number
  balance: { locked: bigint; unlocked: bigint }
  tokenChainBalance: PortfolioTokenBalance[]
}

export async function getPortfolio(subAccountAddress: Address, refresh: boolean): Promise<PortfolioItem[]> {
  const url = new URL(`/api/orchestrator/accounts/${subAccountAddress}/portfolio`, window.location.origin)
  if (refresh) url.searchParams.set('refresh', 'true')

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch portfolio: ${response.statusText}`)

  const data = await response.json()
  const rawPortfolio = data.portfolio as Array<{
    tokenName: string
    tokenDecimals: number
    balance: { locked: string; unlocked: string }
    tokenChainBalance: Array<{
      tokenAddress: string
      chainId: number
      balance: { locked: string; unlocked: string }
    }>
  }>

  // Parse string balances to bigints
  const parseBalance = (bal: { locked: string; unlocked: string }) => ({
    locked: bal?.locked ? BigInt(bal.locked) : 0n,
    unlocked: bal?.unlocked ? BigInt(bal.unlocked) : 0n
  })

  return rawPortfolio.map(item => ({
    tokenName: item.tokenName,
    tokenDecimals: item.tokenDecimals,
    balance: parseBalance(item.balance),
    tokenChainBalance: item.tokenChainBalance.map(tcb => ({
      tokenAddress: getAddress(tcb.tokenAddress),
      chainId: tcb.chainId,
      balance: parseBalance(tcb.balance)
    }))
  }))
}
