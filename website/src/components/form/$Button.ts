import { PromiseStatus, promiseState } from '@puppet-copy/middleware/core'
import {
  $node,
  attrBehavior,
  component,
  type I$Node,
  type INode,
  type INodeCompose,
  nodeEvent,
  style,
  styleBehavior,
  styleInline,
  stylePseudo
} from 'aelea/core'
import { combine, empty, type IBehavior, type IStream, map, multicast, now, startWith } from 'aelea/stream'
import { $row, type Control } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { EIP6963ProviderDetail } from 'mipd'
import { $icon } from '@/ui-components'
import { $ButtonCore, $defaultButtonCore, type IButtonCore } from './$ButtonCore.js'

export const $defaultButtonPrimary = $defaultButtonCore(
  style({
    color: pallete.message,
    whiteSpace: 'nowrap',
    fill: 'white',
    borderRadius: '30px',
    alignSelf: 'flex-end',
    fontSize: '1rem',

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
  fontSize: '1rem',
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
  style({ alignSelf: 'center', borderWidth: '1px', height: '28px', padding: '0 10px', fontSize: '.8rem' })
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
  txQuery: IStream<Promise<any>>
  alert?: IStream<string | null>
}

export const $Submit = (config: IButtonPrimaryCtx) =>
  component(
    (
      [click, clickTether]: IBehavior<PointerEvent, PointerEvent>,
      [_changeWallet, _changeWalletTether]: IBehavior<EIP6963ProviderDetail>
    ) => {
      const { alert = now(null), txQuery, disabled = now(false) } = config

      const isTxPending = map(s => s.status === PromiseStatus.PENDING, promiseState(txQuery))
      const isRequestPending = startWith(false, isTxPending)

      return [
        $ButtonCore({
          $container: $defaultButtonPrimary(
            style({
              position: 'relative',
              overflow: 'hidden'
            })
          ),
          disabled: map(params => {
            return params.alert !== null || params.disabled || params.isRequestPending
          }, combine({ disabled, isRequestPending, alert })),
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
              styleInline(map(isDisabled => ({ visibility: isDisabled ? 'visible' : 'hidden' }), isRequestPending))
            )(),
            $node(
              style({
                inset: '2px',
                position: 'absolute',
                visibility: 'hidden',
                background: colorAlpha(pallete.background, 0.9),
                borderRadius: '30px'
              }),
              styleInline(map(isDisabled => ({ visibility: isDisabled ? 'visible' : 'hidden' }), isRequestPending))
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
  $container?: INodeCompose
}

export const $defaultButtonCircularContainer = $row(
  style({
    cursor: 'pointer',
    padding: '6px',
    margin: '-6px',
    borderRadius: '50%',
    border: `1px solid ${colorAlpha(pallete.foreground, 0.25)}`,
    width: '32px',
    aspectRatio: '1 / 1',
    height: 'auto',
    fontSize: '11px',
    textAlign: 'center',
    lineHeight: '15px',
    fontWeight: 'bold',
    color: pallete.message
  })
)

export const $ButtonCircular = ({
  $iconPath,
  disabled = empty,
  $container = $defaultButtonCircularContainer
}: IButtonCircular) =>
  component(([click, clickTether]: IBehavior<INode, PointerEvent>) => {
    return [
      $container(
        clickTether(nodeEvent('pointerup')),
        styleBehavior(map(isDisabled => (isDisabled ? { opacity: 0.4, pointerEvents: 'none' } : null), disabled)),
        attrBehavior(
          map(d => {
            return { disabled: d ? 'true' : null }
          }, disabled)
        )
      )(
        $icon({
          $content: $iconPath,
          viewBox: '0 0 32 32'
        })
      ),
      {
        click
      }
    ]
  })
