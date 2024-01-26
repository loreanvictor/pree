import { createServer } from 'http'
import chalk from 'chalk'

import { createApp, AppOptions } from './app'


export interface ServeOptions extends AppOptions {
  port?: number
}


export const _DefaultOptions = {
  port: 3000
}


export async function serve(options?: ServeOptions) {
  const port = options?.port || _DefaultOptions.port

  const app = createApp(options)

  createServer(app).listen(port, () => {
    console.log('listening on port ' + chalk.green(port))
  })
}


