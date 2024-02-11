import { define, currentNode, useDispatch } from 'https://esm.sh/minicomp'


define('use-html', ({ src }) => {
  const host = currentNode()
  const dispatch = useDispatch('content')

  fetch(src)
    .then(res => res.text())
    .then(text => {
      host.innerHTML = text

      Array.from(host.querySelectorAll('script'))
        .forEach(script => {
          const lively = document.createElement('script')
          Array.from(script.attributes).forEach(attr => {
            try {
              lively.setAttribute(attr.name, attr.value)
            } catch { /***/ }
          })

          lively.textContent = script.textContent
          script.parentNode.replaceChild(lively, script)
        })

      dispatch({ src, html: text })
    })

  return '<slot></slot>'
})
