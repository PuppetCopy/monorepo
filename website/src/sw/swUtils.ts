import { registerSW } from 'virtual:pwa-register'
import type { IStream } from 'aelea/stream'
import { fromCallback } from 'aelea/stream-extended'

export const pwaUpgradeNotification: IStream<() => void> = fromCallback(cb => {
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
