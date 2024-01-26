import { lstat, readdir } from 'fs/promises'
import { relative, join } from 'path'
import { filesize } from 'filesize'

import { linkedPath } from './linked-path'
import { fileIcon } from './icon'
import { STYLES, FOOTER } from './style'


export async function isDirectory(path: string) {
  return (await lstat(path)).isDirectory()
}



export async function renderDirectory(path: string, root: string) {
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
          opacity: .5;
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
          <h4>${linkedPath('/' + rel)}</h4>
          <ul role="tree">
            ${subdirs.map(file => `
              <li role="treeitem">
                <a href="${'/' + join(rel, file)}"><i>📁</i> ${file}</a>
              </li>
            `).join('\n')}
            ${subfiles.map(([file, size]) => `
            <li role="treeitem">
              <a href="${'/' + join(rel, file)}"><i>${fileIcon(file)}</i> ${file}</a>
              <small style="float: right; opacity: calc(var(--border-expression) * 3)">${filesize(size)}</small>
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
