declare const PUPPET_URL: string

// Inject inpage script on external sites only
if (window.location.origin !== PUPPET_URL) {
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('inpage.js')
  ;(document.head || document.documentElement).prepend(script)
  script.onload = () => script.remove()
}

window.addEventListener('message', async event => {
  if (event.source !== window) return

  const { target, id, type, payload } = event.data
  if (target !== 'puppet-content' && target !== 'puppet-extension') return
  if (target === 'puppet-extension' && window.location.origin !== PUPPET_URL) return

  const replyTarget = target === 'puppet-content' ? 'puppet-inpage' : 'puppet-website'
  const message = target === 'puppet-content' ? payload : { type, payload }

  try {
    const response = await chrome.runtime.sendMessage(message)
    window.postMessage({ target: replyTarget, id, response }, '*')
  } catch (error: any) {
    window.postMessage(
      { target: replyTarget, id, response: { error: { message: error?.message || 'Extension unavailable' } } },
      '*'
    )
  }
})

// Forward background -> inpage events
chrome.runtime.onMessage.addListener(message => {
  window.postMessage({ target: 'puppet-inpage', payload: message }, '*')
})
