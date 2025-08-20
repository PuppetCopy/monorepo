import type { Address } from 'abitype'
import type { IStream } from 'aelea/stream'

export type InferStream<T> = T extends IStream<infer U> ? U : T

export interface IRequestPagePositionApi {
  offset: number
  pageSize: number
}

export interface IResponsePageApi<T> extends IRequestPagePositionApi {
  page: T[]
}

export interface IRequestSortApi {
  selector: string
  direction: 'desc' | 'asc'
}

export type IOpstional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type Nullable<T> = {
  [P in keyof T]: T[P] | null
}
export type NonNullableStruct<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

export interface IMarketDescription {
  marketToken: Address
  indexToken: Address
  longToken: Address
  shortToken: Address
}

export interface ITokenDescription {
  name: string
  symbol: string
  baseSymbol?: string
  decimals: number
  address: Address
}
