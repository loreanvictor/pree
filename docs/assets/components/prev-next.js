import { define, onConnected, onDisconnected, attachControls } from 'https://esm.sh/minicomp'
import { template, ref, html } from 'https://esm.sh/rehtm'


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
const usePortal = (host) => {
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


define('prev-next', ({ target, prevlabel, nextlabel }) => {
  const host = ref()
  const prevPortal = usePortal(document.head)
  const nextPortal = usePortal(document.head)

  nextlabel ??= 'Up Next'
  prevlabel ??= 'Previosly'

  const load = () => {
    const el = document.querySelector(target ?? 'body > aside:first-of-type')

    if (el) {
      const me = whoAmI()
      const links = Array.from(el.querySelectorAll('a'))
      const index = links.findIndex(link => me.includes(link.href))

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

      prev && prevPortal.attach(html`<link rel="prefetch" href="${prev.href}" />`)
      next && nextPortal.attach(html`<link rel="prefetch" href="${next.href}" />`)

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
        host.current.style.opacity = 1
      }, 500)
    }
  }

  onConnected(load)
  attachControls({ load })

  return template`
    <link rel="stylesheet" href="https://unpkg.com/nokss" />
    <link rel="stylesheet" href="https://unpkg.com/graphis/font/graphis.css" />
    <style>
    i {
      font-family: 'graphis', sans-serif;
      font-style: normal;
      font-size: 2rem;
      opacity: .25;
    }

    section[role="feed"] {
      flex-direction: row;
      transition: opacity 1s;

      article {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;

        & > a {
          display: block;
          flex-grow: 1;
          text-decoration: none!important;
        }

        &.next {
          flex-basis: flex-end;
          text-align: right;
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
    <section role="feed" ref=${host} style="opacity: 0; display: none">
    </section>
  `
})
