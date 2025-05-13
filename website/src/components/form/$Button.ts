import { empty, map, multicast, now, recoverWith, startWith } from '@most/core'
import type { Stream } from '@most/types'
import { PromiseStatus, promiseState } from '@puppet/middleware/utils'
import {
  $element,
  $node,
  attrBehavior,
  combineArray,
  combineState,
  component,
  type I$Node,
  type IBehavior,
  type INode,
  nodeEvent,
  O,
  style,
  styleBehavior,
  styleInline,
  stylePseudo
} from 'aelea/core'
import { $row, type Control, layoutSheet, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import { $iconCircular } from '../../common/elements/$common.js'
import { $ButtonCore, $defaultButtonCore, type IButtonCore } from './$ButtonCore.js'

export const $defaultButtonPrimary = $defaultButtonCore(
  style({
    color: pallete.message,
    whiteSpace: 'nowrap',
    fill: 'white',
    borderRadius: '30px',
    alignSelf: 'flex-end',
    fontSize: '1.6rem',

    height: '48px',
    padding: '0 24px',
    fontWeight: 'bold',
    border: 'none',
    backgroundColor: pallete.primary
  })
  // stylePseudo(':hover', { backgroundColor: colorAlpha(pallete.primary, .5) })
)

const secondaryButtonStyle = style({
  color: pallete.message,
  whiteSpace: 'nowrap',
  fill: 'white',
  borderRadius: '30px',
  borderStyle: 'solid',
  alignSelf: 'flex-start',
  height: '48px',
  fontSize: '1.6rem',
  backgroundColor: pallete.background,
  padding: '0 24px',
  fontWeight: 'bold',
  border: '1px solid',
  borderColor: pallete.message
})

export const $defaultButtonSecondary = $defaultButtonCore(
  secondaryButtonStyle,
  stylePseudo(':hover', { borderColor: pallete.foreground, borderWidth: '1px' })
)

export const $defaultMiniButtonSecondary = $defaultButtonSecondary(
  style({ alignSelf: 'center', borderWidth: '1px', height: '28px', padding: '0 10px', fontSize: '1.2rem' })
)

export const $buttonAnchor = $element('a')(
  spacing.small,
  secondaryButtonStyle,
  stylePseudo(':hover', { color: 'inherit', boxShadow: 'none', borderColor: pallete.primary }),
  style({
    userSelect: 'none',
    alignItems: 'center',
    textDecoration: 'none',
    // padding: '6px 12px',
    display: 'flex',
    cursor: 'pointer',
    color: pallete.message
  })
)

export const $ButtonPrimary = (config: IButtonCore) => {
  return $ButtonCore({
    $container: $defaultButtonPrimary,
    ...config
  })
}

export const $ButtonSecondary = (config: IButtonCore) => {
  return $ButtonCore({
    $container: $defaultButtonSecondary,
    ...config
  })
}

export interface IButtonPrimaryCtx extends Omit<IButtonCore, '$container'> {
  txQuery: Stream<Promise<any>>
  alert?: Stream<string | null>
}

export const $Submit = (config: IButtonPrimaryCtx) =>
  component(
    (
      [click, clickTether]: IBehavior<PointerEvent, PointerEvent>,
      [changeWallet, changeWalletTether]: IBehavior<EIP6963ProviderDetail>
    ) => {
      const { alert = now(null), txQuery, disabled = now(false) } = config

      const isTxPending = recoverWith(
        () => now(false),
        map((s) => s.status === PromiseStatus.PENDING, promiseState(txQuery))
      )
      const isRequestPending = startWith(false, isTxPending)

      return [
        $ButtonCore({
          $container: $defaultButtonPrimary(
            style({
              position: 'relative',
              overflow: 'hidden'
            })
          ),
          disabled: combineArray((params) => {
            return params.alert !== null || params.disabled || params.isRequestPending
          }, combineState({ disabled, isRequestPending, alert })),
          $content: $row(
            $node(
              style({
                inset: 0,
                width: '200%',
                visibility: 'hidden',
                animation: 'borderRotate .75s linear infinite',
                position: 'absolute',
                background: `linear-gradient(115deg, ${pallete.negative}, ${pallete.primary}, ${pallete.positive}, ${pallete.primary}) 0% 0% / 50% 100%`
              }),
              styleInline(map((isDisabled) => ({ visibility: isDisabled ? 'visible' : 'hidden' }), isRequestPending))
            )(),
            $node(
              style({
                inset: '2px',
                position: 'absolute',
                visibility: 'hidden',
                background: colorAlpha(pallete.background, 0.9),
                borderRadius: '30px'
              }),
              styleInline(map((isDisabled) => ({ visibility: isDisabled ? 'visible' : 'hidden' }), isRequestPending))
            )(),
            style({ position: 'relative' })(config.$content)
          )
        })({
          click: clickTether()
        }),

        {
          click: multicast(click)
        }
      ]
    }
  )

interface IButtonCircular extends Control {
  $iconPath: I$Node<SVGPathElement>
}

export const $ButtonCircular = ({ $iconPath, disabled = empty() }: IButtonCircular) =>
  component(([click, clickTether]: IBehavior<INode, PointerEvent>) => {
    const ops = O(
      clickTether(nodeEvent('pointerup')),
      styleBehavior(map((isDisabled) => (isDisabled ? { opacity: 0.4, pointerEvents: 'none' } : null), disabled)),
      attrBehavior(
        map((d) => {
          return { disabled: d ? 'true' : null }
        }, disabled)
      )
    )

    return [
      ops($row(style({ cursor: 'pointer', padding: '6px', margin: '-6px' }))($iconCircular($iconPath))),

      {
        click
      }
    ]
  })
