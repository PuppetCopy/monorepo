import { getAddress } from 'viem'
import { getMappedValue } from '../../utils/index.js';

export type GqlType<T extends string> = { __typename: T }

type PackedAbiType =
  | 'string'
  | 'string[]'
  | 'bytes'
  | 'bytes[]'
  | 'number'
  | 'number[]'
  | 'bigint'
  | 'bigint[]'
  | 'address'
  | 'address[]'
  | 'bool'
  | 'bool[]'

type ISchemaField<T> = T extends GqlType<any>
  ? ISchema<T>
  : T extends any[]
  ? any
  : PackedAbiType;

export type ISchema<T extends GqlType<any>> = {
  [P in keyof T as P extends '__typename' ? never : P]?: ISchemaField<T[P]>;
} & { __typename: T['__typename']; }

export type ISchemaQuery<TSchema, TQuery> = {
  [P in keyof TQuery]: TQuery[P] extends any[]
  ? P extends keyof TSchema ? ISchemaQuery<TSchema[P], TQuery[P]> : never : TQuery[P] extends object
  ? P extends keyof TSchema ? ISchemaQuery<TSchema[P], TQuery[P]> : never : P extends keyof TSchema
  ? TSchema[P] : never
}

export type PrettifyT<T> = {
  [K in keyof T]: T[K];
} & {};


export type IQueryFilterCoercion<T> = {
  _and?: IQueryFilter<T> | IQueryFilter<T>[]
  _or?: IQueryFilter<T> | IQueryFilter<T>[]
  _not?: IQueryFilter<T> | IQueryFilter<T>[]
}

export type IQueryFilter<T> = IQueryFilterCoercion<T> & {
  [K in keyof T]?: {
    _eq?: string | number | boolean
    _gt?: string | number | boolean
    _gte?: string | number | boolean
    _lt?: string | number | boolean
    _lte?: string | number | boolean
    _regexp?: string
  }
} & {
  [K in keyof T as T[K] extends { id: any } ? `${K & string}_id` : never]?: {
    _eq?: string | number | boolean
    _gt?: string | number | boolean
    _gte?: string | number | boolean
    _lt?: string | number | boolean
    _lte?: string | number | boolean
    _regexp?: string
  }
}

export type IQueryOrderBy<T> = {
  [K in keyof T]?: 'asc' | 'asc_nulls_first' | 'asc_nulls_last' | 'desc' | 'desc_nulls_first' | 'desc_nulls_last'
}


export interface IQuerySubgraph<
  Type extends GqlType<any>,
  TQueryFilter extends IQueryFilter<Type>,
  TQuery
> {
  schema: ISchema<Type>
  document?: TQuery | undefined
  filter?: TQueryFilter
  startBlock?: bigint

  limit?: number
  skip?: number
  sortBy?: IQueryOrderBy<Type>
}


// export const querySubgraph = <
//   Type extends GqlType<any>,
//   TQueryFilter extends IQueryFilter<Type>,
//   TQuery
// >(
//   client: Client,
//   params: IQuerySubgraph<Type, TQueryFilter, TQuery>,
//   context?: Partial<OperationContext>,
// ): Promise<TQuery extends unknown ? Type[] : PrettifyT<ISchemaQuery<Type, TQuery>>[]> => {
//   const typename = params.schema.__typename
//   if (typename === undefined) {
//     throw new Error('No __typename in schema')
//   }

//   const whereClause = params.filter ? parseFilterObject({ where: params.filter }) : ''
//   const orderByFilterParam = params.sortBy ? parseFilterObject({ orderBy: params.sortBy }) : ''
//   const fieldStructure = parseQueryObject(params.document ? params.document : fillQuery(params.schema))
//   const limit = params.limit ? `limit: ${params.limit},` : ''
//   const filter = whereClause ? `(${limit}, ${orderByFilterParam} ${whereClause})` : ''

//   const entry = `${typename}${filter} { ${fieldStructure} }`

//   const newLogsFilter = client.query(`{ ${entry} }`, {}, context)
//     .then(response => {
//       if (response.error) throw new Error(`${typename} query error: ${response.error.message}`)

//       if (!(typename as string in response.data)) {
//         throw new Error(`No ${typename} found in subgraph response`)
//       }

//       const list: PrettifyT<ISchemaQuery<Type, TQuery>>[] = response.data[typename]

//       if (list instanceof Array) {
//         return list.map(item => parseQueryResults(item, params.schema))
//       }

//       throw new Error(`No ${typename} found in subgraph response`)
//     })

//   return newLogsFilter as any
// }

// recursively parse a json object to query result
export function parseQueryResults(json: any, schema: any) {
  const entity: any = {}
  Object.entries(json).forEach(([key, value]) => {
    const schemaType = schema[key]

    if (schemaType in abiParamParseMap) {
      const parseFn = getMappedValue(abiParamParseMap, schemaType)

      entity[key] = parseFn(value)
    } else if (value instanceof Array) {
      entity[key] = value.map((item) => parseQueryResults(item, schemaType))
    } else if (value instanceof Object) {
      entity[key] = parseQueryResults(value, schemaType)
    } else {
      entity[key] = value
    }

  })
  return entity
}

function parseFilterObject(query: any) {
  if (query === undefined) return ''

  const fields: string[] = []
  Object.entries(query).forEach(([key, value]) => {

    if (value instanceof Array) {
      if (value.length === 0) return
      fields.push(`${key}: [${value.map(arrVal => `{${parseFilterObject(arrVal)}}`).join(' ')}]`)
    } else if (value instanceof Object) {
      fields.push(`${key}: { ${parseFilterObject(value)} }`)
    } else if (value !== undefined) {
      fields.push(`${key}: ${value}`)
    }

  })
  return fields.join(' ')
}

function parseQueryObject(query: any) {
  const fields: string[] = []
  Object.entries(query).forEach(([key, value]) => {

    if (value instanceof Object) {
      fields.push(`${key} { ${parseQueryObject(value)} }`)
    } else {
      fields.push(key)
    }

  })
  return fields.join(' ')
}



function fillQuery(obj: any) {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key]
    acc[key] = value instanceof Object ? fillQuery(value) : null
    return acc
  }, {} as any)
}


export const abiParamParseMap = {
  bigint: BigInt,
  'bigint[]': (x: string[]) => x.map(BigInt),
  string: String,
  'string[]': (x: string[]) => x.map(String),
  number: Number,
  'number[]': (x: number[]) => x.map(Number),
  address: getAddress,
  'address[]': (arrx: string[]) => arrx.map(x => getAddress(x)),
  bool: Boolean,
  'bool[]': (x: boolean[]) => x.map(Boolean),
} as const
