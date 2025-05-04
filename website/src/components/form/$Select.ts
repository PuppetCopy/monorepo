import { Op, Behavior } from "aelea/core"
import { NodeComposeFn, $Node, component, IBranch, nodeEvent, style } from "aelea/dom"
import { constant, switchLatest, now } from "@most/core"
import { Stream } from "@most/types"
import { $defaultSelectContainer } from "./$Dropdown.js"
import { streamOf, switchMap } from "@puppet/middleware/utils"

export interface ISelect<T> {
  list: T[] | Stream<T[]>
  value: Stream<T>;

  $container?: NodeComposeFn<$Node>
  $$option: Op<T, $Node>
}


export const $Select = <T>({ 
  list,
  $$option,
  $container = $defaultSelectContainer
 }: ISelect<T>) => component((
  [select, selectTether]: Behavior<IBranch, T>
) => {

  return [
    switchMap(_list => {
      return $container(
        ..._list.map(item => {

          const selectBehavior = selectTether(
            nodeEvent('click'),
            constant(item)
          )

          const $opt = style({ cursor: 'pointer' })(
            switchLatest(
              $$option(now(item))
            )
          )

          return selectBehavior($opt)
        })
      )
    }, streamOf(list)),

    {
      select
    }
  ]
})
