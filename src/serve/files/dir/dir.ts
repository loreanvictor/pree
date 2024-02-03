import { lstat, readdir } from 'fs/promises'
import { relative, join } from 'path'
import { filesize } from 'filesize'

import { linkedPath } from './linked-path'
import { fileIcon } from './icon'
import { STYLES, FOOTER } from '../style'
import { Loader } from '../loader'
import { exists, isDirectory } from '../util'


const filestyle = (file: string) => `opacity: ${(file.startsWith('.') || file === 'node_modules') ? '.2' : '1'};`

async function renderDirectory(path: string, root: string, base: string) {
  const files = await readdir(path)
  const rel = relative(root, path)

  const subdirs: string[] = []
  const subfiles: [string, number][] = []

  for (const file of files) {
    const stat = await lstat(join(path, file))
    if (stat.isDirectory()) {
      subdirs.push(file)
    } else {
      subfiles.push([file, stat.size])
    }
  }

  return {
    type: '.html',
    content: `
    <html>
      <head>
        <title>${rel}</title>
        <link rel="stylesheet"href="https://unpkg.com/nokss" />
        <link rel="stylesheet" href="https://unpkg.com/graphis/font/graphis.css">
        <style>
        ${STYLES}
        i {
          font-family: 'graphis', sans-serif;
          font-style: normal;
          font-size: 1.2em;
          margin-right: .5em;
        }
        li:after {
          content: '';
          display: block;
          height: 1px;
          background: var(--text-color);
          opacity: var(--border-expression);
        }
        </style>
      </head>
      <body>
        <main>
          <br><br>
          <h4>${linkedPath(base + '/' + rel)}</h4>
          <ul role="tree">
            ${subdirs.map(file => `
              <li role="treeitem" style="${filestyle(file)}">
                <a href="${'/' + join(base, rel, file)}"><i style="opacity: .7">📁</i> ${file}</a>
              </li>
            `).join('\n')}
            ${subfiles.map(([file, size]) => `
            <li role="treeitem" style="${filestyle(file)}">
              <a href="${'/' + join(base, rel, file)}"><i style="opacity: .2">${fileIcon(file)}</i> ${file}</a>
              <small style="float: right; opacity: calc(var(--border-expression) * 2)">${filesize(size)}</small>
            </li>
          `).join('\n')}
          </ul>
          ${FOOTER}
        </main>
      </body>
    </html>
    `
  }
}

export const dir: Loader = async (ctx, next) => {
  if (await exists(ctx.path) && await isDirectory(ctx.path)) {
    return renderDirectory(ctx.path, ctx.root, ctx.base)
  }

  return await next()
}
