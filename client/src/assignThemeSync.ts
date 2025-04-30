
import type { Theme } from "@aelea/ui-components-theme"
import { dark, light } from "./common/theme.js"

const THEME_PALLETE_SELECTED_KEY = `!!THEME_PALLETE_SELECTED_KEY`
const storedThemeName = localStorage.getItem(THEME_PALLETE_SELECTED_KEY)
const themeList = [dark, light]

function setTheme(themeName: string) {
  localStorage.setItem(THEME_PALLETE_SELECTED_KEY, themeName)
  return theme
}
const darkModePreferance = self?.matchMedia('(prefers-color-scheme: dark)')?.matches
const defaultTheme = darkModePreferance ? light : dark

let theme: Theme

if (storedThemeName && typeof storedThemeName === 'string') {
  const matchedTheme = themeList.find(t => t.name === storedThemeName)

  if (matchedTheme) {
    theme = setTheme(matchedTheme.name)
  } else {
    theme = setTheme(defaultTheme.name)
  }
} else {
  setTheme(defaultTheme.name)
  theme = defaultTheme
}

export { theme }


