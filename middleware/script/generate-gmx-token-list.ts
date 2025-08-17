const INTERFACE_TOKENS_URL =
  'https://raw.githubusercontent.com/gmx-io/gmx-interface/refs/heads/master/sdk/src/configs/tokens.ts'
const SYNTHETICS_TOKENS_URL =
  'https://raw.githubusercontent.com/gmx-io/gmx-synthetics/refs/heads/v2.2-branch/config/tokens.ts'

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

type SyntheticsTokenData = {
  [symbol: string]: {
    address?: string
    decimals?: number
    synthetic?: boolean
    dataStreamFeedId?: string
    dataStreamFeedDecimals?: number
    priceFeed?: {
      address?: string
    }
  }
}

try {
  console.log('📥 Fetching token data from GMX Interface (primary source)...')

  // Fetch the interface tokens file content
  const interfaceResponse = await fetch(INTERFACE_TOKENS_URL)
  if (!interfaceResponse.ok) {
    throw new Error(`Failed to fetch interface tokens: ${interfaceResponse.status} ${interfaceResponse.statusText}`)
  }

  const interfaceContent = await interfaceResponse.text()

  console.log('📥 Fetching additional data from GMX Synthetics...')

  // Fetch the synthetics tokens file content
  const syntheticsResponse = await fetch(SYNTHETICS_TOKENS_URL)
  if (!syntheticsResponse.ok) {
    throw new Error(`Failed to fetch synthetics tokens: ${syntheticsResponse.status} ${syntheticsResponse.statusText}`)
  }

  const syntheticsContent = await syntheticsResponse.text()

  // Parse synthetics tokens to get additional data
  const syntheticsTokens: SyntheticsTokenData = {}

  // Find the arbitrum tokens section in synthetics
  const arbitrumPattern = /arbitrum:\s*\{([\s\S]*?)\n\s*\},?\s*\n\s*(?:avalanche|$)/
  const arbitrumMatch = syntheticsContent.match(arbitrumPattern)

  if (arbitrumMatch) {
    const arbitrumContent = arbitrumMatch[1]

    // Match token entries like: SYMBOL: { ... } or "SYMBOL": { ... }
    const tokenEntryPattern = /(?:"([^"]+)"|(\w+)):\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g
    let match: RegExpExecArray | null

    while ((match = tokenEntryPattern.exec(arbitrumContent)) !== null) {
      const symbol = match[1] || match[2]
      const tokenContent = match[3]

      // Skip special entries
      if (symbol === 'default' || symbol === 'test' || symbol === 'priceFeed') continue

      // Extract properties
      const addressMatch = tokenContent.match(/address:\s*"(0x[a-fA-F0-9]{40})"/)
      const decimalsMatch = tokenContent.match(/decimals:\s*(\d+)/)
      const syntheticMatch = tokenContent.match(/synthetic:\s*true/)
      const dataStreamMatch = tokenContent.match(/dataStreamFeedId:\s*"(0x[a-fA-F0-9]+)"/)
      const dataStreamDecimalsMatch = tokenContent.match(/dataStreamFeedDecimals:\s*(\d+)/)
      const priceFeedMatch = tokenContent.match(/priceFeed:\s*\{[^}]*address:\s*"(0x[a-fA-F0-9]{40})"[^}]*\}/)

      syntheticsTokens[symbol] = {
        ...(addressMatch && { address: addressMatch[1] }),
        ...(decimalsMatch && { decimals: Number.parseInt(decimalsMatch[1]) }),
        ...(syntheticMatch && { synthetic: true }),
        ...(dataStreamMatch && { dataStreamFeedId: dataStreamMatch[1] }),
        ...(dataStreamDecimalsMatch && { dataStreamFeedDecimals: Number.parseInt(dataStreamDecimalsMatch[1]) }),
        ...(priceFeedMatch && { priceFeed: { address: priceFeedMatch[1] } })
      }
    }
  }

  // Extract tokens from interface
  const tokens: TokenData[] = []
  const seenAddresses = new Set<string>()

  // Find ARBITRUM tokens array in interface
  const arbitrumTokensPattern = /\[ARBITRUM\]:\s*\[([\s\S]*?)\],?\s*\n\s*\[(?:AVALANCHE|BOTANIX)/
  const arbitrumTokensMatch = interfaceContent.match(arbitrumTokensPattern)

  if (!arbitrumTokensMatch) {
    throw new Error('Could not find Arbitrum tokens in interface')
  }

  // Match individual token objects in the array
  const tokenObjectPattern = /\{([^}]+)\}/g
  let tokenMatch: RegExpExecArray | null

  while ((tokenMatch = tokenObjectPattern.exec(arbitrumTokensMatch[1])) !== null) {
    const tokenContent = tokenMatch[1]

    // Extract properties from interface
    const nameMatch = tokenContent.match(/name:\s*"([^"]+)"/)
    const symbolMatch = tokenContent.match(/symbol:\s*"([^"]+)"/)
    const addressMatch = tokenContent.match(/address:\s*"(0x[a-fA-F0-9]{40})"/)
    const decimalsMatch = tokenContent.match(/decimals:\s*(\d+)/)

    if (!symbolMatch || !addressMatch || !decimalsMatch) continue

    const symbol = symbolMatch[1]
    const address = addressMatch[1]
    const decimals = Number.parseInt(decimalsMatch[1])
    const name = nameMatch ? nameMatch[1] : symbol

    // Skip duplicate addresses
    if (seenAddresses.has(address.toLowerCase())) continue
    seenAddresses.add(address.toLowerCase())

    // Get additional data from synthetics if available
    const syntheticsData = syntheticsTokens[symbol] || {}

    tokens.push({
      symbol,
      decimals,
      address,
      name,
      ...(syntheticsData.synthetic && { synthetic: true }),
      ...(syntheticsData.dataStreamFeedId && { dataStreamFeedId: syntheticsData.dataStreamFeedId }),
      ...(syntheticsData.dataStreamFeedDecimals !== undefined && {
        dataStreamFeedDecimals: syntheticsData.dataStreamFeedDecimals
      }),
      ...(syntheticsData.priceFeed?.address && { priceFeedAddress: syntheticsData.priceFeed.address })
    })
  }

  // Sort tokens alphabetically by symbol
  tokens.sort((a, b) => a.symbol.localeCompare(b.symbol))

  console.log(`\n✅ Generated ${tokens.length} tokens from GMX Interface`)
  console.log(`✅ Enhanced ${Object.keys(syntheticsTokens).length} tokens with data from GMX Synthetics`)

  // Generate the TypeScript file content
  const fileContent = `// This file is auto-generated. Do not edit manually.
// Generated on: ${new Date().toUTCString()}
// Primary source: ${INTERFACE_TOKENS_URL}
// Enhanced with data from: ${SYNTHETICS_TOKENS_URL}
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
