import { define, onFirstRender } from 'https://esm.sh/minicomp'


define('use-layout', ({ src }) => {

  onFirstRender(node => {
    const root = node.shadowRoot
    fetch(src)
      .then(res => res.text())
      .then(html => {
        root.innerHTML = html
        root.querySelectorAll('script').forEach(script => {
          const lively = document.createElement('script')
          script.getAttributeNames().forEach(name => {
            lively.setAttribute(name, script.getAttribute(name))
          })
          lively.textContent = script.textContent
          script.replaceWith(lively)
        })
      })
  })

  return '<slot></slot>'
})
