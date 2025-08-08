#!/usr/bin/env bun

import { $ } from 'bun'

console.log('🚀 Running all generation scripts...\n')

try {
  // 1. Generate GMX market list
  console.log('📊 Generating GMX market list...')
  await $`bun run script/generate-gmx-market-list.ts`
  console.log('✅ Market list generated\n')

  // 2. Generate GMX token list
  console.log('🪙 Generating GMX token list...')
  await $`bun run script/generate-gmx-token-list.ts`
  console.log('✅ Token list generated\n')

  // 3. Generate GMX contract list
  console.log('📄 Generating GMX contract list...')
  await $`bun run script/generate-gmx-contract-list.ts`
  console.log('✅ Contract list generated\n')

  // 4. Generate Puppet contracts (includes Error ABI)
  console.log('🔧 Generating Puppet contracts and Error ABI...')
  await $`bun run script/generate-puppet-contracts.ts`
  console.log('✅ Puppet contracts and Error ABI generated\n')

  console.log('🎉 All generation scripts completed successfully!')
} catch (error) {
  console.error('❌ Error running generation scripts:', error)
  process.exit(1)
}
