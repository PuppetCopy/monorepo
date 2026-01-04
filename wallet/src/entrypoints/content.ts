const PUPPET_URL = import.meta.env.VITE_PUPPET_URL ?? 'http://localhost:3000'
const isPuppetSite = window.location.origin === PUPPET_URL

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  allFrames: true,

  main() {
    // Inject our provider on non-Puppet sites
    if (!isPuppetSite) {
      const script = document.createElement('script')
      script.src = browser.runtime.getURL('/inpage.js')
      ;(document.head || document.documentElement).prepend(script)
      script.onload = () => script.remove()
    }

    // Handle messages from inpage script (RPC requests)
    window.addEventListener('message', async event => {
      if (event.source !== window) return
      if (event.data?.target !== 'puppet-content') return

      const { id, payload } = event.data

      const response = await browser.runtime
        .sendMessage(payload)
        .catch((e: Error) => ({ error: { message: e.message } }))

      window.postMessage({ target: 'puppet-inpage', id, response }, '*')
    })

    // Handle messages from website (wallet state management)
    window.addEventListener('message', async event => {
      if (event.source !== window) return
      if (event.data?.target !== 'puppet-extension') return

      const { id, type, payload } = event.data

      const response = await browser.runtime
        .sendMessage({ type, payload })
        .catch((e: Error) => ({ success: false, error: e.message }))

      window.postMessage({ target: 'puppet-website', id, response }, '*')
    })

    // Handle messages from background script (events like accountsChanged)
    browser.runtime.onMessage.addListener(message => {
      if (message.type === 'event') {
        window.postMessage({ target: 'puppet-inpage', payload: message }, '*')
      }
    })
  }
})
