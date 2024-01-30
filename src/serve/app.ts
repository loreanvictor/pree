import Koa from 'koa'

import { files, FilesOptions } from './files'
import { env, EnvOptions } from './env'


export type AppOptions = FilesOptions & EnvOptions

export function createApp(options?: AppOptions) {
  const app = new Koa()
  app.use(env(options))
  app.use(files(options))

  return app.callback()
}
