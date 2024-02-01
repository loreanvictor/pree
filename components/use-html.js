import { define, currentNode, useDispatch } from 'https://esm.sh/minicomp'


define('use-html', ({ src }) => {
  const host = currentNode()
  const dispatch = useDispatch('content')

  fetch(src)
    .then(res => res.text())
    .then(text => {
      host.innerHTML = text

      Array.from(host.querySelectorAll('script'))
        .forEach( oldScriptEl => {
          const newScriptEl = document.createElement('script')

          Array.from(oldScriptEl.attributes).forEach( attr => {
            newScriptEl.setAttribute(attr.name, attr.value)
          })

          const scriptText = document.createTextNode(oldScriptEl.innerHTML)
          newScriptEl.appendChild(scriptText)

          oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl)
        })

      dispatch({ src, html: text })
    })

  return '<slot></slot>'
})
