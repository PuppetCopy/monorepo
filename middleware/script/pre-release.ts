#!/usr/bin/env bun
import { $, file, write } from 'bun'

console.log('🚀 Starting post-deployment synchronization...')

try {
  // Step 1: Update contract addresses and generate fresh ABIs
  console.log('\n🔧 Updating contract addresses and generating ABIs...')

  // Read deployments and update contract.ts directly
  const deploymentsFile = file('../contracts/deployments.json')
  const deployments = await deploymentsFile.json()
  const addresses = deployments[42161]

  // Update address.ts with new addresses
  const addressFile = file('./src/const/address.ts')
  let addressContent = await addressFile.text()

  // Format addresses in single-line style
  const formattedAddresses = Object.entries(addresses)
    .map(([key, value]) => `  ${key}: '${value}'`)
    .join(',\n')

  // Replace addresses block content
  addressContent = addressContent.replace(
    /const addresses = \{[\s\S]*?\} as const/,
    `const addresses = {\n${formattedAddresses}\n} as const`
  )

  await write('./src/const/address.ts', addressContent)
  console.log('✅ Address updated')

  await $`bunx wagmi generate`
  console.log('✅ ABIs generated successfully')
} catch (error) {
  console.error('❌ Error updating address or generating ABIs:', error)
  process.exit(1)
}
