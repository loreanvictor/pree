import { createServer, Server } from 'http'

import { createApp, AppOptions } from './app'
import { createLogger, THEME } from '../util/logger'


export interface ServeOptions extends AppOptions {
  port?: number
}

export const _DefaultServeOptions = {
  port: 3000
}

export interface RunningServer {
  port: number
  server: Server
}

export function serve(options?: ServeOptions) {
  return new Promise<RunningServer>((resolve) => {
    const port = options?.port || _DefaultServeOptions.port
    const logger = createLogger({ ...options, name: 'serve' })
    const app = createApp(options)

    const server = createServer(app).listen(port, () => {
      logger.log('server up on ' + THEME.secondary('http://localhost:' + port))
      resolve({
        port,
        server,
      })
    })
  })
}
