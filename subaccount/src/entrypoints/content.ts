const PUPPET_URL = import.meta.env.VITE_PUPPET_URL ?? 'http://localhost:3000'
const isPuppetSite = window.location.origin === PUPPET_URL

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  allFrames: true,

  main() {
    if (!isPuppetSite) {
      const script = document.createElement('script')
      script.src = browser.runtime.getURL('/inpage.js')
      ;(document.head || document.documentElement).prepend(script)
      script.onload = () => script.remove()
    }

    window.addEventListener('message', async event => {
      if (event.source !== window) return

      const { target, id, type, payload } = event.data
      if (target !== 'puppet-content' && target !== 'puppet-extension') return
      if (target === 'puppet-extension' && !isPuppetSite) return

      const response = await browser.runtime
        .sendMessage(target === 'puppet-content' ? payload : { type, payload })
        .catch((e: Error) => ({ error: { message: e.message } }))

      window.postMessage(
        { target: target === 'puppet-content' ? 'puppet-inpage' : 'puppet-website', id, response },
        '*'
      )
    })

    browser.runtime.onMessage.addListener(message => {
      window.postMessage({ target: 'puppet-inpage', payload: message }, '*')
    })
  }
})
