import { define, onFirstRender } from 'https://esm.sh/minicomp'
import { html, ref } from 'https://esm.sh/rehtm'


define('npm-badge', ({ pkg, design }) => {
  const name = ref()
  const badge = ref()
  const slot = ref()

  const load = async () => {
    try {
      const res = await fetch(`${window.BUILD_ENV_API.baseURL}files/read/package.json`)
      const pkg = await res.json()
      update(pkg.name)
    } catch {
      /** **/
    }
  }

  const update = pkgName => {
    if (slot.current.assignedNodes().length === 0) {
      name.current.textContent = pkgName
    }

    const _style = encodeURIComponent(design ?? 'normal')

    name.current.href = `https://www.npmjs.com/package/${pkgName}`
    badge.current.src = `https://img.shields.io/npm/v/${pkgName}.svg?label=&style=${_style}`
  }

  if (pkg) {
    update(pkg)
  } else if (window.BUILD_ENV_API) {
    onFirstRender(() => load())
  }

  return html`
    <link rel="stylesheet" href="https://unpkg.com/nokss/dist/bundles/md.css" />
    <style>
      img {
        vertical-align: middle;
        margin-left: 0.5rem;
      }
    </style>
    <a ref=${name} target="_blank"><slot ref=${slot}>NPM</slot></a>
    <img alt="npm" ref=${badge} />
  `
})
