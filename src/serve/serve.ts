import { createServer } from 'http'
import chalk from 'chalk'

import { createApp, AppOptions } from './app'


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

    const app = createApp(options)

    const server = createServer(app).listen(port, () => {
      console.log('listening on port ' + chalk.green(port))
      resolve({
        port,
        close: async () => { await server.close() },
      })
    })
  })
}


