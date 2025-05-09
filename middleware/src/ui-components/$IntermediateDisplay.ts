import {
  constant,
  empty,
  fromPromise,
  map,
  merge,
  mergeArray,
  multicast,
  now,
  recoverWith,
  startWith,
  switchLatest
} from '@most/core'
import type { Stream } from '@most/types'
import { $node, $text, component, type I$Node, type IOps, replayLatest, style } from 'aelea/core'
import { $row, layoutSheet, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Chain, TransactionReceipt } from 'viem'
import { $alert, $alertTooltip, $txHashRef } from './$common.js'

export const $spinner = $node(
  style({
    margin: 'auto',
    placeSelf: 'center',
    alignSelf: 'center'
  })
)($text('Loading...'))

export interface IIntermediatPromise<T> {
  query: Stream<Promise<T>>
  clean?: Stream<any>

  $$done: IOps<T, I$Node>
  $$fail?: IOps<Error, I$Node>

  $loader?: I$Node
}

export enum IIntermediateStatus {
  LOADING,
  DONE,
  ERROR
}

export interface IIntermediateState<T> {
  status: IIntermediateStatus.DONE | IIntermediateStatus.LOADING | IIntermediateStatus.ERROR
  data: T
}

export const $IntermediatePromise = <T>({
  $loader = $spinner,
  query,
  $$fail = map((res) => style({ placeSelf: 'center', margin: 'auto' })($alert($node($text(res.message))))),
  $$done,
  clean = empty()
}: IIntermediatPromise<T>) =>
  component(() => {
    const state: Stream<IIntermediateState<T | I$Node | Error>> = multicast(
      switchLatest(
        map((prom) => {
          const doneData: Stream<IIntermediateState<T>> = map(
            (data) => ({ status: IIntermediateStatus.DONE, data }),
            fromPromise(prom)
          )
          const loading: Stream<IIntermediateState<I$Node>> = now({
            status: IIntermediateStatus.LOADING,
            data: $loader
          })
          const settledOrError = recoverWith(
            (error) => now({ status: IIntermediateStatus.ERROR, data: error } as IIntermediateState<Error>),
            doneData
          )

          return merge(settledOrError, loading)
        }, query)
      )
    )

    return [
      switchLatest(
        mergeArray([
          switchLatest(
            map((state) => {
              if (state.status === IIntermediateStatus.LOADING) {
                return now($loader)
              }

              if (state.status === IIntermediateStatus.ERROR) {
                return $$fail(now(state.data))
              }

              return $$done(now(state.data))
            }, state)
          ),
          constant(empty(), clean)
        ])
      ),

      { state }
    ]
  })

type IIntermediateTx<TSuccess extends TransactionReceipt> = {
  $$success?: IOps<TSuccess, I$Node>
  chain: Chain
  query: Stream<Promise<TSuccess>>
  clean?: Stream<any>
  showTooltip?: boolean
}

export const $IntermediateTx = <TSuccess extends TransactionReceipt>({
  query,
  chain,
  clean = empty(),
  $$success = constant($node(style({ color: pallete.positive }))($text('Transaction confirmed'))),
  showTooltip = false
}: IIntermediateTx<TSuccess>) => {
  const multicastQuery = replayLatest(multicast(query))

  return $IntermediatePromise<TSuccess>({
    clean,
    query: map(async (x) => {
      return x
    }, multicastQuery),
    $$done: map((res) => {
      return $row(spacing.small, style({ color: pallete.positive }))(
        switchLatest($$success(now(res))),
        $txHashRef(res.transactionHash, chain)
      )
    }),
    $loader: switchLatest(
      map((c) => {
        return $row(spacing.small, style({ alignItems: 'center', fontSize: '.85rem' }))(
          $spinner,
          $text(
            startWith(
              'Wallet Request...',
              map(() => 'Awaiting confirmation...', fromPromise(c))
            )
          ),
          $node(style({ flex: 1 }))(),
          switchLatest(map((txHash) => $txHashRef(txHash.transactionHash, chain), fromPromise(c)))
        )
      }, multicastQuery)
    ),
    $$fail: map((res) => {
      const error = String(res)

      return showTooltip ? $alertTooltip($node($text(error))) : $alert($node($text(error)))
    })
  })
}
