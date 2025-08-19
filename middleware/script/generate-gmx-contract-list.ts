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
  console.log('🔄 Fetching GMX deployments from GitHub...')

  try {
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
    // Try to clean up temp directory on error
    await $`rm -rf ${TEMP_DIR}`.catch(() => {})

    // Always throw error to fail the script
    throw new Error(
      `Failed to fetch GMX deployments from GitHub: ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

try {
  // Always fetch from GitHub to ensure we have the latest addresses and ABIs
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

  // Write individual ABI files
  for (const contract of contracts) {
    if (contract.abi) {
      const abiFileName = `gmx${contract.name.replace('Gmx', '')}`
      const abiFilePath = `./src/generated/abi/${abiFileName}.ts`
      const abiContent = `// This file is auto-generated. Do not edit manually.
// Generated on: ${new Date().toUTCString()}
// Source: GMX deployment files from GitHub

export default ${JSON.stringify(contract.abi, null, 2)} as const
`
      await Bun.write(abiFilePath, abiContent)
      console.log(`📝 Generated ABI for ${contract.name}`)
    }
  }

  // Generate the TypeScript file content
  const fileContent = `// This file is auto-generated. Do not edit manually.
// Generated on: ${new Date().toUTCString()}
// Source: GMX deployment files from GitHub

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
} catch (error) {
  console.error('❌ Error generating contract list:', error)
  process.exit(1)
}
