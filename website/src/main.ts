import { registerSW } from 'virtual:pwa-register'

registerSW()

export { setTheme } from 'aelea/ui-components-theme-browser'

import { runBrowser } from 'aelea/core'
import { $Main } from './pages/$Main.js'

runBrowser()($Main({})({}))
