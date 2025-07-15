#!/usr/bin/env bun
import { $, file, write } from 'bun'
import { join } from 'path'

console.log('🚀 Starting post-deployment synchronization...')

try {
  // Step 1: Update contract addresses and generate fresh ABIs
  console.log('\n🔧 Step 1: Updating contract addresses and generating ABIs...')

  // Read deployments and update contract.ts directly
  const deploymentsFile = file('../contracts/deployments.json')
  const deployments = await deploymentsFile.json()
  const addresses = deployments[42161]

  // Update contract.ts with new addresses
  const contractFile = file('./src/const/contract.ts')
  let contractContent = await contractFile.text()

  // Format addresses in single-line style
  const formattedAddresses = Object.entries(addresses)
    .map(([key, value]) => `  ${key}: '${value}'`)
    .join(',\n')

  // Replace addresses block content
  contractContent = contractContent.replace(
    /const addresses = \{[\s\S]*?\} as const/,
    `const addresses = {\n${formattedAddresses}\n} as const`
  )

  await write('./src/const/contract.ts', contractContent)
  console.log('✅ Contract addresses updated')

  await $`bunx wagmi generate`
  console.log('✅ ABIs generated successfully')

  // Step 2: Build and bump middleware version
  console.log('\n📦 Step 2: Building middleware and bumping version...')

  await $`bun run build`
  console.log('✅ Middleware built successfully')

  // Read current middleware package.json
  const middlewarePackageFile = file('./package.json')
  const middlewarePackage = await middlewarePackageFile.json()
  const currentVersion = middlewarePackage.version

  // Bump minor version
  const [major, minor, patch] = currentVersion.split('.').map(Number)
  const newVersion = `${major}.${minor + 1}.0`

  middlewarePackage.version = newVersion
  await write('./package.json', JSON.stringify(middlewarePackage, null, 2))

  console.log(`📈 Version bumped: ${currentVersion} → ${newVersion}`)

  // Step 3: Publish middleware package
  console.log('\n📤 Step 3: Publishing middleware package...')

  await $`cd .. && bun run changeset:publish`
  console.log('✅ Middleware package published')

  // Wait for npm registry propagation
  console.log('⏳ Waiting for npm registry propagation...')
  await new Promise((resolve) => setTimeout(resolve, 10000)) // 10 second delay

  // Step 4: Update dependencies across monorepo
  console.log('\n🔄 Step 4: Updating dependencies across monorepo...')

  const packagesToUpdate: string[] = []
  const rootDir = '..'

  // Common package locations in the monorepo
  const packageDirs = ['keeper', 'website', 'indexer', 'middleware']

  for (const dir of packageDirs) {
    const packageJsonPath = join(rootDir, dir, 'package.json')
    const packageFile = file(packageJsonPath)

    if (await packageFile.exists()) {
      const packageJson = await packageFile.json()

      // Check if it depends on @puppet-copy/middleware
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.peerDependencies
      }

      if (deps['@puppet-copy/middleware']) {
        packagesToUpdate.push(join(rootDir, dir))
        console.log(`📍 Found middleware dependency in: ${dir}`)
      }
    }
  }

  const updatedPackages: string[] = []
  for (const packagePath of packagesToUpdate) {
    const wasUpdated = await updateMiddlewareDependency(packagePath, newVersion)
    if (wasUpdated) {
      updatedPackages.push(packagePath)
    }
  }

  // Step 5: Install updated dependencies in each package
  console.log('\n⬇️  Step 5: Installing updated dependencies...')

  for (const packagePath of updatedPackages) {
    console.log(`📦 Installing dependencies in ${packagePath}...`)
    await $`cd ${packagePath} && bun install`
    console.log(`✅ Dependencies installed in ${packagePath}`)
  }

  console.log('\n🎉 Post-deployment synchronization completed successfully!')
  console.log(`📦 Middleware version: ${newVersion}`)
  console.log(`📁 Updated packages: ${packagesToUpdate.length}`)
} catch (error) {
  console.error('❌ Deployment sync failed:', error)
  process.exit(1)
}

/**
 * Update the middleware dependency version in a package.json
 */
async function updateMiddlewareDependency(packagePath: string, newVersion: string): Promise<boolean> {
  const packageJsonPath = join(packagePath, 'package.json')
  const packageFile = file(packageJsonPath)
  const content = await packageFile.text()

  // Replace @puppet-copy/middleware version, but skip workspace: dependencies
  const updatedContent = content.replace(
    /"@puppet-copy\/middleware":\s*"(?!workspace:)[^"]*"/g,
    `"@puppet-copy/middleware": "${newVersion}"`
  )

  if (content !== updatedContent) {
    await write(packageJsonPath, updatedContent)
    console.log(`🔄 Updated ${packagePath}/package.json → ${newVersion}`)
    return true
  }
  console.log(`⏭️  Skipped ${packagePath}/package.json (workspace dependency)`)
  return false
}
