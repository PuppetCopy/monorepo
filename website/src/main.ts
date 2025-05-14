export { setTheme } from 'aelea/ui-components-theme-browser'

import { $wrapNativeElement, runBrowser, style } from 'aelea/core'
import { designSheet, isDesktopScreen, isMobileScreen } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import { $Main } from './pages/$Main.js'

runBrowser({
  $rootNode: $wrapNativeElement(document.body)(
    designSheet.customScroll,
    style({
      color: pallete.message,
      fill: pallete.message,
      // position: 'relative',
      // backgroundImage: `radial-gradient(570% 71% at 50% 15vh, ${pallete.background} 0px, ${pallete.horizon} 100%)`,
      backgroundColor: pallete.horizon,
      fontSize: isDesktopScreen ? '16px' : '14px',
      // fontSize: isDesktopScreen ? '1.15rem' : '1rem',
      fontWeight: 400
      // flexDirection: 'row',
    }),
    isMobileScreen ? style({ userSelect: 'none' }) : style({})
  )($Main({})({}))
})
