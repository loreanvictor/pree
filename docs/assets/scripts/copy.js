import select from 'https://esm.sh/select'
import { ref, html } from 'https://esm.sh/rehtm'


export const addCopyButtons = () => {
  document.querySelectorAll('pre').forEach(pre => {
    const btn = ref()

    const copy = () => {
      select(pre.querySelector('code'))
      document.execCommand('copy')
      btn.current.textContent = '✔'
      setTimeout(() => btn.current.textContent = '📑', 2000)
    }

    pre.append(html`
      <menu role=toolbar align=right>
        <button ref=${btn} class=icon onclick=${copy} aria-label=copy>📑</button>
      </menu>
    `)
  })
}

const copy = text => {
  const el = ref()
  document.body.append(html`<textarea ref=${el} style="{opacity: 0; width: 0; height: 0}">${text}</textarea>`)
  select(el.current)
  document.execCommand('copy')
  navigator.clipboard?.writeText(text)
  el.current.remove()
}

export const addHeaderLinks = () => {
  document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(h => {
    const id = h.id
    const btn = ref()

    const copyLink = () => {
      const url = location.protocol + '//' + location.host + location.pathname + '#' + id
      copy(url)
      btn.current.textContent = '✔'
      setTimeout(() => btn.current.textContent = '🔗', 2000)
    }

    h.append(html`
      <menu role=toolbar>
        <button ref=${btn} onclick=${copyLink} aria-label="copy link" class=icon>
          🔗
        </button>
      </menu>
    `)
  })
}

