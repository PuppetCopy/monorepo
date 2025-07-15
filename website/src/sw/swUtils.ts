import { registerSW } from 'virtual:pwa-register'
import type { Stream } from '@most/types'
import { fromCallback } from 'aelea/core'

export const pwaUpgradeNotification: Stream<() => void> = fromCallback((cb) => {
  const reloadCb = registerSW({
    immediate: true,
    async onNeedRefresh() {
      cb(() => reloadCb(true))

      const confirm = window.confirm('new update is pending, click Ok to reload')

      if (confirm) {
        await reloadCb(true)
      }
    }
  })

  return reloadCb
})
