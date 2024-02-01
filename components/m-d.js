import { define, onFirstRender } from 'https://esm.sh/minicomp'
import { marked } from 'https://esm.sh/marked'
import dedent from 'https://esm.sh/dedent'


define('m-d', () => {
  onFirstRender((node) => {
    const content = dedent(node.innerHTML).replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    node.innerHTML = marked.parse(content)
  })

  return '<slot></slot>'
})
