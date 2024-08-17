import { Client, OperationContext } from '@urql/core'
import { abiParamParseMap } from "../gmxUtils.js"
import { getMappedValue } from 'common-utils'
export { encodePacked } from 'viem'

export type GqlType<T extends string> = { __typename: T }

type PackedAbiType =
  | 'uint'
  | 'uint[]'
  | 'uint256'
  | 'uint256[]'
  | 'string'
  | 'string[]'
  | 'number'
  | 'number[]'
  | 'int'
  | 'int[]'
  | 'address'
  | 'address[]'
  | 'bool'
  | 'bool[]'
  | 'int256'
  | 'bytes'

export type ISchema<T extends GqlType<any>> = {
  [P in keyof T]: T[P] extends any[] ? any : T[P] extends GqlType<any> ? ISchema<T[P]> : P extends `__typename` ? string : PackedAbiType
}

export type ISchemaQuery<TSchema, TQuery> = {
  [P in keyof TQuery]: TQuery[P] extends any[]
  ? P extends keyof TSchema ? ISchemaQuery<TSchema[P], TQuery[P]> : never : TQuery[P] extends object
  ? P extends keyof TSchema ? ISchemaQuery<TSchema[P], TQuery[P]> : never : P extends keyof TSchema
  ? TSchema[P] : never
}

export type PrettifyT<T> = {
  [K in keyof T]: T[K];
} & {};





interface IQuerySubgraph<Type extends GqlType<any>, TQuery> {
  schema: ISchema<Type>
  document?: TQuery | undefined
  filter?: any
  startBlock?: bigint

  first?: number
  skip?: number
  orderBy?: { [key in keyof Type]?: 'asc' | 'asc_nulls_first' | 'asc_nulls_last' | 'desc' | 'desc_nulls_first' | 'desc_nulls_last' }
}


export const querySubgraph = <Type extends GqlType<any>, TQuery>(
  client: Client,
  params: IQuerySubgraph<Type, TQuery>,
  context?: Partial<OperationContext>,
): Promise<TQuery extends unknown ? Type[] : PrettifyT<ISchemaQuery<Type, TQuery>>[]> => {

  const typeName = params.schema.__typename as string
  const whereClause = params.filter ? `where: {${parseFilterObject(params.filter)}}` : ''
  const orderByFilterParam = params.orderBy ? `order_by: {${parseFilterObject(params.orderBy)}}` : ''
  const fieldStructure = parseQueryObject(params.document ? params.document : fillQuery(params.schema))
  const filter = orderByFilterParam || whereClause ? `( ${orderByFilterParam} ${whereClause})` : ''

  const entry = `${typeName}${filter} { ${fieldStructure} }`

  const newLogsFilter = client.query(`{ ${entry} }`, {}, context)
    .then(response => {
      if (response.error) throw new Error(`${typeName} query error: ${response.error.message}`)

      if (!(typeName in response.data)) {
        throw new Error(`No ${typeName} found in subgraph response`)
      }

      const list: PrettifyT<ISchemaQuery<Type, TQuery>>[] = response.data[typeName]

      if (list instanceof Array) {
        return list.map(item => parseQueryResults(item, params.schema))
      }

      throw new Error(`No ${typeName} found in subgraph response`)
    })

  return newLogsFilter as any
}


// recursively parse a json object to query result
export function parseQueryResults(json: any, schema: any) {
  const entity: any = {}
  Object.entries(json).forEach(([key, value]) => {
    const schemaType = schema[key]

    if (schemaType in abiParamParseMap) {
      const parseFn = getMappedValue(abiParamParseMap, schemaType)

      entity[key] = parseFn(value)
    } else if (value instanceof Array) {
      entity[key] = value.map((item, i) => parseQueryResults(item, schemaType))
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
  if (typeof query !== 'object') throw new Error('Query must be an object')

  const fields: string[] = []
  Object.entries(query).forEach(([key, value]) => {

    if (value instanceof Object) {
      fields.push(`${key} { ${parseQueryObject(value)} }`)
    } else {
      fields.push(`${key}: { ${value} }`)
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