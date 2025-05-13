import { $custom, $node, style } from 'aelea/core'

export const $heading1 = $custom('h1')(style({ fontSize: '3rem', fontWeight: 900, letterSpacing: '.05em', margin: 0 }))
export const $heading2 = $custom('h2')(style({ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '.05em', margin: 0 }))
export const $heading3 = $custom('h3')(
  style({ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '.05em', margin: 0 })
)
