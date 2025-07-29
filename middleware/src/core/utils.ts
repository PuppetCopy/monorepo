import type { Address } from 'viem/accounts'
import { timespanPassedSinceInvoke } from './date.js'
import type { IRequestPagePositionApi, IRequestSortApi, IResponsePageApi } from './types.js'

export const ETH_ADDRESS_REGEXP = /^0x[a-fA-F0-9]{40}$/i
export const TX_HASH_REGEX = /^0x([A-Fa-f0-9]{64})$/i

export function getTokenAmount(price: bigint, amountUsd: bigint) {
  return price ? amountUsd / price : 0n
}

export function isAddress(address: any): address is Address {
  return ETH_ADDRESS_REGEXP.test(address)
}

function defaultComperator(queryParams: IRequestSortApi) {
  return (a: any, b: any) =>
    queryParams.direction === 'desc'
      ? Number(b[queryParams.selector]) - Number(a[queryParams.selector])
      : Number(a[queryParams.selector]) - Number(b[queryParams.selector])
}

export type IPagingQueryParams = (IRequestPagePositionApi & IRequestSortApi) | IRequestPagePositionApi

export function pagingQuery<T, TParams extends IPagingQueryParams>(
  queryParams: TParams,
  res: T[],
  customComperator?: (a: T, b: T) => number
): IResponsePageApi<T> {
  let list = res
  if ('selector' in queryParams) {
    list = res.sort(customComperator ? customComperator : defaultComperator(queryParams))
  }

  const page = list.slice(queryParams.offset, queryParams.offset + queryParams.pageSize)
  return { ...queryParams, page }
}

interface ICacheItem<T> {
  item: Promise<T>
  lifespanFn: () => boolean
}

export const cacheMap =
  (cacheMap: { [k: string]: ICacheItem<any> }) =>
  <T>(key: string, lifespan: number, cacheFn: () => Promise<T>): Promise<T> => {
    const cacheEntry = cacheMap[key]

    if (cacheEntry && !cacheMap[key].lifespanFn()) {
      return cacheEntry.item
    }
    const lifespanFn = cacheMap[key]?.lifespanFn ?? timespanPassedSinceInvoke(lifespan)
    const newLocal = { item: cacheFn(), lifespanFn }
    cacheMap[key] = newLocal
    return cacheMap[key].item
  }

export function groupArrayManyMap<A, B extends string | symbol | number, R>(
  list: readonly A[],
  getKey: (v: A) => B,
  mapFn: (v: A, key: B) => R
): Record<B, R[]> {
  const gmap = {} as { [P in B]: R[] }

  list.forEach((item) => {
    const key = getKey(item)

    if (key === undefined) {
      throw new Error('key is undefined')
    }

    gmap[key] ??= []
    const mappedValue = mapFn(item, key)
    gmap[key].push(mappedValue)
  })

  return gmap
}

export function groupArrayMany<A, B extends string | symbol | number>(
  list: readonly A[],
  getKey: (v: A) => B
): Record<B, A[]> {
  return groupArrayManyMap(list, getKey, (x) => x)
}

export function groupArrayByKey<A, B extends string | symbol | number>(
  list: readonly A[],
  getKey: (v: A) => B
): Record<B, A> {
  return groupArrayByKeyMap(list, getKey, (x) => x)
}

export function groupArrayByKeyMap<A, B extends string | symbol | number, R>(
  list: readonly A[],
  getKey: (v: A) => B,
  mapFn: (v: A, key: B, seed: number) => R
) {
  const gmap = {} as { [P in B]: R }

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const key = getKey(item)

    if (key === undefined) {
      throw new Error('key is undefined')
    }

    gmap[key] = mapFn(item, key, i)
  }

  return gmap
}

export function getSafeMappedValue<T extends object>(contractMap: T, prop: any, fallbackProp: keyof T): T[keyof T] {
  return prop in contractMap ? contractMap[prop as keyof T] : contractMap[fallbackProp]
}

export function getMappedValue<TMap extends object, TMapkey extends keyof TMap>(
  contractMap: TMap,
  prop: unknown
): TMap[TMapkey] {
  if (contractMap[prop as TMapkey]) {
    return contractMap[prop as TMapkey]
  }

  throw new Error(`prop ${String(prop)} does not exist in object`)
}

export function easeInExpo(x: number) {
  return x === 0 ? 0 : 2 ** (10 * x - 10)
}

export function getClosestNumber<T extends readonly number[]>(arr: T, chosen: number): T[number] {
  return arr.reduce((a, b) => (b - chosen < chosen - a ? b : a))
}

export function lst<T>(a: readonly T[]): T {
  if (a.length === 0) throw new Error('empty array')
  return a[a.length - 1]
}
