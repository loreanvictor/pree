import { define, onFirstRender } from 'https://esm.sh/minicomp'


define('local-style', () => {
  onFirstRender(node => {
    const parent = node.parentNode
    const style = document.createElement('style')
    const cls = 'local-style-' + Math.random().toString(36).slice(2)

    style.textContent = `.${cls}[data-local-style=${cls}] { \n ${node.textContent} \n }`
    parent.prepend(style)
    parent.classList.add(cls)
    parent.setAttribute('data-local-style', cls)

    node.remove()
  })

  return '<slot></slot>'
})
