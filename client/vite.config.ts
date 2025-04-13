import replace from '@rollup/plugin-replace'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths' // Import the plugin
import { dark } from './src/common/theme.js'

const SITE_CONFIG = {
  __WEBSITE__: 'https://puppet.house',
  __TWITTER_ID__: '@PuppetCopy',
  __APP_NAME__: 'Puppet',
  __APP_DESC_SHORT__: 'Puppet - Copy Trading',
  __APP_DESC_LONG__: 'Copy Trading Protocol - Matching the best traders with investors',
  __OG_IMAGE__: '/.netlify/functions/og-middlware',
  __THEME_PRIMARY__: dark.pallete.primary,
  __THEME_BACKGROUND__: dark.pallete.horizon,
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  plugins: [
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      injectManifest: {
        maximumFileSizeToCacheInBytes: 15000000,
        globPatterns: ['**/*.{js,html,woff2}']
      },
      injectRegister: 'auto',
      srcDir: 'src/service-worker',
      filename: 'sw.ts',
      pwaAssets: {
        disabled: false,
        config: true,
      },
      manifest: {
        name: SITE_CONFIG.__APP_NAME__,
        short_name: SITE_CONFIG.__APP_NAME__,
        description: SITE_CONFIG.__APP_DESC_LONG__,
        theme_color: SITE_CONFIG.__THEME_BACKGROUND__,
        background_color: SITE_CONFIG.__THEME_BACKGROUND__,
        lang: "en",
        start_url: '/app/leaderboard',
        display: "standalone",
        orientation: "any",
        categories: ["Copy Trading", "Decentralized Perpetual Exchange", "DeFi"],
        screenshots: [
          { src: "assets/screenshot/narrow1.png", type: "image/png", sizes: "828x1792", form_factor: "narrow" },
          { src: "assets/screenshot/narrow2.png", type: "image/png", sizes: "828x1792", form_factor: "narrow" },

          { src: "assets/screenshot/wide1.png", type: "image/png", sizes: "3260x1692", form_factor: "wide" },
          { src: "assets/screenshot/wide2.png", type: "image/png", sizes: "3260x1692", form_factor: "wide" }
        ],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
        ]
      },
      mode: 'development',
      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
    replace({
      include: 'index.html',
      ...SITE_CONFIG
    })
  ]
})