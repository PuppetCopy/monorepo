import {
  constant,
  empty,
  type Fn,
  fromPromise,
  type IOps,
  type IStream,
  just,
  map,
  start,
  switchLatest,
  switchMap
} from 'aelea/stream'
import { multicast, PromiseStatus, promiseState } from 'aelea/stream-extended'
import { $node, $text, type I$Node, style } from 'aelea/ui'
import { $row, spacing } from 'aelea/ui-components'
import { colorAlpha, pallete } from 'aelea/ui-components-theme'
import type { Chain, TransactionReceipt } from 'viem'
import { $alert, $alertTooltip, $txHashRef } from './$common.js'

export const $spinner = $node(
  style({
    margin: 'auto',
    placeSelf: 'center',
    alignSelf: 'center',
    animation: 'rotate 0.55s linear infinite',
    borderStyle: 'dotted',
    borderWidth: '2px',
    borderColor: `${colorAlpha(pallete.foreground, 0.5)} transparent ${colorAlpha(pallete.foreground, 0.5)} transparent`,
    borderRadius: '50%',
    aspectRatio: '1 / 1',
    minHeight: '40px',
    minWidth: '40px',
    height: '40px',
    boxSizing: 'border-box',
    display: 'inline-block',
    transformOrigin: '50% 50%',
    lineHeight: 0,
    flexShrink: 0
  })
)()

export interface I$IntermediatPromise<_T> {
  clean?: IStream<any>
  $display: IStream<Promise<I$Node>>
  $$fail?: Fn<Error, I$Node>

  $loader?: I$Node
}

export const $intermediatePromise = <T>({
  $loader = $spinner,
  $$fail = res => {
    const message =
      typeof res === 'string'
        ? res
        : (res as any)?.message
          ? String((res as any).message)
          : (() => {
              try {
                return JSON.stringify(res)
              } catch {
                return 'Unknown error'
              }
            })()

    return style({ placeSelf: 'center', margin: 'auto' })($alertTooltip($text(message)))
  },
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
  const multicastQuery = multicast(query)

  return $intermediatePromise<TSuccess>({
    clean,
    $display: map(async query => {
      const res = await query

      return $row(spacing.small, style({ color: pallete.positive }))(
        switchLatest($$success(just(res))),
        $txHashRef(res.transactionHash, chain)
      )
    }, multicastQuery),
    $loader: switchLatest(
      map(c => {
        return $row(spacing.small, style({ alignItems: 'center', fontSize: '.8rem' }))(
          $spinner,
          $text(
            start(
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
