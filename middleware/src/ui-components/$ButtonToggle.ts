import {
  $node,
  $text,
  component,
  type I$Node,
  type INode,
  type INodeCompose,
  nodeEvent,
  style,
  styleBehavior
} from 'aelea/core'
import { constant, type IBehavior, type IOps, type IStream, map, now, switchLatest } from 'aelea/stream'
import { $row } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'

export interface IButtonToggle<T> {
  optionList: T[]
  value: IStream<T>

  $container?: INodeCompose
  $button?: INodeCompose
  $$option?: IOps<T, I$Node>
}

export const $defaulButtonToggleBtn = $row(
  style({
    placeContent: 'center',
    // fontWeight: 'bold',
    flex: 1,
    borderRadius: '20px',
    padding: '12px 18px',
    alignItems: 'center',
    border: '1px solid transparent',
    cursor: 'pointer',
    margin: '-2px',
    textAlign: 'center'
  })
)

export const $defaulButtonToggleContainer = $node(
  style({
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'minmax(50px, 1fr)',
    borderRadius: '20px',
    border: `1px solid ${colorAlpha(pallete.foreground, 0.2)}`,
    backgroundColor: pallete.background
  })
)

export const $ButtonToggle = <T>({
  optionList,
  value,
  $$option = map(<T>(o: T) => $node($text(String(o)))),
  $button = $defaulButtonToggleBtn,
  $container = $defaulButtonToggleContainer
}: IButtonToggle<T>) =>
  component(([select, sampleSelect]: IBehavior<INode, T>) => {
    return [
      $container(
        ...optionList.map(opt =>
          $button(
            sampleSelect(nodeEvent('click'), constant(opt)),
            styleBehavior(
              map(selectedOpt => {
                return selectedOpt === opt
                  ? { boxShadow: `0px 0px 0 2px ${pallete.primary} inset`, pointerEvents: 'none' }
                  : { color: pallete.foreground }
              }, value)
            )
          )(switchLatest($$option(now(opt))))
        )
      ),

      { select }
    ]
  })
