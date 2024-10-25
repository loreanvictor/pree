import { define, onConnected } from 'https://esm.sh/minicomp'
import { template, ref } from 'https://esm.sh/rehtm'


define('menu-toggle', ({ target }) => {
  const btn = ref()
  target ??= 'body > aside:first-of-type'
  const isMobile = () => window.matchMedia('(max-width: 1024px)').matches

  const state = () => {
    const menu = document.querySelector(target)
    if (menu) {
      const hidden = menu.getAttribute('aria-hidden') === 'true'
      const visible = menu.getAttribute('aria-hidden') === 'false'
      const assumeHidden = !hidden && !visible && isMobile()

      return {
        menu, hidden: hidden || assumeHidden
      }
    }
  }

  const toggle = () => {
    const curr = state()
    if (curr.menu) {
      curr.menu.setAttribute('aria-hidden', !curr.hidden)
      btn.current.setAttribute('aria-checked', !curr.hidden)
    }
  }

  const load = () => {
    const curr = state()
    if (curr.menu) {
      btn.current.setAttribute('aria-checked', curr.hidden)

      curr.menu.addEventListener('click', (evt) => {
        if (isMobile() && evt.target.closest('a')) {
          toggle()
        }
      })
    }
  }

  onConnected(load)

  return template`
    <link rel="stylesheet" href="https://unpkg.com/nokss" />
    <link rel="stylesheet" href="https://esm.sh/graphis/font/graphis.css" />
    <style>
    .icon {
      font-family: 'graphis', sans-serif;
      font-style: normal;
      font-size: 1.2rem;
    }

    button[role="switch"][aria-checked="true"]>span{
      color: var(--background-color);
    }
    </style>
    <button ref=${btn} onclick=${toggle}
      role="switch" aria-label="toggle sidebar">
      <span class="icon">❌</span>
      <span class="icon">⩧</span>
    </button>
  `
})
