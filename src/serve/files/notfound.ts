import { access } from 'fs/promises'
import { relative } from 'path'
import { STYLES } from './style'


export async function isNotFound(path: string) {
  try {
    await access(path)

    return false
  } catch {
    return true
  }
}


export async function renderNotFound(path: string, root: string) {
  const rel = relative(root, path)

  return {
    type: '.html',
    content: `
      <html>
        <head>
          <title>404 Not Found</title>
          <link rel="stylesheet"href="https://unpkg.com/nokss" />
          <style>
          ${STYLES}
          </style>
        </head>
        <body>
          <br><br><br><br><br>
          <main>
            <h1>Not Found (404)</h1>
            <p>Cannot find <code>/${rel}</code>, perhaps there is something wrong with the path? Go back to the root of the project and explore all the folders to identify what has gone wrong.</p>
            <hr/>
            <menu role="group" align="right">
              <a role="button" href="/">Go Back</a>
            </menu>
          </main>
        </body>
      </html>
    `
  }
}
