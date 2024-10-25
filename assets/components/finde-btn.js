import lunr from 'https://esm.sh/lunr'
import hotkeys from 'https://esm.sh/hotkeys-js'
import { define, onConnected } from 'https://esm.sh/minicomp'
import { template, ref, html } from 'https://esm.sh/rehtm'


// TODO: separate the dialog element into a new component
define('finde-btn', ({ base, src, shortcut = '/,cmd+k,ctrl+k' }) => {
  const baseURI = base ?? document.querySelector('base')?.href ?? '/'
  const srcURI = src ?? (baseURI + 'search-index.json')

  const dialog = ref()
  const res = ref()
  const input = ref()
  const index = ref()
  const query = ref()

  const show = () => { dialog.current.showModal() }
  const update = (evt) => {
    query.current = evt.target.value
    localStorage.setItem('finde-query', query.current)
    search()
  }

  const search = () => {
    if (index.current) {
      res.current.innerHTML = ''
      if (query.current) {
        const raw = index.current.search(query.current)
        const results = raw
          .filter(item => item.score > Math.min(0.5, raw[0].score * .6))
          .map(item => {
            const { t: title, p: path } = JSON.parse(item.ref)

            return { title, path }
          })
          .filter(({ title }) => !!title && title.length > 0)

        if (results.length > 0) {
          res.current.append(html`<nav>${
            results.map(({title, path}) => {
              const parent = path.split('/').slice(0, -1).join('/')

              return html`
                <a href="${baseURI + path}">
                  <div>
                    <small>${parent ?? ''}</small>
                    ${title}
                  </div>
                  <kbd>↵</kbd>
                </a>
              `
            })}</nav>`)
        }
      }
    }
  }

  const keydown = (evt) => {
    if (evt.key === 'ArrowDown' || evt.key === 'ArrowUp') {
      evt.preventDefault()
      const targets = Array.from(dialog.current.querySelectorAll('input, a'))
      const active = dialog.current.querySelector(':focus')
      const focused = targets.indexOf(active)
      const next = targets[focused + (evt.key === 'ArrowDown' ? 1 : -1)]

      if (next) {
        next.focus()
      }
    }

    if (evt.key === 'Escape') {
      evt.preventDefault()
      dialog.current.close()
    }
  }

  const click = (evt) => {
    const rect = dialog.current.getBoundingClientRect()
    if (evt.clientY < rect.top || evt.clientY > rect.bottom || evt.clientX < rect.left || evt.clientX > rect.right) {
      dialog.current.close()
    }

    if (evt.target.closest('a')) {
      dialog.current.close()
    }
  }

  onConnected(() => {
    query.current = localStorage.getItem('finde-query') ?? ''
    input.current.value = query.current

    fetch(srcURI)
      .then(raw => raw.json())
      .then(data => {
        index.current = lunr.Index.load(data)
        search()
      })

    hotkeys(shortcut, (evt) => {
      evt.preventDefault()
      show()
    })
  })

  return template`
    <style>
      @import 'https://unpkg.com/nokss' layer(base);
      @import 'https://esm.sh/graphis/font/graphis.css';

      [aria-label] {
        font-family: 'graphis', sans-serif;
        font-style: normal;
        font-size: 1.2em;
      }

      dialog {
        @media(min-width: 512px) {
          --modal-width: calc(var(--main-content-max-width, 60vw) * .75);
        }

        border-radius: calc(var(--roundness) * 2);
        --border-color: color-mix(
          in srgb,
          var(--text-color) calc(var(--hr-expression) * 50%),
          var(--background-color)
        );

        position: fixed;
        top: 20vh;
        margin: 0 auto;

        input {
          background: none;
          border: none;
          font-size: 1.5rem;
        }

        div {
          max-height: calc(60vh - 2rem - calc(var(--spacing) * 4) - var(--button-height));
          overflow: auto;

          nav {
            a {
              padding: var(--spacing);
              display: flex;
              min-height: 4rem;
              align-items: center;
              transition: background .1s ease;

              &:focus, &:hover {
                background: color-mix(in srgb, var(--background-color) 90%, var(--primary-color));
                border-radius: var(--roundness);
                outline: none;
              }

              &>div {
                flex-grow: 1;
              }

              small {
                opacity: .5;
                display: block;

                &:empty, &:has(:empty) {
                  display: none;
                }
              }

              &:not(:last-child) {
                border-bottom: 1px solid var(--border-color);
              }

              kbd {
                float: right;
                opacity: 0;

                transition: opacity .1s ease;

                :focus>& {
                  opacity: 1;
                }
              }
            }
          }
        }

        kbd {
          height: 1.5rem;
        }

        form {
          display: none;
        }

        @media (any-hover: none) {
          form {
            display: block;
          }

          footer small, kbd {
            display: none;
          }
        }
      }
    </style>
    <menu onclick=${show} role="toolbar">
      <button aria-label="search">🔍</button>
    </menu>
    <dialog ref=${dialog} onkeydown=${keydown} onclick=${click}>
      <input ref=${input} type="text" oninput=${update} placeholder="Type to search ..."/>
      <div ref=${res}></div>
      <footer align="right">
        <small><kbd>↑</kbd><kbd>↓</kbd> to navigate, 
          <kbd>ESC</kbd> to close
        </small>
        <form method="dialog"><button>Close</button></form>
      </footer>
    </dialog>
  `
})
