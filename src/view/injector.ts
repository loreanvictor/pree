import { load } from 'cheerio'

import { Loader } from '../serve/files/loader'
import { match } from '../util/file-match'
import { ViewOptions } from './types'
import { _DefaultServeOptions } from '../serve'


export function injector(options: ViewOptions = {}): Loader {
  return async (ctx, next) => {
    const res = await next()
    const port = options.port ?? _DefaultServeOptions.port

    if (
      (res.type === '.html' || res.type === 'text/html')
      && (!res.status || res.status === 200)
      && match(ctx.path, options)
    ) {
      const $ = load(res.content)

      $('body').append(`
        <script>
          if (!window.__autoReloadConnected) {
            window.__autoReloadConnected = true
            const socket = new WebSocket('ws://localhost:${port}')
            socket.addEventListener('open', () => {
              console.log('Connected to Auto Reload')
            })
            socket.addEventListener('message', () => window.location.reload())
          }
        </script>
      `)

      res.content = $.html()
    }

    return res
  }
}
