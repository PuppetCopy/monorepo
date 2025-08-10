import { $custom, style } from 'aelea/ui'

export const $heading1 = $custom('h1')(
  style({ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '.05em', margin: 0 })
)
export const $heading2 = $custom('h2')(
  style({ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '.05em', margin: 0 })
)
export const $heading3 = $custom('h3')(style({ fontSize: '1rem', fontWeight: 900, letterSpacing: '.05em', margin: 0 }))
