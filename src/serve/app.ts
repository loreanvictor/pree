import Koa from 'koa'

import { files, FilesOptions } from './files'


export type AppOptions = FilesOptions


export function createApp(options?: AppOptions) {
  const app = new Koa()

  app.use(files(options))

  return app.callback()
}
