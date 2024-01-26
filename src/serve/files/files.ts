import chalk from 'chalk'
import { join } from 'path'
import mime from 'mime'
import { Context, Next } from 'koa'
import { access, readFile } from 'fs/promises'

import { isDirectory, renderDirectory } from './dir'
import { isCode, renderCode } from './code'
import { isNotFound, renderNotFound } from './notfound'


export interface FilesOptions {
  root?: string
}


const _DefaultOptions = {
  root: process.cwd()
}


export function files(options?: FilesOptions) {
  const root = options?.root || _DefaultOptions.root

  return async (ctx: Context, next: Next) => {
    if (ctx.method === 'GET') {
      const target = '.' + ctx.path
      console.log('requested: ' + chalk.blueBright(target))

      // TODO: add plugins for processing HTML files

      try {
        const path = join(root, target)

        if (await isNotFound(path)) {
          const { type, content } = await renderNotFound(path, root)
          ctx.type = type
          ctx.body = content
          ctx.status = 404

          console.log('❌ ' + chalk.redBright('not found: ') + chalk.blueBright(target))
        } else if (await isDirectory(path)) {
          if (path.endsWith('/')) {
            try {
              const htmlpath = join(path, 'index.html')
              await access(htmlpath)
              ctx.type = mime.getType(htmlpath) || 'text/plain'
              ctx.body = await readFile(htmlpath)

              return
            } catch { /* ... */}
          }

          const { type, content } = await renderDirectory(path, root)
          ctx.type = type
          ctx.body = content
        } else if (isCode(path)) {
          const { type, content } = await renderCode(path, root)
          ctx.type = type
          ctx.body = content
        } else {
          ctx.type = mime.getType(path) || 'text/plain'
          ctx.body = await readFile(path)
        }
      } catch (err) {
        console.log('❌ ' + chalk.redBright('cannot load: ') + chalk.blueBright(target))
        console.log('❌ ' + chalk.red((err as Error).message))
        ctx.body = 'Something went terribly wrong.'
        ctx.status = 500
      }
    } else {
      await next()
    }
  }
}
