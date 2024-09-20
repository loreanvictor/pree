import { define, onConnected, onDisconnected, attachControls } from 'https://esm.sh/minicomp'
import { template, ref, html } from 'https://esm.sh/rehtm'
import hotkeys from 'https://esm.sh/hotkeys-js'


function whoAmI() {
  const path = location.href.split('#')[0]
  const candidates = [ path ]
  if (path.endsWith('/') || path === '') {
    candidates.push(path.slice(0, -1))
    candidates.push(path + 'index.html')
    candidates.push(path + 'index')
  } else if (!path.endsWith('.html')) {
    candidates.push(path + '.html')
    candidates.push(path + '/')
    candidates.push(path + '/index')
    candidates.push(path + '/index.html')
  } else if (path.endsWith('.html')) {
    const noext = path.slice(0, -5)
    candidates.push(noext)
    if (noext.endsWith('index.html')) {
      candidates.push(noext.slice(0, -10))
      candidates.push(noext.slice(0, -11))
    } else if (noext.endsWith('index')) {
      candidates.push(noext.slice(0, -5))
      candidates.push(noext.slice(0, -6))
    }
  }

  return candidates
}


// TODO: this should be an independent package
const useAttachedElement = (host) => {
  let child

  const attach = el => {
    if (el instanceof DocumentFragment) {
      el = el.firstElementChild
    }

    child && detach()
    host.appendChild(child = el)
  }
  const detach = () => child && host.removeChild(child)

  onDisconnected(() => detach())

  return { attach, detach }
}

// TODO: this should be its own package
const useHotkeys = (keys, listener) => {
  onConnected(() => hotkeys(keys, listener))
  onDisconnected(() => hotkeys.unbind(keys, listener))
}

define('prev-next', ({ target, prevlabel = 'Previously', nextlabel = 'Up Next' }) => {
  const host = ref()
  const prev$ = useAttachedElement(document.head)
  const next$ = useAttachedElement(document.head)

  let index = -1
  let links = []

  const load = () => {
    const el = document.querySelector(target ?? 'body > aside:first-of-type')

    if (el) {
      const me = whoAmI()
      links = Array.from(el.querySelectorAll('a'))
      index = links.findIndex(link => me.includes(link.href))

      if (index === -1) {
        return
      }

      const prev = index > 0 ? {
        href: links[index - 1].getAttribute('href'),
        text: links[index - 1].textContent
      } : undefined

      const next = index < links.length - 1 ? {
        href: links[index + 1].getAttribute('href'),
        text: links[index + 1].textContent
      } : undefined

      prev && prev$.attach(html`<link rel="prefetch" href="${prev.href}" />`)
      next && next$.attach(html`<link rel="prefetch" href="${next.href}" />`)

      host.current.innerHTML = `        
        ${prev ? `
          <article>
            <i>⬅</i>
            <a href="${prev.href}">
              <small>${prevlabel}</small><br>
              ${prev.text}
            </a>
          </article>
          ` : ''}
        ${next ? `
          <article class="next">
            <a href="${next.href}">
              <small>${nextlabel}</small><br>
              ${next.text}
            </a>
            <i>➡</i>
          </article>
          ` : ''}
      `
      setTimeout(() => {
        host.current.style.display = 'flex'

        setTimeout(() => {
          host.current.style.opacity = 1
          host.current.style.maxHeight = '6rem'
        }, 100)
      }, 100)
    }
  }

  onConnected(load)
  attachControls({ load })

  useHotkeys('cmd+left,ctrl+left', evt => {
    if (index > 0) {
      evt.preventDefault()
      host.current?.querySelector('article:not(.next) a')?.click()
    }
  })

  useHotkeys('cmd+right,ctrl+right', evt => {
    if (index < links.length - 1) {
      evt.preventDefault()
      host.current?.querySelector('article.next a')?.click()
    }
  })

  return template`
    <link rel="stylesheet" href="https://unpkg.com/nokss" />
    <link rel="stylesheet" href="https://unpkg.com/graphis/font/graphis.css" />
    <style>
    section[role="feed"] {
      flex-direction: row;
      transition: opacity .2s, max-height .2s;
      overflow: hidden;
      padding: 0.5rem;

      article {
        --border-expression: 0;
        --brightness: none;
        --raised-card-brightness: none;
        --card-shadow: 0 1px 3px rgba(0, 0, 0, .25);
        --raised-card-shadow: 0 2px 6px rgba(0, 0, 0, .4);

        @media (prefers-color-scheme: light) {
          --card-shadow: 0 1px 3px rgba(0, 0, 0, .1);
          --raised-card-shadow: 0 2px 6px rgba(0, 0, 0, .15);
        }

        flex-grow: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
        padding: 1rem;

        & > a {
          display: block;
          flex-grow: 1;
          text-decoration: none!important;
          font-size: 1.2rem;
          opacity: .5;
          font-weight: 400;

          small {
            font-weight: 200;
            font-size: .7rem;
          }
        }

        &:hover > a {
          opacity: 1;
        }

        text-align: right;
        flex-basis: flex-end;

        &.next {
          flex-basis: flex-start;
          text-align: left;
        }

        i {
          font-family: 'graphis', sans-serif;
          font-style: normal;
          font-size: 1.5rem;
          font-weight: bold;
          opacity: .5;
        }

        &:hover > i {
          opacity: 1;
        }

        @media (max-width: 480px) {
          &:first-child:not(:last-child) {
            display: none;
          }
        }
      }

      margin-bottom: 4rem;
    }
    </style>
    <section role="feed" ref=${host} style="opacity: 0; display: flex; max-height: 0">
    </section>
  `
})
