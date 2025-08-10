import { constant, type IOps, type IStream, now, switchLatest, switchMap, toStream } from 'aelea/stream'
import type { IBehavior } from 'aelea/stream-extended'
import { component, type I$Node, type INode, type INodeCompose, nodeEvent, style } from 'aelea/ui'
import { $defaultSelectContainer } from './$Dropdown.js'

export interface ISelect<T> {
  list: readonly T[] | IStream<readonly T[]>

  $container?: INodeCompose
  $$option: IOps<T, I$Node>
}

export const $Select = <T>({ list, $$option, $container = $defaultSelectContainer }: ISelect<T>) =>
  component(([select, selectTether]: IBehavior<INode, T>) => {
    return [
      switchMap(_list => {
        return $container(
          ..._list.map(item => {
            const selectBehavior = selectTether(nodeEvent('click'), constant(item))

            const $opt = style({ cursor: 'pointer' })(switchLatest($$option(now(item))))

            return selectBehavior($opt)
          })
        )
      }, toStream(list)),

      {
        select
      }
    ]
  })
