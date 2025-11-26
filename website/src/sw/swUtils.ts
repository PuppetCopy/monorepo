import { registerSW } from 'virtual:pwa-register'
import type { IStream } from 'aelea/stream'
import { fromCallback } from 'aelea/stream-extended'

// Standard pwa-register pattern: notify when a waiting SW is present
export const pwaUpgradeNotification: IStream<() => void> = fromCallback(cb => {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      cb(() => updateSW(true))
    },
    onRegisteredSW(_swUrl, registration) {
      // If a waiting worker already exists (e.g. reopened tab), trigger the prompt.
      if (registration?.waiting) {
        cb(() => updateSW(true))
      }
    }
  })

  return updateSW
})
