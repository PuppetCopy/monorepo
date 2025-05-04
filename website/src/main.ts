
import { runBrowser } from 'aelea/dom'
import { theme } from './assignThemeSync.js'
import { $Main } from './pages/$Main.js'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.theme = theme

runBrowser()(
  $Main({})({})
)
