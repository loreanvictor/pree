import Koa from 'koa'
import ms from 'ms'

import { files, FilesOptions } from './files'
import { env, EnvOptions } from './env'
import { createLogger, THEME } from '../util/logger'
import { base } from './base'


export type AppOptions = FilesOptions & EnvOptions & {
  prod?: boolean
  injectBase?: boolean
}

export function createApp(options?: AppOptions) {
  const app = new Koa()

  const logger = createLogger({ ...options, name: 'serve' })

  app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    logger.info(`${THEME.secondary(ctx.method)} ${THEME.highlight(ctx.url)} in ${ms(Date.now() - start)}`)
  })

  if (!options || !options.prod) {
    app.use(env(options))
  }

  if (options?.injectBase) {
    app.use(base(options))
  }

  app.use(files(options))

  return app.callback()
}
