import { define, currentNode } from 'https://esm.sh/minicomp'


define('use-html', ({ src }) => {
  const host = currentNode()

  fetch(src)
    .then(res => res.text())
    .then(text => {
      host.innerHTML = text
    })

  return '<slot></slot>'
})
