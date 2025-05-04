import type { Theme } from 'aelea/ui-components-theme'
import { dark, light } from './common/theme.js'

const THEME_PALLETE_SELECTED_KEY = `!!THEME_PALLETE_SELECTED_KEY`
const themeList = [dark, light]

// Function to update local storage (side effect only)
function storeThemePreference(themeName: string) {
  localStorage.setItem(THEME_PALLETE_SELECTED_KEY, themeName)
}

const prefersDarkMode = self?.matchMedia('(prefers-color-scheme: dark)')?.matches
const defaultTheme = prefersDarkMode ? dark : light
const storedThemeName = localStorage.getItem(THEME_PALLETE_SELECTED_KEY)
const matchedStoredTheme = themeList.find((t) => t.name === storedThemeName)

let theme: Theme
if (matchedStoredTheme) {
  theme = matchedStoredTheme
  storeThemePreference(theme.name)
} else {
  theme = defaultTheme
  storeThemePreference(theme.name)
}

export { theme }
