#!/usr/bin/env bun
import { readFileSync } from 'fs'
import { join } from 'path'

// Define the expected chain ID
const CHAIN_ID = 42161 // Arbitrum

// Path to contracts directory (relative to middleware)
const CONTRACTS_PATH = '../contracts'
const FORGE_ARTIFACTS_PATH = join(CONTRACTS_PATH, 'forge-artifacts')
const DEPLOYMENTS_PATH = join(CONTRACTS_PATH, 'deployments.json')
const ERROR_SOL_PATH = join(CONTRACTS_PATH, 'src/utils/Error.sol')

// Contract names will be derived from deployments.json

type ContractInfo = {
  name: string
  address: string
  abi?: any[]
}

async function findAbiFile(contractName: string): Promise<any[] | undefined> {
  try {
    // Look for the ABI file in forge-artifacts
    const artifactPath = join(FORGE_ARTIFACTS_PATH, `${contractName}.sol`, `${contractName}.json`)
    const artifactFile = Bun.file(artifactPath)

    if (await artifactFile.exists()) {
      const artifact = await artifactFile.json()
      return artifact.abi
    }

    console.warn(`⚠️  No ABI found for ${contractName}`)
    return undefined
  } catch (error) {
    console.error(`❌ Error loading ABI for ${contractName}:`, error)
    return undefined
  }
}

async function generateErrorAbi() {
  try {
    console.log('⚠️  Generating Error ABI from Error.sol...')

    // Read and parse the Error.sol file
    const errorSolContent = readFileSync(ERROR_SOL_PATH, 'utf-8')

    // Extract error definitions using regex
    const errorRegex = /error\s+(\w+)\s*\((.*?)\)\s*;/g
    const errors: any[] = []

    let match: RegExpExecArray | null
    while ((match = errorRegex.exec(errorSolContent)) !== null) {
      const errorName = match[1]
      const params = match[2].trim()

      const errorAbi: any = {
        type: 'error',
        name: errorName
      }

      // Parse parameters if any
      if (params) {
        const inputs: any[] = []

        // Split parameters and parse each one
        const paramList = params.split(',').map(p => p.trim())

        for (const param of paramList) {
          // Match type and name
          const paramMatch = param.match(/^(.+?)\s+(\w+)$/)
          if (paramMatch) {
            let [, type, name] = paramMatch

            // Convert Solidity types to ABI types
            if (type === 'uint') type = 'uint256'
            if (type === 'IERC20') type = 'address'

            // Determine internalType
            let internalType = type
            if (type === 'address' && param.includes('IERC20')) {
              internalType = 'contract IERC20'
            }

            inputs.push({
              name,
              internalType,
              type: type === 'contract IERC20' ? 'address' : type
            })
          }
        }

        if (inputs.length > 0) {
          errorAbi.inputs = inputs
        }
      } else {
        errorAbi.inputs = []
      }

      errors.push(errorAbi)
    }

    // Generate the TypeScript export
    const output = `// This file is auto-generated from contracts/src/utils/Error.sol

export const errorAbi = ${JSON.stringify(errors, null, 2).replace(/"(\w+)":/g, '$1:')} as const
`

    // Write to the generated folder
    await Bun.write('./src/generated/abi/errorAbi.ts', output)

    console.log(`✅ Generated error ABI with ${errors.length} errors`)
  } catch (error) {
    console.error('❌ Error generating error ABI:', error)
    throw error
  }
}

async function generateContracts() {
  try {
    console.log('📥 Loading Puppet contract deployments...')

    // Load deployments
    const deploymentsFile = Bun.file(DEPLOYMENTS_PATH)
    const deployments = await deploymentsFile.json()

    if (!deployments[CHAIN_ID]) {
      throw new Error(`No deployments found for chain ID ${CHAIN_ID}`)
    }

    const addresses = deployments[CHAIN_ID]

    // Load contract info with ABIs
    const contracts: ContractInfo[] = []

    // Dynamically get all contract names from deployments
    const contractNames = Object.keys(addresses)
    console.log(`📋 Found ${contractNames.length} contracts in deployments`)

    for (const contractName of contractNames) {
      const abi = await findAbiFile(contractName)

      contracts.push({
        name: contractName,
        address: addresses[contractName],
        abi
      })
    }

    console.log(`\n✅ Loaded ${contracts.length} contracts`)

    // Generate TypeScript file
    const fileContent = `// This file is auto-generated. Do not edit manually.
// Source: Puppet deployments.json and forge-artifacts

import type { Address } from 'viem'

// Import generated ABIs
${contracts
  .filter(c => c.abi)
  .map(c => `import ${c.name.toLowerCase()}Abi from './abi/puppet${c.name}.js'`)
  .join('\n')}

export const PUPPET_CONTRACT_MAP = {
${contracts
  .map(contract => {
    if (contract.abi) {
      return `  ${contract.name}: {
    address: '${contract.address}',
    abi: ${contract.name.toLowerCase()}Abi
  }`
    }
    return `  ${contract.name}: {
    address: '${contract.address}'
  }`
  })
  .join(',\n')}
} as const
`

    // Write individual ABI files
    for (const contract of contracts) {
      if (contract.abi) {
        const abiFileName = `puppet${contract.name}`
        const abiFilePath = `./src/generated/abi/${abiFileName}.ts`
        const abiContent = `// This file is auto-generated. Do not edit manually.
// Source: forge-artifacts/${contract.name}.sol/${contract.name}.json

export default ${JSON.stringify(contract.abi, null, 2)} as const
`
        await Bun.write(abiFilePath, abiContent)
        console.log(`📝 Generated ABI for ${contract.name}`)
      }
    }

    // Write the main contracts file
    await Bun.write('./src/generated/puppetContracts.ts', fileContent)

    // Generate error ABI from Error.sol
    await generateErrorAbi()

    // Format the generated files with biome
    await Bun.$`bunx @biomejs/biome format --write ./src/generated/puppetContracts.ts`
    await Bun.$`bunx @biomejs/biome format --write ./src/generated/abi/puppet*.ts`
    await Bun.$`bunx @biomejs/biome format --write ./src/generated/abi/errorAbi.ts`

    console.log('✅ Successfully generated Puppet contract list with ABIs and errors')
    console.log('\nGenerated contracts:')
    contracts.forEach(contract => {
      console.log(`- ${contract.name}: ${contract.address}`)
    })
  } catch (error) {
    console.error('❌ Error generating Puppet contracts:', error)
    process.exit(1)
  }
}

// Run the generation
await generateContracts()
