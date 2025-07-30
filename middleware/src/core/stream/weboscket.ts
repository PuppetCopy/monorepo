import { empty, tap } from '@most/core'
import { disposeBoth, disposeWith } from '@most/disposable'
import type { Stream } from '@most/types'
import { nullSink } from 'aelea/core'

export function fromWebsocket<OUTPUT, INPUT>(
  url: string,
  input: Stream<INPUT> = empty(),
  protocols: string | string[] | undefined = undefined
): Stream<OUTPUT> {
  return {
    run(sink, scheduler) {
      let socket: WebSocket | null = new WebSocket(url, protocols)
      const messageBuffer: INPUT[] = []

      const onError = (error: Event) => {
        const errorMsg = error instanceof ErrorEvent ? error.message : 'WebSocket connection error'
        sink.error(scheduler.currentTime(), new Error(`WebSocket error: ${errorMsg}`))
      }

      const onMessage = (msg: MessageEvent) => {
        try {
          const data = JSON.parse(msg.data)
          sink.event(scheduler.currentTime(), data)
        } catch (parseError) {
          sink.error(scheduler.currentTime(), new Error(`JSON parse error: ${parseError}`))
        }
      }

      const sendMessage = (value: INPUT) => {
        try {
          if (socket) {
            socket.send(JSON.stringify(value))
          }
        } catch (sendError) {
          console.warn('Failed to send WebSocket message:', sendError)
        }
      }

      const onOpen = () => {
        // Send any buffered messages
        while (messageBuffer.length > 0) {
          const message = messageBuffer.shift()!
          sendMessage(message)
        }
      }

      let isCleanedUp = false

      const onClose = () => {
        if (!isCleanedUp) {
          cleanup()
          sink.end(scheduler.currentTime())
        }
      }

      const cleanup = () => {
        if (isCleanedUp) return
        isCleanedUp = true

        if (socket) {
          // Remove all event listeners
          socket.removeEventListener('error', onError)
          socket.removeEventListener('message', onMessage)
          socket.removeEventListener('open', onOpen)
          socket.removeEventListener('close', onClose)

          // Clear socket reference
          socket = null
        }

        // Clear message buffer to free memory
        messageBuffer.length = 0
      }

      socket.addEventListener('error', onError)
      socket.addEventListener('message', onMessage)
      socket.addEventListener('open', onOpen)
      socket.addEventListener('close', onClose)

      // Handle input stream
      const sendInputEffect = tap((value: INPUT) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
          sendMessage(value)
        } else if (socket && socket.readyState === WebSocket.CONNECTING) {
          messageBuffer.push(value)
        }
      }, input).run(nullSink, scheduler)

      const disposeSocket = disposeWith(() => {
        cleanup()
        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
          socket.close()
        }
      }, {})

      return disposeBoth(disposeSocket, sendInputEffect)
    }
  }
}
