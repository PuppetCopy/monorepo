export { setTheme } from 'aelea/ui-components-theme-browser'

import { render } from 'aelea/ui'
import { $Main } from './pages/$Main.js'

render({
  namespace: 'Ω',
  rootAttachment: document.querySelector('html')!,
  $rootNode: $Main({})({})
})
