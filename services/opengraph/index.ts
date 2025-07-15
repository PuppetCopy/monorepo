import { $node, $text, runBrowser, style } from 'aelea/core'
import { writeFileSync } from 'fs'
import satori from 'satori'
import { html } from 'satori-html'

// Fetch font from Google Fonts
const fontResponse = await fetch('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap')
const fontCss = await fontResponse.text() // Add await here
const fontUrl = fontCss.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1]

if (!fontUrl) {
  throw new Error('Could not extract font URL from CSS')
}

runBrowser({ $rootNode: $node(style({ backgroundColor: 'red' }))($text('hello worldzz')) })

const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer())

const markup = html`<div style="color: black;">hello, world</div>`

const svg = await satori(markup, {
  width: 600,
  height: 400,
  fonts: [
    {
      name: 'Inter',
      data: fontData,
      weight: 400,
      style: 'normal'
    }
  ]
})

writeFileSync('./output.svg', svg)
