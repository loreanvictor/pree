import { define, onConnected, onDisconnected, currentNode } from 'https://esm.sh/minicomp'


// TODO: this should be a separate package, with proper tests, docs and organisation


const interceptLinks = () => {
  window.__dansInterceptor__ ??= addEventListener('click', event => {
    const path = event.composedPath()
    const anchor = path.find(node => node.tagName === 'A' && node.href)
    const blocked = path.find(node => node.tagName === 'DANS-OFF')
    if (!blocked
        && anchor
        && anchor.origin === location.origin
        && anchor.pathname !== location.pathname) {
      event.preventDefault()
      history.replaceState({ __dans__: true, url: location.href }, '', location.href)
      dispatchEvent(new CustomEvent('dans:start', { detail: { href: anchor.href } }))
    }
  })

  window.__dansBackInterceptor__ ??= addEventListener('popstate', event => {
    if (event.state?.__dans__) {
      dispatchEvent(new CustomEvent('dans:start', { detail: { href: event.state.url, pop: true } }))
    }
  })
}

const loadOnInterceptedLinks = () => {
  window.__dansLoader__ ??= addEventListener('dans:start', async event => {
    const response = await fetch(event.detail.href)
    const body = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(body, 'text/html')

    if (!event.detail.pop) {
      history.pushState({ url: event.detail.href, __dans__: true }, '', event.detail.href)
    }

    dispatchEvent(new CustomEvent('dans:load', { detail: { doc } }))
  })
}

const updateHeadOnLoad = () => {
  window.__dansHeadUpdater__ ??= addEventListener('dans:load', event => {
    updateHead(event.detail.doc)
  })
}

const executeScripts = (container) => {
  container.querySelectorAll('script').forEach(script => {
    const newScript = document.createElement('script')
    newScript.text = script.text
    for (const { name, value } of script.attributes) {
      newScript.setAttribute(name, value)
    }
    script.replaceWith(newScript)
  })
}

const activateDeclarativeShadowDOM = (container) => {
  container.querySelectorAll(':not(:defined)').forEach(elem => {
    if (!elem.shadowRoot) {
      const template = Array.from(elem.children).find(
        child => child.tagName === 'TEMPLATE' && child.getAttribute('shadowrootmode') === 'open'
      )
      if (template) {
        const shadowRoot = elem.attachShadow({ mode: 'open' })
        shadowRoot.appendChild(template.content.cloneNode(true))
        template.remove()
      }
    }
  })
}

function updateHead(doc) {
  const oldHead = document.head
  const newHead = doc.head

  // Handle title update
  const oldTitle = oldHead.querySelector('title')
  const newTitle = newHead.querySelector('title')
  if (newTitle && oldTitle.innerText !== newTitle.innerText) {
    oldTitle.innerText = newTitle.innerText
  }

  updateElements(oldHead, newHead, 'meta',
    (oldEl, newEl) => oldEl.name === newEl.name || oldEl.property === newEl.property)
  updateElements(oldHead, newHead, 'base', () => true)
}

function updateElements(oldParent, newParent, selector, compare) {
  const oldElements = oldParent.querySelectorAll(selector)
  const newElements = newParent.querySelectorAll(selector)
  const oldArray = Array.from(oldElements)

  // Remove elements that are no longer present
  oldArray.forEach(oldEl => {
    if (!Array.from(newElements).find(newEl => compare(oldEl, newEl))) {
      oldEl.parentNode.removeChild(oldEl)
    }
  })

  // Add or update elements
  newElements.forEach(newEl => {
    const oldEl = oldArray.find(o => compare(o, newEl))
    if (!oldEl) {
      oldParent.appendChild(newEl.cloneNode(true))
    } else {
      // Update existing elements if needed
      if (oldEl.outerHTML !== newEl.outerHTML) {
        oldEl.replaceWith(newEl.cloneNode(true))
      }
    }
  })
}

// TODO: this should be a separate package
// TODO: add support for adding listener to a specific target
const useListener = (event, callback) => {
  let listener
  onConnected(() => addEventListener(event, callback))
  onDisconnected(() => removeEventListener(listener))
}

// TODO: this should be a separate package
// TODO: add support for only watching specific properties
const useTransitionPromise = (target) => {
  target ??= currentNode()
  const transition = {}
  let startListener, endListener, resolve, reject

  onConnected(() => {
    startListener = target.addEventListener('transitionstart', event => {
      if (event.target === target) {
        reject && reject()
        transition.promise = new Promise((res, rej) => { resolve = res; reject = rej })
      }
    })

    endListener = target.addEventListener('transitionend', event => {
      if (event.target === target) {
        resolve()
      }
    })
  })

  onDisconnected(() => {
    target.removeEventListener('transitionstart', startListener)
    target.removeEventListener('transitionend', endListener)
  })

  return transition
}


define('dans-floor', () => {
  const host = currentNode()
  const transition = useTransitionPromise()

  onConnected(() => {
    interceptLinks()
    loadOnInterceptedLinks()
    updateHeadOnLoad()
  })

  useListener('dans:start', () => host.setAttribute('loading', ''))
  useListener('dans:load', async event => {
    await new Promise(resolve => setTimeout(resolve, 60))

    const query = host.id ? `dans-floor#${host.id}` : 'dans-floor:not([id])'
    const replacement = event.detail.doc.querySelector(query)

    await transition.promise
    host.removeAttribute('loading')

    if (replacement) {
      scrollTo(0, 0)
      host.innerHTML = ''
      Array.from(replacement.children).forEach(child => host.appendChild(child.cloneNode(true)))
      executeScripts(host)
      activateDeclarativeShadowDOM(host)
    } else {
      host.innerHTML = ''
    }
  })

  return '<slot></slot>'
})

define('dans-off', () => '<slot></slot>')
