import { join } from 'path'
import { Context, Next } from 'koa'

import { LoggerOptions, createLogger, THEME } from '../../util/logger'
import { dir } from './dir'
import { notFound } from './notfound'
import { file } from './file'
import { Loader, run } from './loader'
import { ele, els } from '../../util/ensure-slash'


export interface FilesOptions extends LoggerOptions {
  root?: string,
  base?: string,
  loaders?: Loader[]
}

export const _DefaultFilesOptions = {
  root: process.cwd()
}

export function files(options?: FilesOptions) {
  const root = options?.root || _DefaultFilesOptions.root
  const base = options?.base ?? ''
  const logger = createLogger({ ...options, name: 'files' })
  const loader = run(...(options?.loaders ?? []), file, dir, notFound)

  return async (ctx: Context, next: Next) => {
    if (ctx.method === 'GET' && ctx.path.startsWith('/' + base)) {
      const target = ctx.path.slice(base.length + 1)
      logger.debug('requested: ' + THEME.highlight(els(target)))

      const path = ctx.path === '/' ? ele(join(root, target)) : join(root, target)

      try {
        const { type, content, status } = await loader({ path, root, base, logger })
        ctx.type = type
        ctx.body = content
        ctx.status = status ?? 200
      } catch(error) {
        logger.error((error as Error).message)
        ctx.body = 'Something went terribly wrong.'
        ctx.status = 500
      }
    } else {
      await next()
    }
  }
}
