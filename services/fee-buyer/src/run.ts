import { PUPPET_CONTRACT_MAP } from '@puppet/contracts'
import { ARBITRUM_ADDRESS } from '@puppet/sdk/const'
import { desc, live } from '@puppet/sql/client'
import * as schema from '@puppet/sql/schema'
import { awaitPromises, createDefaultScheduler, map, op, tap } from 'aelea/stream'
import { createPublicClient, createWalletClient, formatUnits, type Hex, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum } from 'viem/chains'

if (!process.env.RPC_URL) throw new Error('RPC_URL is not defined')
if (!process.env.PRIVATE_KEY) throw new Error('PRIVATE_KEY is not defined')
if (!process.env.INDEXER_ENDPOINT) throw new Error('INDEXER_ENDPOINT is not defined')

const publicClient = createPublicClient({
  transport: http(process.env.RPC_URL),
  chain: arbitrum,
  batch: { multicall: true }
})

const walletClient = createWalletClient({
  account: privateKeyToAccount(process.env.PRIVATE_KEY as Hex),
  chain: arbitrum,
  transport: http(process.env.RPC_URL)
})

const FEE_TOKENS = [ARBITRUM_ADDRESS.WETH, ARBITRUM_ADDRESS.USDC, ARBITRUM_ADDRESS.USDT]

const depositStream = live(process.env.INDEXER_ENDPOINT, db =>
  db.select().from(schema.feeMarketplace__Deposit).orderBy(desc(schema.feeMarketplace__Deposit.blockTimestamp)).limit(1)
)

op(
  depositStream,
  tap(result => {
    if (result.length === 0) return
    const deposit = result[0]!
    console.log(`📥 New deposit detected: ${deposit.feeToken} ${formatUnits(deposit.amount, 18)}`)
  }),
  map(async () => {
    for (const feeToken of FEE_TOKENS) {
      try {
        const [unlockedBalance, askPrice] = await publicClient.multicall({
          contracts: [
            {
              address: PUPPET_CONTRACT_MAP.FeeMarketplace.address,
              abi: PUPPET_CONTRACT_MAP.FeeMarketplace.abi,
              functionName: 'getUnlockedBalance',
              args: [feeToken]
            },
            {
              address: PUPPET_CONTRACT_MAP.FeeMarketplace.address,
              abi: PUPPET_CONTRACT_MAP.FeeMarketplace.abi,
              functionName: 'getAskPrice',
              args: [feeToken]
            }
          ],
          allowFailure: false
        })

        if (unlockedBalance === 0n) continue

        console.log(`💰 Opportunity: ${formatUnits(unlockedBalance, 18)} fees for ${formatUnits(askPrice, 18)} PUPPET`)

        const hash = await walletClient.writeContract({
          address: PUPPET_CONTRACT_MAP.UserRouter.address,
          abi: PUPPET_CONTRACT_MAP.UserRouter.abi,
          functionName: 'acceptOffer',
          args: [feeToken, walletClient.account.address, unlockedBalance]
        })

        console.log(`📤 Transaction sent: ${hash}`)

        const receipt = await publicClient.waitForTransactionReceipt({ hash })

        if (receipt.status === 'reverted') {
          throw new Error(`Transaction reverted: ${hash}`)
        }

        console.log(`✅ Purchased fees (block ${receipt.blockNumber})`)
      } catch (error) {
        console.error(`❌ Error processing ${feeToken}: ${error}`)
      }
    }
  }),
  awaitPromises
).run(
  {
    event() {},
    error(time, err) {
      console.error(`❌ Stream error at ${time}: ${err}`)
    },
    end() {
      console.error('⚠️ Stream ended')
      process.exit(0)
    }
  },
  createDefaultScheduler()
)

console.log('⚡️ Starting fee buyer with live queries...')
