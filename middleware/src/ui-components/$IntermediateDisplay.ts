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
import {
  $node,
  $text,
  component,
  type Fn,
  type I$Node,
  type IOp,
  type IOps,
  replayLatest,
  style,
  switchMap
} from 'aelea/core'
import { $row, layoutSheet, spacing } from 'aelea/ui-components'
import { pallete } from 'aelea/ui-components-theme'
import type { Chain, TransactionReceipt } from 'viem'
import { type PromiseStateError, PromiseStatus, promiseState } from '../utils/stream.js'
import { $alert, $alertTooltip, $txHashRef } from './$common.js'

export const $spinner = $node(
  style({
    margin: 'auto',
    placeSelf: 'center',
    alignSelf: 'center'
  })
)($text('Loading...'))

export interface I$IntermediatPromise<T> {
  clean?: Stream<any>

  $$display: Stream<Promise<I$Node>>
  $$fail?: Fn<Error, I$Node>

  $loader?: I$Node
}

export const $intermediatePromise = <T>({
  $loader = $spinner,
  $$fail = (res) => style({ placeSelf: 'center', margin: 'auto' })($alert($node($text(res.message)))),
  $$display
}: I$IntermediatPromise<T>) =>
  switchMap((state) => {
    if (state.status === PromiseStatus.PENDING) {
      return $loader
    }

    if (state.status === PromiseStatus.ERROR) {
      return $$fail(state.error)
    }

    return state.value

    // const doneData: Stream<IIntermediateState<T>> = map(
    //   (data) => ({ status: IIntermediateStatus.DONE, data }),
    //   fromPromise(prom)
    // )
    // const loading: Stream<IIntermediateState<I$Node>> = now({
    //   status: IIntermediateStatus.LOADING,
    //   data: $loader
    // })
    // const settledOrError = recoverWith(
    //   (error) => now({ status: IIntermediateStatus.ERROR, data: error } as IIntermediateState<Error>),
    //   doneData
    // )

    // return merge(settledOrError, loading)
  }, promiseState($$display))

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

  return $intermediatePromise<TSuccess>({
    clean,
    $$display: map(async (query) => {
      const res = await query

      return $row(spacing.small, style({ color: pallete.positive }))(
        switchLatest($$success(now(res))),
        $txHashRef(res.transactionHash, chain)
      )
    }, multicastQuery),
    $loader: switchLatest(
      map((c) => {
        return $row(spacing.small, style({ alignItems: 'center', fontSize: '1.2rem' }))(
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
    $$fail: (res) => {
      const error = String(res)

      return showTooltip ? $alertTooltip($node($text(error))) : $alert($node($text(error)))
    }
  })
}
