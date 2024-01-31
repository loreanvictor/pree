import Koa from 'koa'

import { files, FilesOptions } from './files'
import { env, EnvOptions } from './env'


export type AppOptions = FilesOptions & EnvOptions

export function createApp(options?: AppOptions) {
  const app = new Koa()
  // TODO: add an option to disable env to better emulate production
  app.use(env(options))
  app.use(files(options))

  return app.callback()
}
