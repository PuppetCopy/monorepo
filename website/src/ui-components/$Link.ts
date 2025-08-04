import { $element, component, type I$Node, type IStyleCSS, style, styleBehavior } from 'aelea/core'
import { $RouterAnchor, type IAnchor } from 'aelea/router'
import { combine, empty, type IBehavior, type IStream, map, o } from 'aelea/stream'
import { pallete } from 'aelea/ui-components-theme'

export interface ILink extends Omit<IAnchor, '$anchor'> {
  $content: I$Node<HTMLAnchorElement>
  disabled?: IStream<boolean>
}

const $anchor = $element('a')(
  style({
    flexShrink: 0,
    minWidth: 0,
    color: pallete.message
  })
)

export const $Link = ({ url, route, $content, anchorOp, disabled = empty }: ILink) =>
  component(
    (
      [click, clickTether]: IBehavior<string, string>,
      [active, containsTether]: IBehavior<boolean, boolean>,
      [focus, focusTether]: IBehavior<boolean, boolean>
    ) => {
      const $anchorEl = $anchor(
        styleBehavior(
          combine(
            (isActive, isFocus): IStyleCSS | null => {
              return isActive
                ? { color: `${pallete.message} !important`, fill: pallete.message, cursor: 'default' }
                : isFocus
                  ? { color: `${pallete.message} !important`, fill: pallete.message }
                  : null
            },
            active,
            focus
          )
        ),
        styleBehavior(map(isDisabled => (isDisabled ? { pointerEvents: 'none', opacity: 0.3 } : {}), disabled))
      )($content)

      return [
        $RouterAnchor({ $anchor: $anchorEl, url, route, anchorOp: o(anchorOp || o(), style({ padding: 0 })) })({
          click: clickTether(),
          focus: focusTether(),
          contains: containsTether()
        }),

        { click, active, focus }
      ]
    }
  )

export const $AnchorLink = (config: ILink) => {
  return $Link({
    ...config,
    anchorOp: o(
      config.anchorOp || o(),
      style({ textDecoration: 'underline', minWidth: 0, textDecorationColor: pallete.primary })
    )
  })
}
