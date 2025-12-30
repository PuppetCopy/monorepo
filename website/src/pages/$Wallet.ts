import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { ARBITRUM_ADDRESS } from '@puppet/sdk/const'
import { ignoreAll, readableAddress } from '@puppet/sdk/core'
import { just, map, op, switchMap, tap } from 'aelea/stream'
import { type IBehavior, state } from 'aelea/stream-extended'
import { $node, $text, component, style } from 'aelea/ui'
import { $column, $row, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { encodeFunctionData, erc20Abi, type Hex, keccak256, stringToHex, toBytes } from 'viem'
import type { Address } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import { $icon, $intermediatePromise, $spinner } from '@/ui-components'
import { $card } from '../common/elements/$common.js'
import { $WalletConnect } from '../components/$WalletConnect.js'
import { $ButtonSecondary } from '../components/form/$Button.js'
import type { IDepositEditorDraft, IWithdrawEditorDraft } from '../components/portfolio/$DepositEditor.js'
import { $TokenBalanceEditor } from '../components/portfolio/$TokenBalanceEditor.js'
import { $info } from '../ui-components/$icons.js'
import wallet, { getOrDeriveSigner, type IAccountState, SIGNER_DERIVATION_MESSAGE } from '../wallet/wallet.js'

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

function sendToExtension(type: string, payload: unknown, timeoutMs = 1000): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const id = extensionMessageId++
    const timeout = setTimeout(() => {
      pendingExtensionMessages.delete(id)
      reject(new Error('Extension timeout'))
    }, timeoutMs)

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

function checkExtension(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)
  return sendToExtension('PUPPET_GET_WALLET_STATE', {})
    .then(() => true)
    .catch(() => false)
}

interface RegisterMasterSubaccountParams {
  accountState: IAccountState
  token: Address
  subaccountName: string
}

async function registerMasterSubaccount({
  accountState,
  token,
  subaccountName
}: RegisterMasterSubaccountParams): Promise<{ txHash: Hex; signerAddress: Address }> {
  const { walletClient, address, rhinestoneAccount } = accountState
  const subaccountAddress = rhinestoneAccount.getAddress()
  const subaccountNameBytes32 = stringToHex(subaccountName, { size: 32 })

  const signer = await getOrDeriveSigner(accountState)

  const result = await rhinestoneAccount.sendTransaction({
    chain: arbitrum,
    calls: [
      {
        to: PUPPET_CONTRACT_MAP.Allocation.address,
        data: encodeFunctionData({
          abi: PUPPET_CONTRACT_MAP.Allocation.abi,
          functionName: 'createMasterSubaccount',
          args: [address, signer.address, subaccountAddress, token, subaccountNameBytes32]
        })
      }
    ]
  })

  const receipt = await rhinestoneAccount.waitForExecution(result)
  const txHash = ('transactionHash' in receipt ? receipt.transactionHash : null) as Hex

  const hasExtension = await checkExtension()
  if (hasExtension) {
    const privateKey = keccak256(
      toBytes(
        await walletClient.signMessage({
          message: SIGNER_DERIVATION_MESSAGE,
          account: address
        })
      )
    )
    await sendToExtension('PUPPET_SET_WALLET_STATE', {
      ownerAddress: address,
      smartWalletAddress: subaccountAddress,
      subaccountName: subaccountNameBytes32,
      privateKey
    }, 5000)
  }

  return { txHash, signerAddress: signer.address }
}

export const $WalletPage = () =>
  component(
    (
      [walletConnect, walletConnectTether]: IBehavior<any>,
      [clickDisconnect, clickDisconnectTether]: IBehavior<any>,
      [changeDeposit, changeDepositTether]: IBehavior<IDepositEditorDraft>,
      [changeWithdraw, changeWithdrawTether]: IBehavior<IWithdrawEditorDraft>
    ) => {
      return [
        $intermediatePromise({
          $display: op(
            wallet.account,
            map(async accountPromise => {
              const account = await accountPromise

              // const { account, subaccountState } = await pageStateValue

              if (!account) {
                return $column(
                  spacing.big,
                  style({ alignItems: 'center', justifyContent: 'center', padding: '60px 24px', flex: 1 })
                )(
                  $icon({ $content: $info, viewBox: '0 0 32 32', width: '48px', fill: pallete.foreground }),
                  $column(spacing.small, style({ alignItems: 'center', textAlign: 'center' }))(
                    $node(style({ fontSize: '1.2rem', fontWeight: 'bold' }))($text('Connect Your Wallet')),
                    $node(style({ color: pallete.foreground }))($text('Connect to create a subaccount'))
                  ),
                  $WalletConnect()({ connect: walletConnectTether() })
                )
              }

              const subaccountAddress = account.rhinestoneAccount.getAddress()

              const extensionStatus = checkExtension().then(hasExtension => {
                if (hasExtension) {
                  sendToExtension('PUPPET_SET_WALLET_STATE', {
                    ownerAddress: account.address,
                    smartWalletAddress: subaccountAddress
                  }, 5000).catch(console.warn)
                }
                return hasExtension
              })

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
                  if (!subaccountAddress) return alert('Subaccount not ready')
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

              const $extensionStatus = $row(spacing.small, style({ alignItems: 'center' }))(
                $node(style({ color: pallete.foreground, fontSize: '0.75rem' }))($text('Extension')),
                $intermediatePromise({
                  $loader: $spinner,
                  $display: just(
                    extensionStatus.then(connected =>
                      $row(spacing.small, style({ alignItems: 'center' }))(
                        $node(
                          style({
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: connected ? pallete.positive : pallete.negative
                          })
                        )(),
                        $node(style({ fontSize: '0.75rem', color: connected ? pallete.positive : pallete.negative }))(
                          $text(connected ? 'Connected' : 'Not detected')
                        )
                      )
                    )
                  )
                })
              )

              return $column(
                spacing.big,
                style({ padding: '24px', maxWidth: '600px', margin: '0 auto', width: '100%' })
              )(
                ignoreAll(depositExecution),

                $card(spacing.default)(
                  $column(spacing.default)(
                    $row(style({ justifyContent: 'space-between' }))(
                      $column(spacing.small)(
                        $node(style({ color: pallete.foreground, fontSize: '0.75rem' }))($text('Subaccount')),
                        subaccountAddress
                          ? $node(style({ fontFamily: 'monospace' }))($text(readableAddress(subaccountAddress)))
                          : $node(style({ color: pallete.foreground }))($text('Initializing...'))
                      ),
                      $extensionStatus
                    ),
                    subaccountAddress
                      ? $TokenBalanceEditor({
                          token: ARBITRUM_ADDRESS.USDC,
                          balance: walletBalance,
                          account
                        })({
                          changeDeposit: changeDepositTether(),
                          changeWithdraw: changeWithdrawTether()
                        })
                      : $node()
                  ),

                  $ButtonSecondary({ $content: $text('Disconnect') })({
                    click: clickDisconnectTether(tap(() => wallet.disconnect()))
                  })
                )
              )
            })
          )
        }),

        { walletConnect, clickDisconnect, changeDeposit, changeWithdraw }
      ]
    }
  )
