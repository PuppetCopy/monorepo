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

  // Update contract.ts with new addresses
  const contractFile = file('./src/const/contract.ts')
  let contractContent = await contractFile.text()

  // Format addresses in single-line style
  const formattedAddresses = Object.entries(addresses)
    .map(([key, value]) => `  ${key}: '${value}'`)
    .join(',\n')

  // Replace addresses block content
  contractContent = contractContent.replace(
    /const addresses = \{[\s\S]*?\} as const/,
    `const addresses = {\n${formattedAddresses}\n} as const`
  )

  await write('./src/const/contract.ts', contractContent)
  console.log('✅ Contract addresses updated')

  await $`bunx wagmi generate`
  console.log('✅ ABIs generated successfully')
} catch (error) {
  console.error('❌ Error updating contract addresses or generating ABIs:', error)
  process.exit(1)
}
