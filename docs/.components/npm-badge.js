import { define, onFirstRender, currentNode } from 'https://esm.sh/minicomp'
import { template, ref } from 'https://esm.sh/rehtm'


define('npm-badge', (params) => {
  const { pkg, design } = params
  const nolabel = params['no-label'] !== undefined
  const name = ref()
  const badge = ref()
  const slot = ref()
  const elem = currentNode()

  const load = async () => {
    const res = await fetch(`${window.BUILD_ENV_API.baseURL}files/read/package.json`)
    const pkg = await res.json()
    update(pkg.name)
  }

  const update = pkgName => {
    if (slot.current.assignedNodes().length === 0) {
      elem.append(pkgName)
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

  return template`
    <link rel="stylesheet" href="https://unpkg.com/nokss/dist/bundles/md.css" />
    <style>
      a:not([role]) {
        filter: none;
        color: var(--text-color);
      }
      img {
        vertical-align: middle;
        margin-left: 0.5rem;
      }
    </style>
    <a ref=${name} target="_blank">
      <slot ref=${slot} style=${nolabel ? 'display: none' : ''}>NPM</slot>
      <img alt="npm" ref=${badge} />
    </a>
  `
})
