import { $ } from 'bun'

const GMX_REPO_URL = 'https://github.com/gmx-io/gmx-synthetics.git'
const TEMP_DIR = './temp-gmx-repo'

// Contract name mappings (deployment name -> our name)
const CONTRACT_MAPPINGS = {
  Reader: 'GmxReaderV2',
  ExchangeRouter: 'GmxExchangeRouter',
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
  console.log('🔄 Fetching GMX deployments from GitHub (main branch)...')

  try {
    // Clone the repository (shallow clone for speed, specifically main branch)
    console.log('📥 Cloning GMX synthetics repository (main branch)...')
    await $`git clone --depth 1 --branch main --sparse ${GMX_REPO_URL} ${TEMP_DIR}`

    // Set up sparse checkout to get deployments and contracts folders
    await $`cd ${TEMP_DIR} && git sparse-checkout init --cone`
    await $`cd ${TEMP_DIR} && git sparse-checkout set deployments/arbitrum contracts/error`

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

async function generateGmxErrors(): Promise<number> {
  console.log('⚠️  Generating GMX error ABI...')

  try {
    // Read the Errors.sol file from the cloned repo
    const errorsFile = Bun.file(`${TEMP_DIR}/contracts/error/Errors.sol`)
    const content = await errorsFile.text()

    // Parse custom errors from the Solidity file
    const errors: any[] = []

    // Match error definitions like: error ErrorName(type1 param1, type2 param2);
    const errorPattern = /error\s+(\w+)\s*\(([^)]*)\)\s*;/g
    let match: RegExpExecArray | null

    while ((match = errorPattern.exec(content)) !== null) {
      const errorName = match[1]
      const paramsStr = match[2].trim()

      const errorEntry: any = {
        name: errorName,
        type: 'error'
      }

      if (paramsStr) {
        const inputs: any[] = []

        // Parse parameters - handle both simple and complex types
        const params = paramsStr.split(',').map(p => p.trim())

        for (const param of params) {
          if (!param) continue

          // Match parameter pattern: type name or just type
          const paramMatch = param.match(/^(.+?)(?:\s+(\w+))?$/)
          if (paramMatch) {
            const [, type, name] = paramMatch

            // Map Solidity types to ABI types
            let abiType = type.trim()

            // Handle common type mappings
            if (abiType === 'uint') abiType = 'uint256'
            if (abiType === 'int') abiType = 'int256'

            const input: any = {
              internalType: abiType,
              type: abiType
            }

            if (name) {
              input.name = name
            } else {
              // Generate a name if not provided
              input.name = `param${inputs.length}`
            }

            inputs.push(input)
          }
        }

        if (inputs.length > 0) {
          errorEntry.inputs = inputs
        } else {
          errorEntry.inputs = []
        }
      } else {
        errorEntry.inputs = []
      }

      errors.push(errorEntry)
    }

    console.log(`✅ Found ${errors.length} GMX custom errors`)

    // Sort errors alphabetically
    errors.sort((a, b) => a.name.localeCompare(b.name))

    // Write the GMX error ABI file
    const abiContent = `// This file is auto-generated. Do not edit manually.
// Source: GMX contracts/error/Errors.sol from GitHub (main branch)

export const gmxErrorAbi = ${JSON.stringify(errors, null, 2)} as const
`

    // Helper function to check if file content has changed
    async function writeIfChanged(filePath: string, newContent: string): Promise<boolean> {
      try {
        const existingFile = Bun.file(filePath)
        if (await existingFile.exists()) {
          const existingContent = await existingFile.text()
          if (existingContent === newContent) {
            return false // Content unchanged, no write needed
          }
        }
      } catch {
        // File doesn't exist or can't be read, proceed with write
      }

      await Bun.write(filePath, newContent)
      return true // Content was written
    }

    const wasUpdated = await writeIfChanged('./src/generated/abi/gmxErrors.ts', abiContent)

    if (wasUpdated) {
      console.log('📝 Generated GMX error ABI file')
      return 1
    } else {
      console.log('✓ GMX error ABI unchanged')
      return 0
    }
  } catch (error) {
    console.error('❌ Error generating GMX errors:', error)
    throw error
  }
}

try {
  // Always fetch from GitHub main branch to ensure we have the latest addresses and ABIs
  const deployments = await fetchGmxDeployments()

  // Generate GMX errors while we still have the repo cloned
  let errorFilesUpdated = 0
  try {
    errorFilesUpdated = await generateGmxErrors()
  } catch (error) {
    console.warn('⚠️  Failed to generate GMX errors, continuing with contracts...')
  }

  // Clean up temp directory after we're done with it
  await $`rm -rf ${TEMP_DIR}`.catch(() => {})

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
  async function writeIfChanged(filePath: string, newContent: string): Promise<boolean> {
    try {
      const existingFile = Bun.file(filePath)
      if (await existingFile.exists()) {
        const existingContent = await existingFile.text()

        if (existingContent === newContent) {
          return false // Content unchanged, no write needed
        }
      }
    } catch {
      // File doesn't exist or can't be read, proceed with write
    }

    // Either file doesn't exist or content has changed - write new content
    await Bun.write(filePath, newContent)
    return true // Content was written
  }

  // Write individual ABI files
  let abiFilesUpdated = 0
  for (const contract of contracts) {
    if (contract.abi) {
      const abiFileName = `gmx${contract.name.replace('Gmx', '')}`
      const abiFilePath = `./src/generated/abi/${abiFileName}.ts`

      const abiContent = `// This file is auto-generated. Do not edit manually.
// Source: GMX deployment files from GitHub (main branch)

export default ${JSON.stringify(contract.abi, null, 2)} as const
`

      const wasUpdated = await writeIfChanged(abiFilePath, abiContent)

      if (wasUpdated) {
        console.log(`📝 Updated ABI for ${contract.name}`)
        abiFilesUpdated++
      } else {
        console.log(`✓ ABI unchanged for ${contract.name}`)
      }
    }
  }

  // Write the main contracts file
  const contractListContent = `// This file is auto-generated. Do not edit manually.
// Source: GMX deployment files from GitHub (main branch)

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

  const contractListUpdated = await writeIfChanged('./src/generated/gmxContracts.ts', contractListContent)

  // Only format files that were actually updated
  if (contractListUpdated) {
    await Bun.$`bunx @biomejs/biome format --write ./src/generated/gmxContracts.ts`
    console.log('📝 Updated main contract list')
  } else {
    console.log('✓ Main contract list unchanged')
  }

  if (abiFilesUpdated > 0 || errorFilesUpdated > 0) {
    await Bun.$`bunx @biomejs/biome format --write ./src/generated/abi/gmx*.ts`
  }

  console.log('\n✅ GMX V2 contract and error generation complete')
  console.log(`   - ${abiFilesUpdated} ABI file(s) updated`)
  console.log(`   - ${errorFilesUpdated} error file(s) updated`)
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
