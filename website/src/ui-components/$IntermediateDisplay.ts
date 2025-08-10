import {
  constant,
  empty,
  type Fn,
  fromPromise,
  type IOps,
  type IStream,
  map,
  multicast,
  now,
  replayLatest,
  startWith,
  switchLatest,
  switchMap
} from 'aelea/stream'
import { PromiseStatus, promiseState } from 'aelea/stream-extended'
import { $node, $text, type I$Node, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
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

export interface I$IntermediatPromise<_T> {
  clean?: IStream<any>
  $display: IStream<Promise<I$Node>>
  $$fail?: Fn<Error, I$Node>

  $loader?: I$Node
}

export const $intermediatePromise = <T>({
  $loader = $spinner,
  $$fail = res => style({ placeSelf: 'center', margin: 'auto' })($alert($node($text(res.message)))),
  $display
}: I$IntermediatPromise<T>) =>
  switchMap(state => {
    if (state.status === PromiseStatus.PENDING) {
      return $loader
    }

    if (state.status === PromiseStatus.ERROR) {
      return $$fail(state.error)
    }

    return state.value
  }, promiseState($display))

type IIntermediateTx<TSuccess extends TransactionReceipt> = {
  $$success?: IOps<TSuccess, I$Node>
  chain: Chain
  query: IStream<Promise<TSuccess>>
  clean?: IStream<any>
  showTooltip?: boolean
}

export const $IntermediateTx = <TSuccess extends TransactionReceipt>({
  query,
  chain,
  clean = empty,
  $$success = constant($node(style({ color: pallete.positive }))($text('Transaction confirmed'))),
  showTooltip = false
}: IIntermediateTx<TSuccess>) => {
  const multicastQuery = replayLatest(multicast(query))

  return $intermediatePromise<TSuccess>({
    clean,
    $display: map(async query => {
      const res = await query

      return $row(spacing.small, style({ color: pallete.positive }))(
        switchLatest($$success(now(res))),
        $txHashRef(res.transactionHash, chain)
      )
    }, multicastQuery),
    $loader: switchLatest(
      map(c => {
        return $row(spacing.small, style({ alignItems: 'center', fontSize: '.8rem' }))(
          $spinner,
          $text(
            startWith(
              'Wallet Request...',
              map(() => 'Awaiting confirmation...', fromPromise(c))
            )
          ),
          $node(style({ flex: 1 }))(),
          switchLatest(map(txHash => $txHashRef(txHash.transactionHash, chain), fromPromise(c)))
        )
      }, multicastQuery)
    ),
    $$fail: res => {
      const error = String(res)

      return showTooltip ? $alertTooltip($node($text(error))) : $alert($node($text(error)))
    }
  })
}
