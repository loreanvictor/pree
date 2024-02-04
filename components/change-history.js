import { define, onFirstRender } from 'https://esm.sh/minicomp'


define('change-history', () => {
  if (window.BUILD_ENV_API) {
    onFirstRender(node => {
      const root = node.shadowRoot

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
        const pkg = JSON.parse(
          await (await fetch(`${window.BUILD_ENV_API.baseURL}git/show/${commit.hash}:package.json`)).text()
        )
        const date = new Date(commit.date)
          .toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })

        root.innerHTML = `
          <style>
            div {
              text-align: right;
              opacity:.35;
            }
          </style>
          <div>
            <small>
              <i>
              updated at ${date}
              <br> for ${pkg.name} version ${pkg.version}
              </i>
            </small>
          </div>
        `
      }

      load()
    })
  }

  return ''
})
