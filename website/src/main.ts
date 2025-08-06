export { setTheme } from 'aelea/ui-components-theme-browser'

import { render } from 'aelea/core'
import { $Main } from './pages/$Main.js'

render({
  rootAttachment: document.querySelector('html')!,
  $rootNode: $Main({})({})
})

// const browserScheduler = createDomScheduler()
// const config: IRunEnvironment = {
//   namespace: '•',
//   stylesheet: new CSSStyleSheet(),
//   cache: [],
//   rootAttachment: document.querySelector('html')!,
//   scheduler: browserScheduler,
//   $rootNode: $Main({})({})
// }

// document.adoptedStyleSheets = [...document.adoptedStyleSheets, config.stylesheet]

// $createRoot(config).run(
//   {
//     end() {
//       console.log('Application has ended.')
//     },
//     error(err: Error) {
//       console.error('An error occurred:', err)
//     },
//     event() {
//       // Handle events if necessary
//     }
//   },
//   browserScheduler
// )
