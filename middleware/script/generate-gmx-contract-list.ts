import { $ } from 'bun'

// Make this file a module to allow top-level await

const GMX_REPO_URL = 'https://github.com/gmx-io/gmx-synthetics.git'
const TEMP_DIR = './temp-gmx-repo'

// Flag to control whether to sync from GitHub
const SYNC_FROM_GITHUB = process.argv.includes('--sync')

// Contract name mappings (deployment name -> our name)
const CONTRACT_MAPPINGS = {
  Reader: 'GmxReaderV2',
  Router: 'GmxExchangeRouter',
  OrderVault: 'GmxOrderVault',
  DataStore: 'GmxDatastore',
  EventEmitter: 'GmxEventEmitter'
} as const

// Override addresses for contracts that have newer versions
const CONTRACT_ADDRESS_OVERRIDES = {
  Reader: '0xcF2845Ab3866842A6b51Fb6a551b92dF58333574'
} as const

// Hardcoded contract addresses that aren't in the deployments folder
const HARDCODED_CONTRACTS = {
  GMX: {
    address: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    // GMX token uses standard ERC20 ABI
    abiImport: 'erc20Abi',
    abiSource: 'viem'
  },
  ReferralStorage: {
    address: '0xe6fab3F0c7199b0d34d7FbE83394fc0e0D06e99d',
    abiImport: 'referralStorageAbi',
    abiSource: './abi/referralStorage.js'
  }
} as const

type ContractData = {
  name: string
  address: string
  abi?: any[]
  abiImport?: string
  abiSource?: string
  deploymentFile?: string
}

type DeploymentData = {
  [key: string]: {
    address: string
    abi?: any[]
  }
}

async function loadContractData(deploymentName: string, deployments: DeploymentData): Promise<ContractData | null> {
  try {
    const data = deployments[deploymentName]

    if (!data) {
      console.warn(`⚠️  Deployment not found: ${deploymentName}`)
      return null
    }

    // The JSON structure has an "address" field and "abi" field
    if (!data.address) {
      console.warn(`⚠️  No address found for ${deploymentName}`)
      return null
    }

    // Map the deployment name to our contract name
    const contractName = CONTRACT_MAPPINGS[deploymentName as keyof typeof CONTRACT_MAPPINGS]

    // Check if we have an address override for this contract
    const overrideAddress = CONTRACT_ADDRESS_OVERRIDES[deploymentName as keyof typeof CONTRACT_ADDRESS_OVERRIDES]
    const finalAddress = overrideAddress || data.address

    return {
      name: contractName,
      address: finalAddress,
      abi: data.abi,
      deploymentFile: deploymentName
    }
  } catch (error) {
    console.error(`❌ Error loading ${deploymentName}:`, error)
    return null
  }
}

async function discoverAllContracts(deployments: DeploymentData): string[] {
  try {
    const deploymentNames = Object.keys(deployments)
    console.log(`🔍 Discovered ${deploymentNames.length} deployments`)

    // List any contracts we're not mapping
    const unmappedContracts = deploymentNames.filter(f => !Object.keys(CONTRACT_MAPPINGS).includes(f))

    if (unmappedContracts.length > 0) {
      console.log('\n📋 Unmapped contracts found:')
      unmappedContracts.slice(0, 10).forEach(c => console.log(`  - ${c}`))
      if (unmappedContracts.length > 10) {
        console.log(`  ... and ${unmappedContracts.length - 10} more`)
      }
      console.log('\nConsider adding these to CONTRACT_MAPPINGS if needed.\n')
    }

    return deploymentNames
  } catch (error) {
    console.error('❌ Error discovering contracts:', error)
    return []
  }
}

async function fetchGmxDeployments(): Promise<DeploymentData> {
  try {
    console.log('🔄 Fetching GMX deployments from GitHub...')

    // Clone the repository (shallow clone for speed)
    console.log('📥 Cloning GMX synthetics repository...')
    await $`git clone --depth 1 --sparse ${GMX_REPO_URL} ${TEMP_DIR}`

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
    console.error('❌ Error fetching GMX deployments:', error)
    // Try to clean up temp directory on error
    await $`rm -rf ${TEMP_DIR}`.catch(() => {})
    throw error
  }
}

try {
  // Fetch from GitHub if requested, otherwise load from memory
  let deployments: DeploymentData = {}

  if (SYNC_FROM_GITHUB) {
    deployments = await fetchGmxDeployments()
    console.log()
  } else {
    console.log('📥 Loading GMX V2 contract addresses (use --sync to fetch latest from GitHub)...')
    // For non-sync mode, we'll use a minimal set of hardcoded addresses
    // These are the essential contracts we need
    deployments = {
      Reader: { address: '0xcF2845Ab3866842A6b51Fb6a551b92dF58333574' },
      Router: { address: '0x7452c558d45f8afc8c83dae62c3f8a5be19c71f6' },
      OrderVault: { address: '0x31ef83a530fde1b38ee9a18093a333e8bbab740' },
      DataStore: { address: '0xFD70de6b91282D8017aA4E741e9Ae325CAb992d8' },
      EventEmitter: { address: '0xD22a714e9D49b33e6af91f5aC1dF4cFd4EFbe6ad' }
    }
  }

  // First, discover all available contracts
  const allContracts = await discoverAllContracts(deployments)

  // Load mapped contracts
  const contractPromises = Object.keys(CONTRACT_MAPPINGS).map(deploymentName =>
    loadContractData(deploymentName, deployments)
  )
  const results = await Promise.all(contractPromises)

  // Filter out null results
  const contracts = results.filter((result): result is ContractData => result !== null)

  if (contracts.length === 0) {
    throw new Error('No contracts were successfully loaded')
  }

  console.log(`\n✅ Loaded ${contracts.length} contracts`)

  // Write individual ABI files
  for (const contract of contracts) {
    if (contract.abi) {
      const abiFileName = `gmx${contract.name.replace('Gmx', '')}`
      const abiFilePath = `./src/generated/abi/${abiFileName}.ts`
      const abiContent = `// This file is auto-generated. Do not edit manually.
// Generated on: ${new Date().toISOString()}
// Source: Local deployment file: ${contract.deploymentFile}.json

export default ${JSON.stringify(contract.abi, null, 2)} as const
`
      await Bun.write(abiFilePath, abiContent)
      console.log(`📝 Generated ABI for ${contract.name}`)
    }
  }

  // Generate the TypeScript file content with contract mappings
  const fileContent = `// This file is auto-generated. Do not edit manually.
// Generated on: ${new Date().toISOString()}
// Source: Local GMX deployment files

// Import generated ABIs
${contracts
  .filter(c => c.abi)
  .map(c => `import ${c.name.replace('Gmx', '').toLowerCase()}Abi from './abi/gmx${c.name.replace('Gmx', '')}.js'`)
  .join('\n')}

// Import hardcoded contract ABIs
import { erc20Abi } from 'viem'
${Object.entries(HARDCODED_CONTRACTS)
  .filter(([_, config]) => config.abiSource && config.abiSource !== 'viem')
  .map(([_, config]) => `import ${config.abiImport} from '${config.abiSource}'`)
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
  .concat(
    Object.entries(HARDCODED_CONTRACTS).map(([name, config]) => {
      if (config.abiImport === 'erc20Abi') {
        // Special case for ERC20 ABI from viem
        return `  ${name}: {
    address: '${config.address}',
    abi: erc20Abi
  }`
      }
      return `  ${name}: {
    address: '${config.address}',
    abi: ${config.abiImport}
  }`
    })
  )
  .join(',\n')}
} as const
`

  // Write the main contracts file
  await Bun.write('./src/generated/contractList.ts', fileContent)

  // Format the generated files with biome
  await Bun.$`bunx @biomejs/biome format --write ./src/generated/contractList.ts`
  await Bun.$`bunx @biomejs/biome format --write ./src/generated/abi/gmx*.ts`

  console.log('✅ Successfully generated GMX V2 contract list with ABIs')
  console.log('\nGenerated contracts:')
  contracts.forEach(contract => {
    console.log(`- ${contract.name}: ${contract.address}`)
  })
  Object.entries(HARDCODED_CONTRACTS).forEach(([name, config]) => {
    console.log(`- ${name}: ${config.address} (hardcoded)`)
  })
} catch (error) {
  console.error('❌ Error generating contract list:', error)
  process.exit(1)
}
