import WebSocket, { WebSocketServer } from 'ws'
import { watch } from 'chokidar'

import { serve } from '../serve'
import { injector } from './injector'
import { ViewOptions } from './types'
import { _DefaultFilesOptions } from '../serve/files'
import { THEME, createLogger } from '../util/logger'


export async function view(options?: ViewOptions) {
  if (options?.prod) {
    await serve(options)
  } else {
    const root = options?.root ?? _DefaultFilesOptions.root
    const logger = createLogger({ ...options, name: 'watch' })

    const running = await serve({
      ...options,
      loaders: [injector(options), ...(options?.loaders || [])],
    })

    const ws = new WebSocketServer({ server: running.server })
    watch(root).on('change', (path) => {
      logger.info('change in  ' + THEME.highlight(path) + ', reloading ...')
      ws.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send('reload')
        }
      })
    })

    logger.info('watching ' + THEME.highlight(root))
  }
}
