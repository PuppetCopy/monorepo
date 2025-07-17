#!/usr/bin/env bun
import { $, file } from 'bun'

console.log('🏗️  Building versioned packages...')

try {
  const packages = await getPackagesFromChangeset()
  console.log(`📦 Found ${packages.length} packages: ${packages.join(', ')}`)

  for (const pkg of packages) {
    console.log(`\n🔨 Building ${pkg}...`)

    // Check if package has a build script
    const packagePath = `./${pkg}/package.json`
    const packageFile = file(packagePath)

    if (await packageFile.exists()) {
      const pkgJson = await packageFile.json()

      if (pkgJson.scripts?.build) {
        console.log(`  - Running build script for ${pkg}`)
        await $`cd ${pkg} && bun run build`
        console.log(`  ✅ ${pkg} built successfully`)
      } else {
        console.log(`  ⏭️  No build script found for ${pkg}`)
      }
    } else {
      console.log(`  ⚠️  Package.json not found for ${pkg}`)
    }
  }

  console.log('\n🎉 All packages built successfully!')
} catch (error) {
  console.error('❌ Build failed:', error)
  process.exit(1)
}

// Get packages from changeset config
async function getPackagesFromChangeset(): Promise<string[]> {
  const changesetConfig = await file('./.changeset/config.json').json()

  // Get packages from the fixed groups (they should all have the same version)
  const fixedGroups = changesetConfig.fixed || []
  if (fixedGroups.length > 0) {
    return fixedGroups[0] // Use the first fixed group
  }

  // Fallback to workspace discovery if no fixed groups
  const rootPackage = await file('./package.json').json()
  return rootPackage.workspaces || []
}
