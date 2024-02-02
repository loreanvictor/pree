import { define, onFirstRender } from 'https://esm.sh/minicomp'


define('on-host', ({ target = 'body' }) => {
  onFirstRender(node => {
    const template = node.querySelector('template')
    const parent = document.querySelector(target)
    if (template && parent) {
      parent.appendChild(template.cloneNode(true).content)
    }

    node.remove()
  })

  return '<slot></slot>'
})
