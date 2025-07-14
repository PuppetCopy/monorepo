#!/usr/bin/env bun
import { file, write } from 'bun'

console.log('🧪 Testing contract address update...')

try {
  // Read deployments and update contract.ts directly
  const deploymentsFile = file('../contracts/deployments.json')
  const deployments = await deploymentsFile.json()
  const addresses = deployments[42161]
  
  console.log('📍 Found addresses:', Object.keys(addresses).join(', '))

  // Update contract.ts with new addresses
  const contractFile = file('./src/const/contract.ts')
  let contractContent = await contractFile.text()
  
  // Format addresses in single-line style
  const formattedAddresses = Object.entries(addresses)
    .map(([key, value]) => `  ${key}: '${value}'`)
    .join(',\n')
  
  const addressesBlock = `// Contract addresses for Arbitrum (42161)\nconst addresses = {\n${formattedAddresses}\n} as const`
  
  // Replace import line or existing addresses block
  let updated = contractContent.replace(
    /import addresses from '\.\/deployments\.json' with \{ type: 'json' \}/,
    addressesBlock
  )
  
  // Also handle case where addresses block already exists
  updated = updated.replace(
    /\/\/ Contract addresses for Arbitrum \(42161\)\nconst addresses = \{[\s\S]*?\} as const/,
    addressesBlock
  )
  
  if (updated === contractContent) {
    console.log('⚠️  No import statement found to replace')
  } else {
    await write('./src/const/contract.ts', updated)
    console.log('✅ Contract addresses updated successfully')
  }
  
} catch (error) {
  console.error('❌ Address update failed:', error)
}