const TOKENS_URL = 'https://raw.githubusercontent.com/gmx-io/gmx-interface/refs/heads/master/sdk/src/configs/tokens.ts'

// Make this file a module to allow top-level await
export {}

type TokenData = {
  symbol: string
  name: string
  decimals: number
  address: string
  isSynthetic?: boolean
}

try {
  console.log('📥 Fetching token data from GMX Interface...')

  // Fetch the tokens.ts file content
  const response = await fetch(TOKENS_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch tokens: ${response.status} ${response.statusText}`)
  }

  const content = await response.text()

  // Find TOKENS object and then the Arbitrum section
  // Look for pattern: [ARBITRUM]: [ or [42161]: [
  const arbitrumPattern = /\[(?:ARBITRUM|42161)\]:\s*\[([\s\S]*?)\n\s*\],/
  const arbitrumMatch = content.match(arbitrumPattern)

  if (!arbitrumMatch) {
    throw new Error('Could not find Arbitrum tokens in config')
  }

  const arbitrumContent = arbitrumMatch[1]

  // Extract individual token objects
  const tokens: TokenData[] = []
  const seenAddresses = new Set<string>()

  // Split by objects (looking for patterns like { ... },)
  const tokenPattern = /\{([^}]+)\}/g
  let match: RegExpExecArray | null

  while ((match = tokenPattern.exec(arbitrumContent)) !== null) {
    const tokenContent = match[1]

    // Extract properties
    const nameMatch = tokenContent.match(/name:\s*"([^"]+)"/)
    const symbolMatch = tokenContent.match(/symbol:\s*"([^"]+)"/)
    const addressMatch = tokenContent.match(/address:\s*"(0x[a-fA-F0-9]{40})"/)
    const decimalsMatch = tokenContent.match(/decimals:\s*(\d+)/)
    const syntheticMatch = tokenContent.match(/isSynthetic:\s*true/)

    if (nameMatch && symbolMatch && addressMatch && decimalsMatch) {
      const address = addressMatch[1]

      // Skip duplicate addresses and special addresses
      if (seenAddresses.has(address.toLowerCase())) continue
      if (address === '0x0000000000000000000000000000000000000000') continue

      seenAddresses.add(address.toLowerCase())

      tokens.push({
        symbol: symbolMatch[1],
        name: nameMatch[1],
        decimals: Number.parseInt(decimalsMatch[1]),
        address,
        isSynthetic: !!syntheticMatch
      })
    }
  }

  // Sort tokens alphabetically by symbol
  tokens.sort((a, b) => a.symbol.localeCompare(b.symbol))

  console.log(`\n✅ Generated ${tokens.length} tokens`)

  // Generate the TypeScript file content
  const fileContent = `// This file is auto-generated. Do not edit manually.
// Generated on: ${new Date().toISOString()}
// Source: ${TOKENS_URL}
// Note: Token addresses correspond to indexToken addresses in GMX V2 markets

export const ARBITRUM_TOKEN_LIST = [
${tokens
  .map(
    token => `  {
    symbol: '${token.symbol}',
    name: '${token.name}',
    decimals: ${token.decimals},
    address: '${token.address}'${token.isSynthetic ? ',\n    isSynthetic: true' : ''}
  }`
  )
  .join(',\n')}
] as const
`

  // Write the file
  await Bun.write('./src/generated/tokenList.ts', fileContent)

  // Format the generated file with biome
  await Bun.$`bunx @biomejs/biome format --write ./src/generated/tokenList.ts`

  console.log(`✅ Successfully generated token list with ${tokens.length} tokens`)
  console.log('\nGenerated tokens:')
  tokens.forEach(token => {
    console.log(`- ${token.symbol} (${token.decimals} decimals)${token.isSynthetic ? ' [synthetic]' : ''}`)
  })
} catch (error) {
  console.error('❌ Error generating token descriptions:', error)
  process.exit(1)
}
