import { continueWith, disposeBoth, disposeNone, disposeWith, type IStream, op, switchMap } from 'aelea/stream'
import { state, stream } from 'aelea/stream-extended'

export type GetKey<TSchema> = Extract<keyof TSchema, string | number>

export interface IDbParams<TName extends string = string> {
  name: TName
  keyPath?: string | string[] | null
  autoIncrement?: boolean
}

export interface IStreamStoreKey<T> {
  db: IStream<IDBDatabase>
  storeName: string
  key: string
  initialValue: T
}

// Create database stream once and multicast it
function createDbStream<TName extends string, TStore>(
  dbName: TName,
  version: number,
  storeDefinitions: TStore
): IStream<IDBDatabase> {
  const storeNames = Object.keys(storeDefinitions as any)
  const openDbRequest = indexedDB.open(dbName, version)

  return state(
    stream((sink, scheduler) => {
      let db: IDBDatabase | null = null
      let disposed = false
      const initTime = scheduler.time()

      openDbRequest.onupgradeneeded = () => {
        const upgradeDb = openDbRequest.result

        // Delete and recreate all stores to handle schema changes
        for (const storeName of storeNames) {
          if (upgradeDb.objectStoreNames.contains(storeName)) {
            upgradeDb.deleteObjectStore(storeName)
          }
          upgradeDb.createObjectStore(storeName)
        }
      }

      openDbRequest.onsuccess = () => {
        db = openDbRequest.result

        // Check if all expected stores exist
        let needsReset = false
        for (const storeName of storeNames) {
          if (!db.objectStoreNames.contains(storeName)) {
            needsReset = true
            break
          }
        }

        if (needsReset) {
          // Close and delete the database, then recreate
          db.close()
          const deleteReq = indexedDB.deleteDatabase(dbName)

          deleteReq.onsuccess = () => {
            if (disposed) return
            const time = scheduler.time()

            // Reopen with correct schema
            const reopenReq = indexedDB.open(dbName, version)

            reopenReq.onupgradeneeded = () => {
              const newDb = reopenReq.result
              for (const storeName of storeNames) {
                newDb.createObjectStore(storeName)
              }
            }

            reopenReq.onsuccess = () => {
              if (disposed) {
                reopenReq.result.close()
                return
              }
              db = reopenReq.result
              sink.event(time, db)
            }

            reopenReq.onerror = () => {
              if (disposed) return
              sink.error(time, reopenReq.error || new Error('Failed to recreate database'))
            }
          }

          deleteReq.onerror = () => {
            const time = scheduler.time()

            sink.error(time, deleteReq.error || new Error('Failed to delete database'))
          }
        } else {
          const time = scheduler.time()

          sink.event(time, db)
        }
      }

      openDbRequest.onerror = () => {
        sink.error(initTime, openDbRequest.error || new Error('Failed to open database'))
      }

      // Cleanup function - close DB connection if subscription is cancelled
      return disposeWith(() => {
        disposed = true
        // if (db) {
        //   db.close()
        //   db = null
        // }
      })
    })
  )
}

// Create store definitions
export function createStoreDefinition<T, TStore extends { [P in keyof T]: TStore[P] }>(
  dbName: string,
  dbVersion: number,
  storeDefinitions: TStore
): {
  [P in keyof TStore]: {
    [K in keyof TStore[P]]: IStreamStoreKey<TStore[P][K]>
  }
} {
  const dbStream = createDbStream(dbName, dbVersion, storeDefinitions)

  const storeEntries = Object.entries(storeDefinitions)
  return storeEntries.reduce((acc, [storeName, initialState]) => {
    // Create key accessors for each property in the initial state
    const storeKeys = {} as any

    for (const key in initialState as any) {
      storeKeys[key] = {
        db: dbStream,
        storeName,
        key,
        initialValue: (initialState as any)[key]
      }
    }

    return {
      ...acc,
      [storeName]: storeKeys
    }
  }, {} as any)
}

export function read<TKey extends IDBValidKey, TData>(
  db: IDBDatabase,
  storeName: string,
  key: TKey,
  defaultValue?: TData
) {
  return stream((sink, scheduler) => {
    let disposed = false

    let tx: IDBTransaction
    let request: IDBRequest

    try {
      tx = db.transaction(storeName, 'readonly')
      request = tx.objectStore(storeName).get(key)
    } catch (e) {
      const time = scheduler.time()
      // Store doesn't exist, return default value
      if (e instanceof DOMException && e.name === 'NotFoundError') {
        sink.event(time, defaultValue)
      }

      sink.error(time, e)
      sink.end(time)
      return disposeNone
    }

    request.onsuccess = () => {
      if (disposed) return
      const result = request.result
      const time = scheduler.time()

      sink.event(time, result !== undefined ? result : defaultValue)
      sink.end(time)
    }

    request.onerror = () => {
      if (disposed) return
      const time = scheduler.time()
      sink.error(time, request.error || new Error('Read failed'))
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
        event(time, data) {
          try {
            const tx = db.transaction(storeName, 'readwrite')
            const request = tx.objectStore(storeName).put(data, key)

            request.onsuccess = () => {
              if (disposed) return
              const time = scheduler.time()
              sink.event(time, data)
            }

            request.onerror = () => {
              if (disposed) return
              const time = scheduler.time()
              sink.error(time, request.error || new Error('Write failed'))
            }

            tx.onerror = () => {
              if (disposed) return
              const time = scheduler.time()
              sink.error(time, tx.error || new Error('Transaction failed'))
            }
          } catch (e) {
            if (disposed) return
            sink.error(time, e instanceof Error ? e : new Error('Failed to create write transaction'))
          }
        },
        end(time) {
          if (disposed) return
          sink.end(time)
        },
        error(time, error) {
          if (disposed) return
          sink.error(time, error)
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

export function replayWrite<TData>(storeKey: IStreamStoreKey<TData>, value: IStream<TData>): IStream<TData> {
  const { db, storeName, key, initialValue } = storeKey

  return op(
    db,
    switchMap(database => {
      const storedValue = read(database, storeName, key, initialValue)
      const writeStream = write(database, storeName, key, value)
      return continueWith(() => writeStream, storedValue)
    })
  )
}

// Optional helper functions for direct read/write
export function readStoreKey<TData>(storeKey: IStreamStoreKey<TData>): IStream<TData> {
  const { db, storeName, key, initialValue } = storeKey

  return op(
    db,
    switchMap(database => read(database, storeName, key, initialValue))
  )
}

export function writeStoreKey<TData>(storeKey: IStreamStoreKey<TData>, value: IStream<TData>): IStream<TData> {
  const { db, storeName, key } = storeKey

  return op(
    db,
    switchMap(database => write(database, storeName, key, value))
  )
}
