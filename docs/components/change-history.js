import { define, onFirstRender } from 'https://esm.sh/minicomp'
import { html, ref } from 'https://esm.sh/rehtm'


define('change-history', () => {
  const date = ref()
  const name = ref()
  const version = ref()

  const load = async () => {
    const conf = await (await fetch(`${window.BUILD_ENV_API.baseURL}conf`)).json()
    let path = window.location.pathname

    if (conf.base && conf.base.length > 0) {
      path = path.slice(conf.base.length + 2)
    }

    if (conf.root && conf.root.length > 0) {
      path = conf.root + '/' + path
    }

    if (path.endsWith('/')) {
      path += 'index.html'
    } else if (!path.endsWith('.html')) {
      path += '.html'
    }

    const commit = await (await fetch(`${window.BUILD_ENV_API.baseURL}git/commits/last/${path}`)).json()

    if (!commit) {
      return
    }

    const pkg = JSON.parse(
      await (await fetch(`${window.BUILD_ENV_API.baseURL}git/show/${commit.hash}:package.json`)).text()
    )

    date.current.textContent = new Date(commit.date)
      .toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })

    name.current.textContent = pkg.name
    version.current.textContent = pkg.version
  }

  onFirstRender(() => {
    if (window.BUILD_ENV_API) {
      load()
    }
  })

  return html`
    <style>
      div {
        text-align: right;
        opacity:.35;
        font-size: 0.8rem;
        font-style: italic;
      }
    </style>
    <div>
      Updated at <span ref=${date}>??</span> <br />
      for <span ref=${name}>??</span> version <span ref=${version}>??</span>
    </div>
  `
})
