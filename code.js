import select from 'https://esm.sh/select'
import { ref, html } from 'https://esm.sh/rehtm'


const addCopyButtons = () => {
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

addCopyButtons()
