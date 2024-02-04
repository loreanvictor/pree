import { define, currentNode, onFirstRender } from 'https://esm.sh/minicomp'
import { html, ref } from 'https://esm.sh/rehtm'


define('npm-badge', ({ package_name, label, design }) => {
  const host = currentNode()
  const name = ref()
  const badge = ref()

  const load = async () => {
    try {
      const res = await fetch(`${window.BUILD_ENV_API.baseURL}files/read/package.json`)
      const pkg = await res.json()
      update(pkg.name)
    } catch {
      host.remove()
    }
  }

  const update = pkgName => {
    name.current.textContent = pkgName

    const _label = encodeURIComponent(label ?? '')
    const _style = encodeURIComponent(design ?? 'normal')

    name.current.href = `https://www.npmjs.com/package/${pkgName}`
    badge.current.src = `https://img.shields.io/npm/v/${pkgName}.svg?label=${_label}&style=${_style}`
  }

  if (package_name) {
    update(package_name)
  } else {
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
    <a ref=${name} target="_blank">NPM</a>
    <img alt="npm" ref=${badge} />
  `
})
