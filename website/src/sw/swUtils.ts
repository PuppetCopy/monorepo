import { registerSW } from 'virtual:pwa-register'
import { fromCallback, type IStream } from 'aelea/stream'

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
