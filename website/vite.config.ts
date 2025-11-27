import replace from '@rollup/plugin-replace'
import dotenv from 'dotenv'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths' // Import the plugin

dotenv.config({ path: '.env.local', override: true })
dotenv.config()

const SITE_CONFIG = {
  __WEBSITE__: 'https://puppet.house',
  __TWITTER_ID__: '@PuppetCopy',
  __APP_NAME__: 'Puppet',
  __APP_DESC_SHORT__: 'Puppet - Copy Trading',
  __APP_DESC_LONG__: 'Copy Trading Protocol - Matching the best traders with investors',
  __OG_IMAGE__: '/og-image.png', // TODO: Add static OG image
  __THEME_PRIMARY__: '#870B38',
  __THEME_BACKGROUND__: '#292c37'
}

if (!process.env.RHINESTONE_API_KEY) {
  throw new Error('RHINESTONE_API_KEY is required for dev proxy to Orchestrator')
}

export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      treeshake: 'recommended',
      output: {
        manualChunks(id) {
          // Porto wallet SDK - isolate for better caching
          if (id.includes('porto')) {
            return 'wallet'
          }

          // Don't manually chunk web3 packages - let Vite handle them
          // to avoid platform-specific circular dependency issues

          // Skip non-node_modules
          if (!id.includes('node_modules/') && !id.includes('/dist/')) {
            return undefined
          }

          // // Workspace packages
          if (['aelea/', 'middleware/dist', 'indexer/dist', 'ponder'].some(core => id.includes(core)))
            return 'puppet-core'

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
    port: Number(process.env.PORT) || 3000,
    proxy: {
      '/api/sql': {
        target: process.env.VITE_SQL_PROXY_URL || 'https://5jlt2hi0lte0h8n5pegrtoh72g.ingress.akash-palmito.org',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, '') // Strip /api prefix
      },
      '/api/orchestrator': {
        target: 'https://v1.orchestrator.rhinestone.dev',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/orchestrator/, ''),
        configure: proxy => {
          proxy.on('proxyReq', proxyReq => {
            // Set required headers for Rhinestone API
            proxyReq.setHeader('Content-Type', 'application/json')
            proxyReq.setHeader('x-api-key', process.env.RHINESTONE_API_KEY!)
            proxyReq.setHeader('Accept', 'application/json')
            proxyReq.setHeader('Accept-Encoding', 'identity')
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
        globPatterns: ['**/*.{js,html,png,svg,ico,woff2}']
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
        // start_url: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        categories: ['Copy Trading', 'Decentralized Perpetual Exchange', 'DeFi'],
        screenshots: [
          { src: 'assets/screenshot/narrow1.png', type: 'image/png', sizes: '828x1792', form_factor: 'narrow' },
          { src: 'assets/screenshot/narrow2.png', type: 'image/png', sizes: '828x1792', form_factor: 'narrow' },

          { src: 'assets/screenshot/wide1.png', type: 'image/png', sizes: '3260x1692', form_factor: 'wide' },
          { src: 'assets/screenshot/wide2.png', type: 'image/png', sizes: '3260x1692', form_factor: 'wide' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: false, // Don't claim clients immediately
        skipWaiting: false // Wait for all tabs to close before activating
      },
      mode: 'development',
      devOptions: {
        enabled: false,
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
