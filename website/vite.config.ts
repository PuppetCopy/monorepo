import replace from '@rollup/plugin-replace'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths' // Import the plugin

const SITE_CONFIG = {
  __WEBSITE__: 'https://puppet.house',
  __TWITTER_ID__: '@PuppetCopy',
  __APP_NAME__: 'Puppet',
  __APP_DESC_SHORT__: 'Puppet - Copy Trading',
  __APP_DESC_LONG__: 'Copy Trading Protocol - Matching the best traders with investors',
  __OG_IMAGE__: '/.netlify/functions/og-middlware',
  __THEME_PRIMARY__: '#870B38',
  __THEME_BACKGROUND__: '#292c37'
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          subgraph: ['ponder'],
          aelea: [
            'aelea/core',
            'aelea/ui-components',
            'aelea/ui-components-theme',
            'aelea/ui-components-theme-browser'
          ],
          middleware: [
            '@puppet-copy/middleware/const',
            '@puppet-copy/middleware/core',
            '@puppet-copy/middleware/utils',
            '@puppet-copy/middleware/gmx',
            '@puppet-copy/middleware/gbc',
            '@puppet-copy/middleware/ui-components',
            '@puppet-copy/middleware/ui-router',
            '@puppet-copy/middleware/ui-storage'
          ],
          vendor: [
            '@most/core',
            '@most/disposable',
            '@most/prelude',
            '@most/scheduler',
            '@most/types',
            'color',
            'mersenne-twister'
          ],
          // wallet: ['@reown/appkit', '@reown/appkit-adapter-wagmi', '@wagmi/core'],
          charts: ['lightweight-charts']
        }
      }
    }
  },
  server: {
    port: Number(process.env.PORT) || 3000
  },
  plugins: [
    tsconfigPaths(),
    VitePWA({
      registerType: 'prompt',

      strategies: 'injectManifest',
      injectManifest: {
        maximumFileSizeToCacheInBytes: 3000000,
        globPatterns: ['**/*.{js,html,woff2}']
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
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
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
