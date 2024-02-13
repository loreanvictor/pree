import { define, onFirstRender } from 'https://esm.sh/minicomp'
import { html, ref } from 'https://esm.sh/rehtm'


define('change-history', () => {
  const link = ref()
  const code = ref()
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

    const git = await (await fetch(`${window.BUILD_ENV_API.baseURL}git/remote/info`)).json()

    code.current.href = `https://${git.host}/${git.full_name}/blob/main/${path}`

    const commit = await (await fetch(`${window.BUILD_ENV_API.baseURL}git/commits/last/${path}`)).json()
    if (!commit) {
      return
    }

    link.current.href = `https://${git.host}/${git.full_name}/commit/${commit.hash}`

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
        display: flex;
        flex-direction: row-reverse;
        align-items: top;
        gap: 1rem;
      }
      a {
        display: block;
        text-align: right;
        opacity:.35;
        font-size: 0.8rem;
        font-style: italic;
        text-decoration: none;
        color: inherit;

        &.code {
          --bg: var(--background-color, #fff);
          --fg: var(--text-color, #000);
          --r: var(--roundness, 3px);

          font-style: normal;
          font-weight: bold;
          font-family: monospace;
          background: color-mix(in srgb, var(--bg) 75%, var(--fg));
          font-size: 1.2rem;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--r);
          transition: color .15s, background .15s;

          &:hover {
            color: var(--bg);
            background: color-mix(in srgb, var(--bg) 25%, var(--fg));
          }
        }
      }
    </style>
    <div>
      <a ref=${code} target="_blank" class="code">∴</a>
      <a ref=${link} target="_blank">
        Updated at <span ref=${date}>??</span> <br />
        for <span ref=${name}>??</span> version <span ref=${version}>??</span>
      </a>
    </div>
  `
})
