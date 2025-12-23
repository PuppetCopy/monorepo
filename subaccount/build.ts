const isWatch = Bun.argv.includes('--watch')
const isProd = Bun.argv.includes('--production')
const outdir = './dist'
const srcdir = './src'

// Environment-based configuration
const PUPPET_URL = isProd ? 'https://puppet.tech' : 'http://localhost:3000'
const RPC_URL = process.env.RPC_URL || 'https://arb1.arbitrum.io/rpc'

async function build() {
  console.log(`Building wallet extension... (${isProd ? 'production' : 'development'})`)

  // Clean output directory
  await Bun.$`rm -rf ${outdir}`.quiet()

  // Build all entrypoints
  const result = await Bun.build({
    entrypoints: [`${srcdir}/background.ts`, `${srcdir}/content.ts`, `${srcdir}/inpage.ts`],
    outdir,
    target: 'browser',
    format: 'esm',
    minify: isProd,
    sourcemap: isWatch ? 'inline' : 'none',
    define: {
      PUPPET_URL: JSON.stringify(PUPPET_URL),
      RPC_URL: JSON.stringify(RPC_URL)
    }
  })

  if (!result.success) {
    console.error('Build failed:')
    for (const log of result.logs) {
      console.error(log)
    }
    process.exit(1)
  }

  // Copy static files
  await Bun.$`cp ${srcdir}/manifest.json ${outdir}/manifest.json`.quiet()
  await Bun.$`cp ${srcdir}/icon.png ${outdir}/icon.png`.quiet()

  console.log('Build complete!')
}

await build()

if (isWatch) {
  console.log('Watching for changes...')
  const { watch } = await import('node:fs')
  watch(srcdir, { recursive: true }, async (_event: string, filename: string | null) => {
    if (filename?.endsWith('.ts') || filename?.endsWith('.html') || filename?.endsWith('.json')) {
      console.log(`\nFile changed: ${filename}`)
      await build()
    }
  })
}
