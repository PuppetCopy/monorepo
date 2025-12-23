import { GMX_V2_CONTRACT_MAP } from '@puppet/contracts/gmx'
import { ARBITRUM_ADDRESS, BYTES32_ONE } from '@puppet/sdk/const'
import { ignoreAll, readableAddress } from '@puppet/sdk/core'
import { RhinestoneSDK } from '@rhinestone/sdk'
import { combine, fromPromise, map, op, switchMap, tap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { type Address, encodeAbiParameters, erc20Abi, parseAbiParameters } from 'viem'
import { privateKeyToAccount, toAccount } from 'viem/accounts'
import { $icon, $intermediatePromise } from '@/ui-components'
import { $card } from '../common/elements/$common.js'
import { $WalletConnect } from '../components/$WalletConnect.js'
import { $ButtonSecondary } from '../components/form/$Button.js'
import type { IDepositEditorDraft, IWithdrawEditorDraft } from '../components/portfolio/$DepositEditor.js'
import { $TokenBalanceEditor } from '../components/portfolio/$TokenBalanceEditor.js'
import { $info } from '../ui-components/$icons.js'
import wallet from '../wallet/wallet.js'

// Contract addresses (to be configured when deployed)
const TRADER_SUBACCOUNT_HOOK_ADDRESS = import.meta.env.VITE_TRADER_SUBACCOUNT_HOOK as Address | undefined
const SUBACCOUNT_STORAGE_KEY = 'traderSubaccounts'

// Rhinestone SDK for smart account creation (traders only)
const rhinestoneSDK = new RhinestoneSDK({
  apiKey: 'proxy',
  endpointUrl: `${window.location.origin}/api/orchestrator`
})

// Protocol whitelist - trader subaccount can only interact with these addresses
export const WHITELISTED_PROTOCOLS: Address[] = [
  GMX_V2_CONTRACT_MAP.GmxExchangeRouter.address as Address,
  GMX_V2_CONTRACT_MAP.GmxOrderVault.address as Address,
  ARBITRUM_ADDRESS.USDC,
  ARBITRUM_ADDRESS.WETH
]

// Extension messaging
let extensionMessageId = 0
const pendingExtensionMessages = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()

if (typeof window !== 'undefined') {
  window.addEventListener('message', event => {
    if (event.source !== window || event.data?.target !== 'puppet-website') return
    const { id, response } = event.data
    const pending = pendingExtensionMessages.get(id)
    if (pending) {
      pendingExtensionMessages.delete(id)
      response?.success === false ? pending.reject(new Error(response.error)) : pending.resolve(response)
    }
  })
}

function sendToExtension(type: string, payload: unknown): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = extensionMessageId++
    const timeout = setTimeout(() => {
      pendingExtensionMessages.delete(id)
      reject(new Error('Extension timeout'))
    }, 5000)

    pendingExtensionMessages.set(id, {
      resolve: v => {
        clearTimeout(timeout)
        resolve(v)
      },
      reject: e => {
        clearTimeout(timeout)
        reject(e)
      }
    })

    window.postMessage({ target: 'puppet-extension', id, type, payload }, '*')
  })
}

const extensionDetected = sendToExtension('PUPPET_GET_WALLET_STATE', {})
  .then(() => true)
  .catch(() => false)

// Get stored subaccount for address
function getStoredSubaccount(address: Address): { subaccountAddress: Address } | null {
  const stored = localStorage.getItem(SUBACCOUNT_STORAGE_KEY)

  if (!stored) return null

  const data = JSON.parse(stored)
  return data[address] ?? null
}

export const $WalletPage = () =>
  component(
    (
      [walletConnect, walletConnectTether]: IBehavior<any>,
      [clickDisconnect, clickDisconnectTether]: IBehavior<any>,
      [changeDeposit, changeDepositTether]: IBehavior<IDepositEditorDraft>,
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>
    ) => {
      const pageState = op(
        combine({ account: wallet.account, extensionInstalled: fromPromise(extensionDetected) }),
        map(async params => {
          const account = await params.account
          const extensionInstalled = params.extensionInstalled

          if (!account) {
            return { account: null, extensionInstalled, subaccountAddress: null as Address | null }
          }

          // Auto-create subaccount on page visit if not exists
          let stored = getStoredSubaccount(account.address)
          if (!stored) {
            const ownerAccount = toAccount({
              address: account.address,
              signMessage: async () => {
                throw new Error('Owner cannot sign')
              },
              signTransaction: async () => {
                throw new Error('Owner cannot sign')
              },
              signTypedData: async () => {
                throw new Error('Owner cannot sign')
              }
            })

            const subAccount = await rhinestoneSDK.createAccount({
              owners: {
                type: 'ecdsa',
                accounts: [ownerAccount, privateKeyToAccount(BYTES32_ONE)]
              },
              ...(TRADER_SUBACCOUNT_HOOK_ADDRESS && {
                modules: [
                  {
                    type: 'hook' as const,
                    address: TRADER_SUBACCOUNT_HOOK_ADDRESS,
                    initData: encodeAbiParameters(parseAbiParameters('address, address, address'), [
                      GMX_V2_CONTRACT_MAP.GmxExchangeRouter.address as Address,
                      GMX_V2_CONTRACT_MAP.GmxOrderVault.address as Address,
                      ARBITRUM_ADDRESS.USDC
                    ])
                  }
                ]
              })
            })

            const subaccountAddress = subAccount.getAddress()
            const existingData = localStorage.getItem(SUBACCOUNT_STORAGE_KEY)
            const data = existingData ? JSON.parse(existingData) : {}
            data[account.address] = { subaccountAddress }
            localStorage.setItem(SUBACCOUNT_STORAGE_KEY, JSON.stringify(data))

            stored = { subaccountAddress }
          }

          // Sync subaccount to extension if available
          if (extensionInstalled && stored.subaccountAddress) {
            sendToExtension('PUPPET_SET_WALLET_STATE', {
              ownerAddress: account.address,
              smartWalletAddress: stored.subaccountAddress
            }).catch(console.warn)
          }

          return { account, extensionInstalled, subaccountAddress: stored.subaccountAddress }
        })
      )

      return [
        $intermediatePromise({
          $display: map(async pageStateValue => {
            const { account, extensionInstalled, subaccountAddress } = await pageStateValue

            if (!account) {
              return $column(
                spacing.big,
                style({ alignItems: 'center', justifyContent: 'center', padding: '60px 24px', flex: 1 })
              )(
                $icon({ $content: $info, viewBox: '0 0 32 32', width: '48px', fill: pallete.foreground }),
                $column(spacing.small, style({ alignItems: 'center', textAlign: 'center' }))(
                  $node(style({ fontSize: '1.2rem', fontWeight: 'bold' }))($text('Connect Your Wallet')),
                  $node(style({ color: pallete.foreground }))($text('Connect to create a trading subaccount'))
                ),
                $WalletConnect()({ connect: walletConnectTether() })
              )
            }

            const walletBalance = state(
              op(
                switchMap(
                  () => wallet.getTokenBalance(ARBITRUM_ADDRESS.USDC, account.address, 42161, true),
                  wallet.account
                )
              ),
              0n
            )

            // Deposit execution
            const depositExecution = op(
              changeDeposit,
              tap(draft => {
                if (!subaccountAddress) return alert('Create subaccount first')
                account.walletClient
                  .writeContract({
                    address: draft.token,
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [subaccountAddress, draft.amount],
                    chain: account.walletClient.chain,
                    account: account.walletClient.account!
                  })
                  .then(tx => alert(`Deposit sent: ${tx}`))
                  .catch(e => alert(`Failed: ${e.message}`))
              })
            )

            return $column(spacing.big, style({ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' }))(
              ignoreAll(depositExecution),

              // Extension warning
              !extensionInstalled
                ? $card(spacing.default)(
                    $row(spacing.small, style({ alignItems: 'center' }))(
                      $node(
                        style({ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: pallete.negative })
                      )(),
                      $node(style({ color: pallete.negative }))($text('Extension not detected'))
                    ),
                    $node(style({ color: pallete.foreground, fontSize: '0.75rem' }))(
                      $text('Install the Puppet Wallet extension to use your wallet on external dApps.')
                    )
                  )
                : $node(),

              // Main card
              $card(spacing.default)(
                $column(spacing.default)(
                  $node(style({ color: pallete.foreground, fontSize: '0.75rem' }))($text('Trading Subaccount')),
                  $node(style({ fontFamily: 'monospace' }))($text(readableAddress(subaccountAddress!))),
                  $TokenBalanceEditor({
                    token: ARBITRUM_ADDRESS.USDC,
                    balance: walletBalance,
                    account
                  })({
                    changeDeposit: changeDepositTether(),
                    changeWithdraw: changeWithdrawTether()
                  })
                ),

                $ButtonSecondary({ $content: $text('Disconnect') })({
                  click: clickDisconnectTether(tap(() => wallet.disconnect()))
                })
              )
            )
          }, pageState)
        }),

        { walletConnect, clickDisconnect, changeDeposit, changeWithdraw }
      ]
    }
  )
