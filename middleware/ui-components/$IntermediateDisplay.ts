import { Op, replayLatest } from "@aelea/core"
import { $Node, $node, $text, component, style } from "@aelea/dom"
import { $row, layoutSheet } from "@aelea/ui-components"
import { pallete } from "@aelea/ui-components-theme"
import { constant, empty, fromPromise, map, merge, mergeArray, multicast, now, recoverWith, startWith, switchLatest } from "@most/core"
import { Stream } from "@most/types"
import { Abi } from "abitype"
import { Chain, TransactionReceipt } from "viem"
import { $alert, $alertTooltip, $txHashRef, } from "./$common.js"



export const $spinner = $node(style({
  margin: 'auto',
  placeSelf: 'center',
  alignSelf: 'center',
}))(
  $text('Loading...')
)


export interface IIntermediatPromise<T> {
  query: Stream<Promise<T>>
  clean?: Stream<any>

  $$done: Op<T, $Node>
  $$fail?: Op<Error, $Node>

  $loader?: $Node
}

export enum IIntermediateStatus {
  LOADING,
  DONE,
  ERROR,
}

export interface IIntermediateState<T> {
  status: IIntermediateStatus.DONE | IIntermediateStatus.LOADING | IIntermediateStatus.ERROR
  data: T
}


export const $IntermediatePromise = <T>({
  $loader = $spinner,
  query,
  $$fail = map(res => style({ placeSelf: 'center', margin: 'auto' })($alert($text(res.message)))),
  $$done,
  clean = empty()
}: IIntermediatPromise<T>) => component(() => {
  const state: Stream<IIntermediateState<T | $Node | Error>> = multicast(switchLatest(map(prom => {
    const doneData: Stream<IIntermediateState<T>> = map(data => ({ status: IIntermediateStatus.DONE, data }), fromPromise(prom))
    const loading: Stream<IIntermediateState<$Node>> = now({ status: IIntermediateStatus.LOADING, data: $loader })
    const settledOrError = recoverWith(error => now({ status: IIntermediateStatus.ERROR, data: error } as IIntermediateState<Error>), doneData)

    return merge(settledOrError, loading)
  }, query)))

  return [
    switchLatest(mergeArray([
      switchLatest(map(state => {

        if (state.status === IIntermediateStatus.LOADING) {
          return now($loader)
        }

        if (state.status === IIntermediateStatus.ERROR) {
          return $$fail(now(state.data))
        }

        return $$done(now(state.data))
      }, state)),
      constant(empty(), clean)
    ])),

    { state }
  ]
})


type IIntermediateTx<
  TAbi extends Abi,
  TFunctionName extends string,
  TChain extends Chain,
  TChainOverride extends Chain,
  TSuccess extends TransactionReceipt,
> = {
  $$success?: Op<TSuccess, $Node>
  chain: Chain
  query: Stream<Promise<TSuccess>>
  clean?: Stream<any>
  showTooltip?: boolean
}

export const $IntermediateTx = <
  TAbi extends Abi,
  TFunctionName extends string,
  TChain extends Chain,
  TChainOverride extends Chain,
  TSuccess extends TransactionReceipt,
>({
  query,
  chain,
  clean = empty(),
  $$success = constant($text(style({ color: pallete.positive }))('Tx Succeeded')),
  showTooltip = false
}: IIntermediateTx<TAbi, TFunctionName, TChain, TChainOverride, TSuccess>) => {

  const multicastQuery = replayLatest(multicast(query))

  return $IntermediatePromise<TSuccess>({
    clean,
    query: map(async x => {
      return x
    }, multicastQuery),
    $$done: map((res) => {
      return $row(layoutSheet.spacingSmall, style({ color: pallete.positive }))(
        switchLatest($$success(now(res))),
        $txHashRef(res.transactionHash, chain)
      )
    }),
    $loader: switchLatest(map(c => {

      return $row(layoutSheet.spacingSmall, style({ alignItems: 'center', fontSize: '.85rem' }))(
        $spinner,
        $text(startWith('Wallet Request...', map(() => 'Awaiting confirmation...', fromPromise(c)))),
        $node(style({ flex: 1 }))(),
        switchLatest(map(txHash => $txHashRef(txHash.transactionHash, chain), fromPromise(c)))
      )
    }, multicastQuery)),
    $$fail: map(res => {
      const error = String(res)

      return showTooltip ? $alertTooltip($text(error)) : $alert($text(error))
    }),
  })
}

