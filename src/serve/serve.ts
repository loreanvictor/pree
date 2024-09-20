import { createServer, Server } from 'http'
import { AddressInfo } from 'net'

import { createApp, AppOptions } from './app'
import { createLogger, THEME } from '../util/logger'
import { els } from '../util/ensure-slash'


export interface ServeOptions extends AppOptions {
  port?: number | undefined
}

export interface RunningServer {
  port: number
  server: Server
  url: string
  close: () => Promise<void>
}

export function serve(options: ServeOptions = {}) {
  return new Promise<RunningServer>((resolve) => {
    const port = options?.port
    const logger = createLogger({ ...options, name: 'serve' })
    const app = createApp(options)

    const server = createServer(app).listen(port, () => {
      const addr = server.address() as AddressInfo
      const url = `http://localhost:${addr.port}` + (options.base ? els(options.base) : '') + '/'
      logger.info('server up on ' + THEME.secondary(url))

      resolve({
        port: addr.port,
        url,
        server,
        close: async () => { await server.close() }
      })
    })
  })
}
