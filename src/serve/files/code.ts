import { extname, relative } from 'path'
import { readFile } from 'fs/promises'

import { STYLES } from './style'
import { linkedPath } from './linked-path'


const EXTENSIONS = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.jsx': 'javascript',
  '.go': 'go',
  '.py': 'python',
  '.rs': 'rust',
  '.c': 'c',
  '.cpp': 'cpp',
  '.h': 'cpp',
  '.hpp': 'cpp',
  '.java': 'java',
  '.php': 'php',
  '.rb': 'ruby',
  '.sh': 'bash',
  '.swift': 'swift',
  '.json': 'json',
  '.md': 'markdown',
}


export function isCode(path: string) {
  const ext = extname(path)

  return ext in EXTENSIONS
}


export async function renderCode(path: string, root: string) {
  const content = await readFile(path, 'utf8')
  const rel = relative(root, path)
  const ext = extname(path)

  return {
    type: '.html',
    content: `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${rel}</title>
          <link rel="stylesheet"href="https://unpkg.com/nokss" />
          <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/default.min.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css" />
          <script src="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js"></script>
          <style>
            ${STYLES}
            pre {
              padding: 1rem;
            }
          </style>
        </head>
        <body>
          <main>
            <br><br>
            <h4>${linkedPath('/' + rel)}</h4>
            <pre><code class="${EXTENSIONS[ext]}"
              >${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </code></pre>
          </main>
          <script>
            hljs.highlightAll();
          </script>
        </body>
      </html>
  `
  }
}
