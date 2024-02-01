import { define, onConnected, attachControls } from 'https://esm.sh/minicomp'
import { template, ref } from 'https://esm.sh/rehtm'


function whoAmI() {
  const path = location.href
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

define('prev-next', ({ target, prevlabel, nextlabel }) => {
  const host = ref()

  nextlabel ??= 'Up Next'
  prevlabel ??= 'Previosly'

  const load = () => {
    const query = target ?? 'body > aside:first-of-type'
    const el = document.querySelector(query)

    if (el) {
      const me = whoAmI()
      const links = Array.from(el.querySelectorAll('a'))
      const index = links.findIndex(link => me.includes(link.href))

      if (index === -1) {
        return
      }

      const prev = index > 0 ? {
        href: links[index - 1].href,
        text: links[index - 1].textContent
      } : undefined

      const next = index < links.length - 1 ? {
        href: links[index + 1].href,
        text: links[index + 1].textContent
      } : undefined

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

      host.current.removeAttribute('aria-hidden')
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
      &[aria-hidden] {
        opacity: 0;
      }

      opacity: 1;
      transition: opacity .5s;

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
    <section role="feed" ref=${host} aria-hidden="true">
    </section>
  `
})
