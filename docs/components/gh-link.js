import { define, onFirstRender } from 'https://esm.sh/minicomp'
import { html, ref } from 'https://esm.sh/rehtm'


define('gh-link', () => {
  const anchor = ref()

  const load = async () => {
    const res = await fetch(`${window.BUILD_ENV_API.baseURL}git/remote/info`)
    const info = await res.json()

    anchor.current.href = `https://${info.host}/${info.full_name}`
  }

  onFirstRender(() => load())

  return html`
    <link rel="stylesheet" href="https://unpkg.com/nokss/dist/bundles/md.css" />
    <a ref=${anchor} target="_blank"><slot>GitHub</slot></a>
  `
})
