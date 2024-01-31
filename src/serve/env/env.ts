import { Context, Next } from 'koa'
import { LoggerOptions, THEME, createLogger } from '../../util/logger'
import { isCustomResponse, router } from './router'
import { fs } from './fs'
import { git } from './git'
import { vars } from './vars'
import { els } from '../../util/ensure-slash'


export type EnvOptions = LoggerOptions

export function env(options?: EnvOptions) {
  const logger = createLogger({ ...options, name: '@env.' })
  const handle = router({
    '/files/': fs,
    '/git/': git,
    '/vars/': vars,
  })

  return async (ctx: Context, next: Next) => {
    if (ctx.method === 'GET' && ctx.path.startsWith('/@env')) {
      const path = ctx.path.slice(5)
      logger.debug('requested: ' + THEME.highlight('@env' + els(path)))

      try {
        const res = await handle(path)
        if (isCustomResponse(res)) {
          ctx.type = res.type
          ctx.status = res.status ?? 200
          ctx.body = res.body
        } else {
          ctx.type = 'application/json'
          ctx.body = JSON.stringify(res)
        }

      } catch(err) {
        ctx.status = 404
        ctx.body = (err as Error).message
        logger.error((err as Error).message)
      }
    } else {
      await next()
    }
  }
}
