import { constant, now, switchLatest } from '@most/core'
import type { Stream } from '@most/types'
import type { IBehavior, IOps } from 'aelea/core'
import {
  component,
  type I$Node,
  type INode,
  type INodeCompose,
  nodeEvent,
  style,
  switchMap,
  toStream
} from 'aelea/core'
import { $defaultSelectContainer } from './$Dropdown.js'

export interface ISelect<T> {
  list: readonly T[] | Stream<readonly T[]>

  $container?: INodeCompose
  $$option: IOps<T, I$Node>
}

export const $Select = <T>({ list, $$option, $container = $defaultSelectContainer }: ISelect<T>) =>
  component(([select, selectTether]: IBehavior<INode, T>) => {
    return [
      switchMap((_list) => {
        return $container(
          ..._list.map((item) => {
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
