import { continueWith, disposeBoth, disposeWith, type IStream, multicast, op, stream, switchMap } from 'aelea/stream'

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
    return disposeWith(() => {
      if (db) {
        db.close()
        db = null
      }
    })
  })
  return multicast(newLocal)
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

export function read<TKey extends IDBValidKey>(db: IDBDatabase, storeName: string, key: TKey) {
  return stream(sink => {
    let disposed = false

    const tx = db.transaction(storeName, 'readonly')
    const request = tx.objectStore(storeName).get(key)

    request.onsuccess = () => {
      if (disposed) return
      sink.event(request.result)
      sink.end()
    }

    request.onerror = () => {
      if (disposed) return
      sink.error(request.error || new Error('Read failed'))
    }

    return disposeWith(() => {
      disposed = true
    })
  })
}

export function write<TKey extends IDBValidKey, TData>(
  db: IDBDatabase,
  storeName: string,
  key: TKey,
  value: IStream<TData>
) {
  return stream((sink, scheduler) => {
    let disposed = false

    const valueDisposable = value.run(
      {
        event(data) {
          const tx = db.transaction(storeName, 'readwrite')
          const request = tx.objectStore(storeName).put(data, key)

          request.onsuccess = () => {
            if (disposed) return
            sink.event(data)
            sink.end()
          }

          request.onerror = () => {
            if (disposed) return
            sink.error(request.error || new Error('Write failed'))
          }
        },
        end() {
          if (disposed) return
          sink.end()
        },
        error(error) {
          if (disposed) return
          sink.error(error)
        }
      },
      scheduler
    )

    return disposeBoth(
      disposeWith(() => {
        disposed = true
      }),
      valueDisposable
    )
  })
}

export function replayWrite<TSchema, TKey extends GetKey<TSchema>, TData extends TSchema[TKey]>(
  store: IStreamStore<TSchema>,
  value: IStream<TData>,
  key: TKey
): IStream<TData> {
  return op(
    store.db,
    switchMap(db => {
      const storedValue = read(db, store.name, key)
      const writeStream = write(db, store.name, key, value)

      return continueWith(() => writeStream, storedValue)
    })
  )
}
