import { define } from 'https://esm.sh/minicomp'
import { html, ref } from 'https://esm.sh/rehtm'


console.log('LOADED')


define('say-hi', () => `
  <div>
    Hellow <slot></slot>
    <hr/>
    <slot name="footer"></slot>
  </span>
`)


define('file-list', ({pattern}) => {
  const ul = ref()

  const load = async () => {
    const res = await fetch('/@env/files/list/' + pattern)
    const files = await res.json()
    ul.current.innerHTML = files.map(file => `<li>${file}</li>`).join('')
  }

  load()

  return html`<ul ref=${ul}></ul>`
})


define('package-info', () => {
  const res = ref()
  const load = async () => {
    const resp = await fetch('/@env/files/read/package.json')
    const pkg = JSON.parse((await resp.json()).content)
    res.current.innerHTML = `${pkg.name}@${pkg.version} - ${pkg.description}`
  }

  load()

  return html`<span ref=${res}></span>`
})


define('last-change', () => {
  const res = ref()

  const load = async () => {
    const resp = await fetch('/@env/git/commits/all/src/cli/args.ts')
    const commit = await resp.json()
    res.current.innerHTML = `<pre>${JSON.stringify(commit, null, 2)}</pre>`
  }

  load()

  return html`<div ref=${res}></div>`
})

