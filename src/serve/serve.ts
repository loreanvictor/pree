import { createServer } from 'http'

import { createApp, AppOptions } from './app'
import { createLogger, THEME } from '../util/logger'


export interface ServeOptions extends AppOptions {
  port?: number
}


export const _DefaultOptions = {
  port: 3000
}


export interface Server {
  port: number
  close: () => Promise<void>
}


export function serve(options?: ServeOptions) {
  return new Promise<Server>((resolve) => {
    const port = options?.port || _DefaultOptions.port
    const logger = createLogger({ ...options, name: 'serve' })
    const app = createApp(options)

    const server = createServer(app).listen(port, () => {
      logger.log('server up on ' + THEME.secondary('http://localhost:' + port))
      resolve({
        port,
        close: async () => { await server.close() },
      })
    })
  })
}
