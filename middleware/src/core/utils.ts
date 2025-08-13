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

export function groupManyListMap<const T extends readonly any[], K extends keyof T[number], R>(
  list: T,
  key: K,
  mapFn: (item: T[number], keyValue: T[number][K] & PropertyKey, index: number) => R
): { [P in T[number][K] & PropertyKey]: R[] } {
  const gmap = {} as { [P in T[number][K] & PropertyKey]: R[] }

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const keyValue = item[key]

    if (keyValue === undefined) {
      throw new Error(`Key "${String(key)}" is undefined for item at index ${i}`)
    }

    const propertyKey = keyValue as T[number][K] & PropertyKey
    gmap[propertyKey] ??= []
    const mappedValue = mapFn(item, propertyKey, i)
    gmap[propertyKey].push(mappedValue)
  }

  return gmap
}

export function groupManyList<const T extends readonly any[], K extends keyof T[number]>(
  list: T,
  key: K
): { [P in T[number][K] & PropertyKey]: Extract<T[number], { [Q in K]: P }>[] } {
  const gmap = {} as { [P in T[number][K] & PropertyKey]: Extract<T[number], { [Q in K]: P }>[] }

  for (const item of list) {
    const keyValue = item[key] as T[number][K] & PropertyKey
    if (keyValue === undefined) {
      throw new Error(`Key "${String(key)}" is undefined`)
    }

    gmap[keyValue] ??= []
    gmap[keyValue].push(item as any)
  }

  return gmap
}

export function groupList<const T extends readonly any[], K extends keyof T[number]>(
  list: T,
  key: K
): { [P in T[number][K] & PropertyKey]: Extract<T[number], { [Q in K]: P }> } {
  const result = {} as any
  for (const item of list) {
    const keyValue = item[key]
    if (keyValue in result) {
      throw new Error(`Duplicate key "${String(keyValue)}" found when grouping by "${String(key)}"`)
    }
    result[keyValue] = item
  }
  return result
}

export function groupListMap<
  const T extends readonly any[],
  K extends keyof T[number],
  const V extends T[number][K] & PropertyKey,
  R
>(
  list: T,
  key: K,
  mapFn: (item: Extract<T[number], { [Q in K]: V }>, keyValue: V, index: number) => R
): { [P in T[number][K] & PropertyKey]: R } {
  const result = {} as any

  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const keyValue = item[key]

    if (keyValue === undefined) throw new Error(`Key "${String(key)}" is undefined for item at index ${i}`)
    if (keyValue in result) {
      throw new Error(`Duplicate key "${String(keyValue)}" found when grouping by "${String(key)}"`)
    }

    result[keyValue] = mapFn(item as any, keyValue as any, i)
  }

  return result
}

export function getMappedValue<TMap extends object, TKey extends keyof TMap, TFallback = never>(
  map: TMap,
  prop: unknown,
  fallbackValue?: TFallback
): TFallback extends never ? TMap[TKey] : TMap[TKey] | TFallback {
  // Check if prop is a valid key type and exists in map
  if (prop != null && (prop as any) in map) return map[prop as TKey] as any

  // Return fallback value if provided
  if (fallbackValue !== undefined) return fallbackValue as any

  throw new Error(`Property '${String(prop)}' does not exist in object and no fallback provided`)
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
