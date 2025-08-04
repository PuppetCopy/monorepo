import { combineState, continueWith, debounce, type IStream, multicast, now, op, stream, switchMap } from 'aelea/stream'

export type GetKey<TSchema> = Extract<keyof TSchema, string | number>

export interface IDbParams<TName extends string = string> {
  name: TName
  keyPath?: string | string[] | null
  autoIncrement?: boolean
}

export interface IStoreConfig<TState, TType extends { [P in keyof TState]: TState[P] }> {
  initialState: TType
  options?: IDBObjectStoreParameters
}

export interface IStreamStore<TSchema> {
  name: string
  db: IStream<IDBDatabase>
  initialState: TSchema
}

// Create database stream once and multicast it
function createDbStream<TName extends string>(dbName: TName, version: number): IStream<IDBDatabase> {
  const newLocal = stream(sink => {
    let db: IDBDatabase | null = null

    const openDbRequest = indexedDB.open(dbName, version)

    openDbRequest.onsuccess = () => {
      db = openDbRequest.result
      sink.event(db)
      sink.end()
    }

    openDbRequest.onerror = () => {
      sink.error(openDbRequest.error || new Error('Failed to open database'))
    }

    // Cleanup function - close DB connection if subscription is cancelled
    return () => {
      if (db) {
        db.close()
        db = null
      }
    }
  })
  return multicast(
    newLocal
  )
}

// Create store definitions
export function createStoreDefinition<T, TDefinition extends { [P in keyof T]: IStoreConfig<any, any> }>(
  dbName: string,
  dbVersion: number,
  definitions: TDefinition
): { [P in keyof TDefinition]: IStreamStore<TDefinition[P]['initialState']> } {
  const dbStream = createDbStream(dbName, dbVersion)

  return Object.entries(definitions).reduce((acc, [name, config]) => {
    return {
      ...acc,
      [name]: {
        name,
        db: dbStream,
        initialState: (config as any).initialState
      }
    }
  }, {} as any)
}

// Write operation as a combinator
function writeOp<TSchema, TKey extends GetKey<TSchema>, TData extends TSchema[TKey]>(
  store: IStreamStore<TSchema>,
  key: TKey,
  value: IStream<TData>
) {
  return switchMap(
    params =>
      stream(sink => {
        const tx = params.db.transaction(store.name, 'readwrite')
        const request = tx.objectStore(store.name).put(params.value, key)

        request.onsuccess = () => {
          sink.event(params.value)
          sink.end()
        }

        request.onerror = () => {
          sink.error(request.error || new Error('Write failed'))
        }

        return () => {} // No cleanup needed
      }),
    combineState({ value, db: store.db })
  )
}

// Read operation as a combinator
function readOp<TSchema, TKey extends GetKey<TSchema>, TData extends TSchema[TKey]>(
  store: IStreamStore<TSchema>,
  key: TKey
) {
  return op(
    store.db,
    switchMap(db =>
      stream(sink => {
        const tx = db.transaction(store.name, 'readonly')
        const request = tx.objectStore(store.name).get(key)

        request.onsuccess = () => {
          const value = request.result
          sink.event(value === undefined ? store.initialState[key] : value)
          sink.end()
        }

        request.onerror = () => {
          sink.error(request.error || new Error('Read failed'))
        }

        return () => {}
      })
    )
  )
}

// Public API: write with debouncing
export function write<TSchema, TKey extends GetKey<TSchema>, TData extends TSchema[TKey]>(
  store: IStreamStore<TSchema>,
  writeEvent: IStream<TData>,
  key: TKey
): IStream<TData> {
  return writeOp(store, key, writeEvent)
}

// Public API: replay write - read initial then continue with writes
export function replayWrite<TSchema, TKey extends GetKey<TSchema>, TData extends TSchema[TKey]>(
  store: IStreamStore<TSchema>,
  writeEvent: IStream<TData>,
  key: TKey
): IStream<TData> {
  const storedValue = readOp(store, key)
  const writeStream = write(store, writeEvent, key)

  return continueWith(() => writeStream, storedValue)
}
