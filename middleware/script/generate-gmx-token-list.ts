const TOKENS_URL = 'https://raw.githubusercontent.com/gmx-io/gmx-synthetics/refs/heads/v2.3-branch/config/tokens.ts'
const INTERFACE_TOKENS_URL =
  'https://raw.githubusercontent.com/gmx-io/gmx-interface/refs/heads/master/sdk/src/configs/tokens.ts'

// Make this file a module to allow top-level await
export {}

type TokenData = {
  symbol: string
  decimals: number
  address: string
  name?: string
  synthetic?: boolean
  dataStreamFeedId?: string
  dataStreamFeedDecimals?: number
  priceFeedAddress?: string
}

try {
  console.log('📥 Fetching token data from GMX Synthetics...')

  // Fetch the tokens.ts file content
  const response = await fetch(TOKENS_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch tokens: ${response.status} ${response.statusText}`)
  }

  const content = await response.text()

  console.log('📥 Fetching token names from GMX Interface...')

  // Fetch token names from the interface repository
  const interfaceResponse = await fetch(INTERFACE_TOKENS_URL)
  if (!interfaceResponse.ok) {
    throw new Error(`Failed to fetch interface tokens: ${interfaceResponse.status} ${interfaceResponse.statusText}`)
  }

  const interfaceContent = await interfaceResponse.text()

  // Extract token names from interface tokens file
  const tokenNames: Record<string, string> = {}

  // Find ARBITRUM tokens array
  const arbitrumTokensPattern = /\[ARBITRUM\]:\s*\[([\s\S]*?)\],?\s*\n\s*\[(?:AVALANCHE|BOTANIX)/
  const arbitrumTokensMatch = interfaceContent.match(arbitrumTokensPattern)

  if (arbitrumTokensMatch) {
    // Match individual token objects in the array
    const tokenObjectPattern = /\{[^}]*name:\s*"([^"]+)"[^}]*symbol:\s*"([^"]+)"[^}]*\}/g
    let tokenMatch: RegExpExecArray | null

    while ((tokenMatch = tokenObjectPattern.exec(arbitrumTokensMatch[1])) !== null) {
      const name = tokenMatch[1]
      const symbol = tokenMatch[2]
      tokenNames[symbol] = name
    }
  }

  // Find the arbitrum tokens section
  // Look for pattern: arbitrum: {
  const arbitrumPattern = /arbitrum:\s*\{([\s\S]*?)\n\s*\},?\s*\n\s*(?:avalanche|$)/
  const arbitrumMatch = content.match(arbitrumPattern)

  if (!arbitrumMatch) {
    throw new Error('Could not find Arbitrum tokens in config')
  }

  const arbitrumContent = arbitrumMatch[1]

  // Extract individual token objects
  const tokens: TokenData[] = []
  const seenAddresses = new Set<string>()

  // Match token entries like: SYMBOL: { ... }
  // This regex matches nested objects including priceFeed
  const tokenEntryPattern = /(\w+):\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g
  let match: RegExpExecArray | null

  while ((match = tokenEntryPattern.exec(arbitrumContent)) !== null) {
    const symbol = match[1]
    const tokenContent = match[2]

    // Skip special entries and non-token entries
    if (symbol === 'default' || symbol === 'test' || symbol === 'priceFeed') continue

    // Extract properties
    const addressMatch = tokenContent.match(/address:\s*"(0x[a-fA-F0-9]{40})"/)
    const decimalsMatch = tokenContent.match(/decimals:\s*(\d+)/)
    const syntheticMatch = tokenContent.match(/synthetic:\s*true/)
    const dataStreamMatch = tokenContent.match(/dataStreamFeedId:\s*"(0x[a-fA-F0-9]+)"/)
    const dataStreamDecimalsMatch = tokenContent.match(/dataStreamFeedDecimals:\s*(\d+)/)

    // Extract priceFeed address
    const priceFeedMatch = tokenContent.match(/priceFeed:\s*\{[^}]*address:\s*"(0x[a-fA-F0-9]{40})"[^}]*\}/)
    const priceFeedAddress = priceFeedMatch ? priceFeedMatch[1] : undefined

    // Skip if no decimals found
    if (!decimalsMatch) continue

    // For synthetics without address, generate a deterministic placeholder
    // This will be handled by the contracts/indexer appropriately
    const address = addressMatch ? addressMatch[1] : `0x${'0'.repeat(24)}${symbol.padEnd(16, '0').slice(0, 16)}`

    // Skip duplicate addresses (but allow synthetic placeholders)
    if (addressMatch && seenAddresses.has(address.toLowerCase())) continue
    if (address === '0x0000000000000000000000000000000000000000') continue

    if (addressMatch) {
      seenAddresses.add(address.toLowerCase())
    }

    tokens.push({
      symbol,
      decimals: Number.parseInt(decimalsMatch[1]),
      address,
      name: tokenNames[symbol] || symbol, // Use symbol as name if no name found
      ...(syntheticMatch && { synthetic: true }),
      ...(dataStreamMatch && { dataStreamFeedId: dataStreamMatch[1] }),
      ...(dataStreamDecimalsMatch && { dataStreamFeedDecimals: Number.parseInt(dataStreamDecimalsMatch[1]) }),
      ...(priceFeedAddress && { priceFeedAddress })
    })
  }

  // Sort tokens alphabetically by symbol
  tokens.sort((a, b) => a.symbol.localeCompare(b.symbol))

  console.log(`\n✅ Generated ${tokens.length} tokens`)
  console.log(`✅ Found names for ${Object.keys(tokenNames).length} tokens from interface`)

  // Generate the TypeScript file content
  const fileContent = `// This file is auto-generated. Do not edit manually.
// Generated on: ${new Date().toISOString()}
// Source: ${TOKENS_URL}
// Names from: ${INTERFACE_TOKENS_URL}
// Note: Token addresses correspond to indexToken addresses in GMX V2 markets

export const ARBITRUM_TOKEN_LIST = [
${tokens
  .map(
    token => `  {
    symbol: '${token.symbol}',
    decimals: ${token.decimals},
    address: '${token.address}',
    name: '${token.name}'${token.synthetic ? ',\n    synthetic: true' : ''}${token.dataStreamFeedId ? `,\n    dataStreamFeedId: '${token.dataStreamFeedId}'` : ''}${token.dataStreamFeedDecimals !== undefined ? `,\n    dataStreamFeedDecimals: ${token.dataStreamFeedDecimals}` : ''}${token.priceFeedAddress ? `,\n    priceFeedAddress: '${token.priceFeedAddress}'` : ''}
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
    console.log(
      `- ${token.symbol} (${token.decimals} decimals)${token.name ? ` - ${token.name}` : ''}${token.synthetic ? ' [synthetic]' : ''}${token.dataStreamFeedId ? ' [has Chainlink stream]' : ''}`
    )
  })
} catch (error) {
  console.error('❌ Error generating token descriptions:', error)
  process.exit(1)
}
