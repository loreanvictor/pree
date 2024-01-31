import Koa from 'koa'

import { files, FilesOptions } from './files'
import { env, EnvOptions } from './env'
import { createLogger, THEME } from '../util/logger'


export type AppOptions = FilesOptions & EnvOptions & {
  prod?: boolean
}

export function createApp(options?: AppOptions) {
  const app = new Koa()

  const logger = createLogger({ ...options, name: 'serve' })

  app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    logger.info(`${THEME.secondary(ctx.method)} ${THEME.highlight(ctx.url)} in ${ms}ms`)
  })

  if (!options || !options.prod) {
    app.use(env(options))
  }

  app.use(files(options))

  return app.callback()
}
