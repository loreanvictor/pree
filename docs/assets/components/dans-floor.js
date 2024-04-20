import { define, onConnected, onDisconnected, currentNode, on } from 'https://esm.sh/minicomp'


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
      dispatchEvent(new CustomEvent('dans:start', { detail: { href: anchor.href } }))
    }
  })
}

const loadOnInterceptedLinks = () => {
  window.__dansLoader__ ??= addEventListener('dans:start', async event => {
    const response = await fetch(event.detail.href)
    const body = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(body, 'text/html')
    history.pushState({ path: event.detail.href }, '', event.detail.href)
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

function updateHead(doc) {
  const oldHead = document.head
  const newHead = doc.head

  // Handle title update
  const oldTitle = oldHead.querySelector('title')
  const newTitle = newHead.querySelector('title')
  if (newTitle && oldTitle.innerText !== newTitle.innerText) {
    oldTitle.innerText = newTitle.innerText
  }

  // Remove/Add/Update meta tags
  updateElements(oldHead, newHead, 'meta',
    (oldEl, newEl) => oldEl.name === newEl.name || oldEl.property === newEl.property)

  // Remove/Add/Update link tags (for stylesheets, icons, etc.)
  updateElements(oldHead, newHead, 'link',
    (oldEl, newEl) => oldEl.rel === newEl.rel && oldEl.href === newEl.href)

  // Remove/Add/Update scripts
  updateElements(oldHead, newHead, 'script',
    (oldEl, newEl) => oldEl.src === newEl.src && oldEl.innerText === newEl.innerText)
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
const useGlobalListener = (event, callback) => {
  let listener
  onConnected(() => addEventListener(event, callback))
  onDisconnected(() => removeEventListener(listener))
}

// TODO: this should be a separate package
const deferred = () => {
  let resolve, reject
  const promise = new Promise((res, rej) => { resolve = res; reject = rej })

  return { resolve, reject, promise }
}

define('dans-floor', () => {
  const host = currentNode()
  let transition

  onConnected(() => {
    interceptLinks()
    loadOnInterceptedLinks()
    updateHeadOnLoad()
  })

  on('transitionstart', (event) => {
    if (event.target === host) {
      transition = deferred()
    }
  })

  on('transitionend', (event) => {
    if (event.target === host) {
      transition.resolve()
    }
  })

  useGlobalListener('dans:start', () => host.setAttribute('loading', ''))
  useGlobalListener('dans:load', async event => {
    await new Promise(resolve => setTimeout(resolve, 60))

    const query = host.id ? `dans-floor#${host.id}` : 'dans-floor:not([id])'
    const replacement = event.detail.doc.querySelector(query)

    await transition?.promise
    host.removeAttribute('loading')

    if (replacement) {
      scrollTo(0, 0)
      host.innerHTML = replacement.innerHTML
      executeScripts(host)
    } else {
      host.innerHTML = ''
    }
  })

  return '<slot></slot>'
})

define('dans-off', () => '<slot></slot>')
