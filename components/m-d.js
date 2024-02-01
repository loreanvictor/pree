import { define, onFirstRender, useDispatch } from 'https://esm.sh/minicomp'
import { marked } from 'https://esm.sh/marked'
import dedent from 'https://esm.sh/dedent'


define('m-d', () => {
  const dispatch = useDispatch('parse')

  onFirstRender((node) => {
    const content = dedent(node.innerHTML).replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    const parsed = marked.parse(content)
    node.innerHTML = parsed
    dispatch({ content, parsed })
  })

  return '<slot></slot>'
})
