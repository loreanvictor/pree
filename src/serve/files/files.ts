import chalk from 'chalk'
import { join } from 'path'
import { Context, Next } from 'koa'
import { access, readFile } from 'fs/promises'

import { mimetype } from './types'
import { isDirectory, renderDirectory } from './dir'
import { isNotFound, renderNotFound } from './notfound'


export interface FilesOptions {
  root?: string,
  namespace?: string,
}


const _DefaultOptions = {
  root: process.cwd()
}


export function files(options?: FilesOptions) {
  const root = options?.root || _DefaultOptions.root
  const namespace = options?.namespace ?? ''

  return async (ctx: Context, next: Next) => {
    if (ctx.method === 'GET' && ctx.path.startsWith('/' + namespace)) {
      const target = ctx.path.slice(namespace.length + 1)
      console.log('requested: ' + chalk.blueBright(target))

      const loadfile = async (path: string) => {
        // TODO: add plugins for processing HTML files
        ctx.type = mimetype(path)
        ctx.body = await readFile(path)
      }

      try {
        const path = join(root, target)

        if (await isNotFound(path)) {
          if (!ctx.path.endsWith('/')) {
            try {
              const htmlpath = path + '.html'
              await access(htmlpath)
              await loadfile(htmlpath)

              return
            } catch { /* ... */ }
          }

          const { type, content } = await renderNotFound(path, root)
          ctx.type = type
          ctx.body = content
          ctx.status = 404

          console.log('❌ ' + chalk.redBright('not found: ') + chalk.blueBright(target))
        } else if (await isDirectory(path)) {
          if (ctx.path.endsWith('/')) {
            try {
              const htmlpath = join(path, 'index.html')
              await access(htmlpath)
              await loadfile(htmlpath)

              return
            } catch { /* ... */ }
          }

          const { type, content } = await renderDirectory(path, root, namespace)
          ctx.type = type
          ctx.body = content
        } else {
          await loadfile(path)
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
