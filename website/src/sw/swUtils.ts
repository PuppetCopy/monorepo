import { registerSW } from 'virtual:pwa-register'
import type { Stream } from '@most/types'
import { fromCallback } from 'aelea/core'

export const pwaUpgradeNotification: Stream<() => void> = fromCallback((cb) => {
  const reloadCb = registerSW({
    // immediate: true,
    // onOfflineReady() {
    //   debugger

    // },
    async onNeedRefresh() {
      // if (import.meta.env.DEV) {
      //   return
      // }

      cb(() => reloadCb(true))

      const confirm = window.confirm('new update is pending, click Ok to reload')

      if (confirm) {
        await reloadCb(true)
      }

      // if (reloadSW === 'true') {
      //   setInterval(async () => {
      //   }, 20000 /* 20s for testing purposes */)
      // }
    }
  })

  return reloadCb
})

// const worker = new Wroker()

// const date = '__DATE__'

// worker.addEventListener('message', async (msg) => {

// })
