import { Server, OPEN } from 'ws'
import { FSWatcher, watch } from 'chokidar'

import { RunningServer, serve } from '../serve'
import { injector } from './injector'
import { ViewOptions } from './types'
import { _DefaultFilesOptions } from '../serve/files'
import { THEME, createLogger } from '../util/logger'


export interface RunningViewer extends RunningServer {
  ws?: Server,
  watcher?: FSWatcher,
}

export async function view(options: ViewOptions = {}): Promise<RunningViewer> {
  if (options.prod) {
    return await serve(options)
  } else {
    const root = options.root ?? _DefaultFilesOptions.root
    const logger = createLogger({ ...options, name: 'watch' })

    const running = await serve({
      ...options,
      loaders: [injector(options), ...(options?.loaders || [])],
    })

    const ws = new Server({ server: running.server })
    const watcher = watch(root).on('change', (path) => {
      logger.info('change in  ' + THEME.highlight(path) + ', reloading ...')
      ws.clients.forEach((client) => {
        if (client.readyState === OPEN) {
          client.send('reload')
        }
      })
    })

    logger.info('watching ' + THEME.highlight(root))

    return {
      ...running, ws, watcher,
      close: async () => {
        await Promise.all([
          running.close(),
          watcher.close(),
          ws.close(),
        ])
      }
    }
  }
}
