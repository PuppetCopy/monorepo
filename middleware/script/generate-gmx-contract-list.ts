import { $ } from 'bun'

const GMX_REPO_URL = 'https://github.com/gmx-io/gmx-synthetics.git'
const TEMP_DIR = './temp-gmx-repo'

// Contract name mappings (deployment name -> our name)
const CONTRACT_MAPPINGS = {
  Reader: 'GmxReaderV2',
  Router: 'GmxExchangeRouter',
  OrderVault: 'GmxOrderVault',
  DataStore: 'GmxDatastore',
  EventEmitter: 'GmxEventEmitter'
} as const

type ContractData = {
  name: string
  address: string
  abi?: any[]
}

type DeploymentData = {
  [key: string]: {
    address: string
    abi?: any[]
  }
}

async function fetchGmxDeployments(): Promise<DeploymentData> {
  console.log('🔄 Fetching GMX deployments from GitHub (v2.2-branch)...')

  try {
    // Clone the repository (shallow clone for speed, specifically v2.2-branch)
    console.log('📥 Cloning GMX synthetics repository (v2.2-branch)...')
    await $`git clone --depth 1 --branch v2.2-branch --sparse ${GMX_REPO_URL} ${TEMP_DIR}`

    // Set up sparse checkout to only get deployments folder
    await $`cd ${TEMP_DIR} && git sparse-checkout init --cone`
    await $`cd ${TEMP_DIR} && git sparse-checkout set deployments/arbitrum`

    // Read all deployment files into memory
    console.log('📁 Loading Arbitrum deployments...')
    const deploymentFiles = await $`find ${TEMP_DIR}/deployments/arbitrum -name "*.json" -not -name "*metadata*"`.text()
    const files = deploymentFiles.trim().split('\n').filter(Boolean)

    const deployments: DeploymentData = {}

    for (const filePath of files) {
      const fileName = filePath.split('/').pop()?.replace('.json', '')
      if (!fileName) continue

      const file = Bun.file(filePath)
      const data = await file.json()
      deployments[fileName] = data
    }

    // Clean up temp directory
    await $`rm -rf ${TEMP_DIR}`

    console.log(`✅ Successfully loaded ${Object.keys(deployments).length} deployments`)
    return deployments
  } catch (error) {
    // Try to clean up temp directory on error
    await $`rm -rf ${TEMP_DIR}`.catch(() => {})

    // Always throw error to fail the script
    throw new Error(
      `Failed to fetch GMX deployments from GitHub: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

try {
  // Always fetch from GitHub v2.2-branch to ensure we have the latest addresses and ABIs
  const deployments = await fetchGmxDeployments()
  console.log()

  // Load mapped contracts
  const contracts: ContractData[] = []

  for (const [deploymentName, contractName] of Object.entries(CONTRACT_MAPPINGS)) {
    const data = deployments[deploymentName]

    if (!data || !data.address) {
      console.warn(`⚠️  Deployment not found or missing address: ${deploymentName}`)
      continue
    }

    contracts.push({
      name: contractName,
      address: data.address,
      abi: data.abi
    })
  }

  if (contracts.length === 0) {
    throw new Error('No contracts were successfully loaded')
  }

  console.log(`✅ Loaded ${contracts.length} contracts`)

  // Helper function to check if file content has changed
  async function writeIfChanged(filePath: string, generateContent: (timestamp: string) => string): Promise<boolean> {
    try {
      const existingFile = Bun.file(filePath)
      if (await existingFile.exists()) {
        const existingContent = await existingFile.text()

        // Extract existing timestamp
        const timestampMatch = existingContent.match(/Generated on: (.+)/)
        const existingTimestamp = timestampMatch ? timestampMatch[1] : new Date().toUTCString()
        
        // Generate content with existing timestamp for comparison
        const contentWithOldTimestamp = generateContent(existingTimestamp)
        
        if (existingContent === contentWithOldTimestamp) {
          return false // Content unchanged, no write needed
        }
      }
    } catch {
      // File doesn't exist or can't be read, proceed with write
    }

    // Either file doesn't exist or content has changed - write with new timestamp
    const newContent = generateContent(new Date().toUTCString())
    await Bun.write(filePath, newContent)
    return true // Content was written
  }

  // Write individual ABI files
  let abiFilesUpdated = 0
  for (const contract of contracts) {
    if (contract.abi) {
      const abiFileName = `gmx${contract.name.replace('Gmx', '')}`
      const abiFilePath = `./src/generated/abi/${abiFileName}.ts`
      
      const wasUpdated = await writeIfChanged(abiFilePath, (timestamp) => 
        `// This file is auto-generated. Do not edit manually.
// Generated on: ${timestamp}
// Source: GMX deployment files from GitHub (v2.2-branch)

export default ${JSON.stringify(contract.abi, null, 2)} as const
`)
      
      if (wasUpdated) {
        console.log(`📝 Updated ABI for ${contract.name}`)
        abiFilesUpdated++
      } else {
        console.log(`✓ ABI unchanged for ${contract.name}`)
      }
    }
  }

  // Write the main contracts file
  const contractListUpdated = await writeIfChanged('./src/generated/contractList.ts', (timestamp) =>
    `// This file is auto-generated. Do not edit manually.
// Generated on: ${timestamp}
// Source: GMX deployment files from GitHub (v2.2-branch)

// Import generated ABIs
${contracts
  .filter(c => c.abi)
  .map(c => `import ${c.name.replace('Gmx', '').toLowerCase()}Abi from './abi/gmx${c.name.replace('Gmx', '')}.js'`)
  .join('\n')}

export const GMX_V2_CONTRACT_MAP = {
${contracts
  .map(contract => {
    const hasAbi = !!contract.abi
    const abiName = `${contract.name.replace('Gmx', '').toLowerCase()}Abi`

    if (hasAbi) {
      return `  ${contract.name}: {
    address: '${contract.address}',
    abi: ${abiName}
  }`
    }
    return `  ${contract.name}: {
    address: '${contract.address}'
  }`
  })
  .join(',\n')}
} as const
`)

  // Only format files that were actually updated
  if (contractListUpdated) {
    await Bun.$`bunx @biomejs/biome format --write ./src/generated/contractList.ts`
    console.log('📝 Updated main contract list')
  } else {
    console.log('✓ Main contract list unchanged')
  }

  if (abiFilesUpdated > 0) {
    await Bun.$`bunx @biomejs/biome format --write ./src/generated/abi/gmx*.ts`
  }

  console.log('\n✅ GMX V2 contract generation complete')
  console.log(`   - ${abiFilesUpdated} ABI file(s) updated`)
  console.log(`   - Main contract list: ${contractListUpdated ? 'updated' : 'unchanged'}`)

  if (abiFilesUpdated > 0 || contractListUpdated) {
    console.log('\nUpdated contracts:')
    contracts.forEach(contract => {
      console.log(`- ${contract.name}: ${contract.address}`)
    })
  }
} catch (error) {
  console.error('❌ Error generating contract list:', error)
  process.exit(1)
}
