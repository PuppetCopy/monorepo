import { constant, now, switchLatest } from '@most/core'
import type { Stream } from '@most/types'
import { streamOf, switchMap } from '@puppet/middleware/utils'
import type { IBehavior, Op } from 'aelea/core'
import { component, type I$Node, type IBranch, type INodeCompose, nodeEvent, style } from 'aelea/core'
import { $defaultSelectContainer } from './$Dropdown.js'

export interface ISelect<T> {
  list: T[] | Stream<T[]>
  value: Stream<T>

  $container?: INodeCompose<I$Node>
  $$option: Op<T, $Node>
}

export const $Select = <T>({ list, $$option, $container = $defaultSelectContainer }: ISelect<T>) =>
  component(([select, selectTether]: IBehavior<IBranch, T>) => {
    return [
      switchMap((_list) => {
        return $container(
          ..._list.map((item) => {
            const selectBehavior = selectTether(nodeEvent('click'), constant(item))

            const $opt = style({ cursor: 'pointer' })(switchLatest($$option(now(item))))

            return selectBehavior($opt)
          })
        )
      }, streamOf(list)),

      {
        select
      }
    ]
  })
