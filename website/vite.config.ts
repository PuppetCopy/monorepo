import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

dotenv.config({ path: '.env.local', override: true })
dotenv.config()

const SITE_CONFIG = {
  __WEBSITE__: 'https://puppet.house',
  __TWITTER_ID__: '@PuppetCopy',
  __APP_NAME__: 'Puppet',
  __APP_DESC_SHORT__: 'Puppet - Copy Trading',
  __APP_DESC_LONG__: 'Copy Trading Protocol - Matching the best masters with investors',
  __OG_IMAGE__: '/assets/og-image.png',
  __THEME_PRIMARY__: '#870B38',
  __THEME_BACKGROUND__: '#292c37'
}

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      treeshake: 'recommended',
      output: {
        manualChunks(id) {
          // Don't manually chunk web3 packages - let Vite handle them
          // to avoid platform-specific circular dependency issues

          // Skip non-node_modules
          if (!id.includes('node_modules/') && !id.includes('/dist/')) {
            return undefined
          }

          // // Workspace packages
          if (['aelea/', 'sdk/dist', 'indexer/dist', 'ponder'].some(core => id.includes(core))) return 'puppet-core'

          // // Heavy dependencies that should be isolated
          if (id.includes('lightweight-charts')) return 'charts'
          if (id.includes('ponder')) return 'subgraph'

          // Web3 related - keep together to avoid circular deps

          // All other node_modules go to vendor
          // if (id.includes('node_modules/')) return 'vendor'
        }
      }
    }
  },
  server: {
    port: Number(Bun.env.PORT) || 3000,
    proxy: {
      '/api/rpc': {
        target: Bun.env.RPC_URL,
        changeOrigin: true,
        secure: true,
        rewrite: path => {
          const url = new URL(path, 'http://localhost')
          const network = url.searchParams.get('network')
          return `/${network}/${Bun.env.RPC_KEY}`
        }
      },
      '/api/indexer': {
        target: Bun.env.INDEXER_ENDPOINT,
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/indexer/, '')
      },
      '/api/matchmaker': {
        target: Bun.env.MATCHMAKER_URL,
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/api\/matchmaker/, '/ws')
      },
      '/api/orchestrator': {
        target: 'https://v1.orchestrator.rhinestone.dev',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/orchestrator/, ''),
        configure: proxy => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (Bun.env.ORCHESTRATOR_API_KEY) {
              proxyReq.setHeader('x-api-key', Bun.env.ORCHESTRATOR_API_KEY)
              // Request uncompressed response for logging
              proxyReq.removeHeader('accept-encoding')
              console.log('[Proxy] Forwarding to orchestrator:', req.url)
            } else {
              console.warn('[Proxy] ORCHESTRATOR_API_KEY not set!')
            }
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            if (req.url?.includes('/intent')) {
              let body = ''
              proxyRes.on('data', chunk => {
                body += chunk.toString()
              })
              proxyRes.on('end', () => {
                console.log(
                  '[Proxy] Orchestrator response for',
                  req.url,
                  '(status:',
                  proxyRes.statusCode,
                  '):',
                  body.slice(0, 2000)
                )
              })
            }
          })
        }
      }
    }
  },
  plugins: [
    tsconfigPaths(),
    VitePWA({
      registerType: 'prompt',
      strategies: 'injectManifest',
      injectManifest: {
        maximumFileSizeToCacheInBytes: 4000000,
        globPatterns: ['**/*.{js,html,svg,ico,woff2,png}']
      },
      injectRegister: 'auto',
      srcDir: 'src/sw',
      filename: 'service-worker.ts',
      pwaAssets: {
        config: true,
        overrideManifestIcons: true
      },
      manifest: {
        name: SITE_CONFIG.__APP_NAME__,
        short_name: SITE_CONFIG.__APP_NAME__,
        description: SITE_CONFIG.__APP_DESC_LONG__,
        theme_color: SITE_CONFIG.__THEME_BACKGROUND__,
        background_color: SITE_CONFIG.__THEME_BACKGROUND__,
        lang: 'en',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait-primary',
        categories: ['Copy Trading', 'DeFi'],
        screenshots: [
          { src: 'assets/screenshot/narrow1.png', type: 'image/png', sizes: '828x1792', form_factor: 'narrow' },
          { src: 'assets/screenshot/narrow2.png', type: 'image/png', sizes: '828x1792', form_factor: 'narrow' },

          { src: 'assets/screenshot/wide1.png', type: 'image/png', sizes: '3260x1692', form_factor: 'wide' },
          { src: 'assets/screenshot/wide2.png', type: 'image/png', sizes: '3260x1692', form_factor: 'wide' }
        ]
      },
      // Note: workbox options are not used with injectManifest strategy
      // Service worker lifecycle is controlled in src/sw/service-worker.ts
      devOptions: {
        enabled: !!Bun.env.VITE_PWA_DEV,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module'
      }
    }),
    replace({
      preventAssignment: true,
      include: 'index.html',
      ...SITE_CONFIG
    })
  ]
})
