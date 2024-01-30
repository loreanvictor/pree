import { join } from 'path'
import { Context, Next } from 'koa'
import { access } from 'fs/promises'

import { LoggerOptions, createLogger, THEME } from '../../util/logger'
import { isDirectory, renderDirectory } from './dir'
import { isNotFound, renderNotFound } from './notfound'
import { read } from './file'


export interface FilesOptions extends LoggerOptions {
  root?: string,
  namespace?: string,
}

const _DefaultOptions = {
  root: process.cwd()
}

export function files(options?: FilesOptions) {
  const root = options?.root || _DefaultOptions.root
  const namespace = options?.namespace ?? ''
  const logger = createLogger({ ...options, name: 'files' })

  return async (ctx: Context, next: Next) => {
    if (ctx.method === 'GET' && ctx.path.startsWith('/' + namespace)) {
      const target = ctx.path.slice(namespace.length + 1)
      logger.log('requested: ' + THEME.highlight('/' + target))

      const loadfile = async (path: string) => {
        const { type, content } = await read(path)
        ctx.type = type
        ctx.body = content
      }

      try {
        const path = join(root, target)

        if (await isNotFound(path)) {
          if (!ctx.path.endsWith('/')) {
            try {
              const htmlpath = path + '.html'
              logger.debug('trying: ' + htmlpath)
              await access(htmlpath)
              await loadfile(htmlpath)

              return
            } catch { /* ... */ }
          }

          const { type, content } = await renderNotFound(path, root)
          ctx.type = type
          ctx.body = content
          ctx.status = 404

          logger.error('not found: ' + THEME.highlight(target))
        } else if (await isDirectory(path)) {
          if (ctx.path.endsWith('/')) {
            try {
              const htmlpath = join(path, 'index.html')
              logger.debug('trying: ' + htmlpath)
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
        logger.error('cannot load: ' + THEME.highlight(target))
        logger.error((err as Error).message)
        ctx.body = 'Something went terribly wrong.'
        ctx.status = 500
      }
    } else {
      await next()
    }
  }
}
