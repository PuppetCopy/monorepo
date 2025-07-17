#!/usr/bin/env bun
import { $, file, write } from 'bun'

// Get release type from command line args
const releaseType = process.argv[2] || 'patch'
if (!['patch', 'minor', 'major'].includes(releaseType)) {
  console.error('❌ Invalid release type. Use: patch, minor, or major')
  process.exit(1)
}

console.log(`🚀 Starting monorepo ${releaseType} release process...`)

try {
  // 1. Ensure we're on release branch
  const currentBranch = await $`git branch --show-current`.text()
  if (currentBranch.trim() !== 'release') {
    console.error(`❌ Must be on release branch to release. Current branch: ${currentBranch.trim()}`)
    console.error('Please checkout to release branch first: git checkout release')
    process.exit(1)
  }

  // 2. Ensure working directory is clean
  const gitStatus = await $`git status -s`.text()
  if (gitStatus.trim()) {
    console.error('❌ Working directory is not clean. Commit or stash changes first.')
    process.exit(1)
  }

  // 3. Build packages first to ensure they're working
  console.log('🏗️  Building packages...')
  await $`bun run build:packages`

  // 4. Get packages from changeset config
  const packages = await getPackagesFromChangeset()
  console.log(`📦 Found ${packages.length} packages in changeset config: ${packages.join(', ')}`)

  // Create changeset for the release type
  console.log(`📈 Creating ${releaseType} changeset...`)
  const changesetId = `release-${Date.now()}`
  const changesetContent = `---
${packages.map((pkg) => `"@puppet-copy/${pkg}": ${releaseType}`).join('\n')}
---

${releaseType.charAt(0).toUpperCase() + releaseType.slice(1)} release
`
  await write(`.changeset/${changesetId}.md`, changesetContent)

  // 5. Bump version using changesets
  console.log('📈 Bumping versions...')
  await $`bun changeset version`

  // Get the new version (all packages should have same version due to fixed versioning)
  const middlewarePackage = await file('./middleware/package.json').json()
  const newVersion = middlewarePackage.version
  console.log(`✅ New version: ${newVersion}`)

  // 6. Process each package sequentially
  for (const pkg of packages) {
    console.log(`\n📦 Processing ${pkg}...`)

    const packagePath = `./${pkg}/package.json`
    const packageFile = file(packagePath)
    const packageContent = await packageFile.text()

    // Replace workspace:* references with the new version
    const regex = /"@puppet-copy\/[^"]+":\s*"workspace:\*"/g
    const newContent = packageContent.replace(regex, (match) => {
      return match.replace('"workspace:*"', `"${newVersion}"`)
    })

    if (newContent !== packageContent) {
      await write(packagePath, newContent)
      console.log(`  - Replaced workspace:* references with ${newVersion}`)
    }

    // Install dependencies to generate lock file (temporarily hide workspace)
    console.log('  - Installing dependencies...')
    // Temporarily rename package.json to hide workspace structure
    await $`mv package.json package.json.tmp`
    
    try {
      await $`cd ${pkg} && bun install`
    } finally {
      // Restore root package.json
      await $`mv package.json.tmp package.json`
    }

    // Build package if it has a build script
    const pkgJson = JSON.parse(newContent)
    if (pkgJson.scripts?.build) {
      console.log('  - Building package...')
      try {
        await $`cd ${pkg} && bun run build`
      } catch (e) {
        console.log(`  ⚠️  Build failed: ${e}`)
      }
    }
  }

  // 7. Commit all changes
  console.log('\n💾 Committing release changes...')
  await $`git add -A`
  await $`git commit -m "chore: prepare release v${newVersion}

- Replace workspace:* with v${newVersion}
- Generate lock files for all packages
- Build all packages"`

  // 8. Create and push tag
  console.log(`🏷️  Creating tag v${newVersion}...`)
  await $`git tag -a "v${newVersion}" -m "Release v${newVersion}"`

  // 9. Push release branch and tag
  console.log('📤 Pushing to remote...')
  await $`git push origin release`
  await $`git push origin "v${newVersion}"`

  // 10. Create GitHub release
  console.log('📝 Creating GitHub release...')
  try {
    await $`gh release create "v${newVersion}" --title "v${newVersion}" --notes "Release v${newVersion}" --target release`
  } catch (e) {
    console.log('⚠️  Failed to create GitHub release. You may need to create it manually.')
  }

  console.log(`\n✅ Release v${newVersion} completed successfully!`)
  console.log('Railway will automatically deploy from the release branch.')

} catch (error) {
  console.error('❌ Release failed:', error)
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
