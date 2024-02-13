import { Context, Next } from 'koa'
import { load } from 'cheerio'

import { COLORS, LoggerOptions, THEME, createLogger } from '../../util/logger'
import { isCustomResponse, router } from './router'
import { fs } from './fs'
import { git } from './git'
import { vars } from './vars'
import { ets, els } from '../../util/ensure-slash'
import { conf } from './conf'
import { myVersion } from '../../util/my-version'
import { FilterFilesOptions, match } from '../../util/file-match'


export type EnvOptions = LoggerOptions & FilterFilesOptions & {
  buildEnvPrefix?: string,
}

const _DefaultOptions = {
  buildEnvPrefix: '@env',
}

export function env(options: EnvOptions = {}) {
  const prefix = options.buildEnvPrefix ?? _DefaultOptions.buildEnvPrefix
  const slashed = els(ets(prefix))
  const logger = createLogger({ ...options, name: '@env.' })
  const handle = router({
    '/files/': fs,
    '/git/': git,
    '/vars/': vars,
    '/conf/': conf(options),
  })

  logger.info('env APIs available on ' + THEME.highlight(slashed))

  return async (ctx: Context, next: Next) => {
    if (ctx.method === 'GET' && ctx.path.startsWith(slashed)) {
      const path = ctx.path.slice(slashed.length)
      logger.debug('requested: ' + THEME.highlight('@env' + els(path)))

      try {
        const res = await handle(path)
        if (isCustomResponse(res)) {
          ctx.type = res.type
          ctx.status = res.status
          ctx.body = res.body
        } else {
          ctx.type = 'application/json'
          ctx.body = JSON.stringify(res)
        }

      } catch(err: any) {
        ctx.status = err.status ?? 500
        ctx.body = err.message
        logger.error(err.message)
      }
    } else {
      await next()

      if (ctx.type?.match(/html/) && match(ctx.path, options)) {
        const $ = load(ctx.body as string)
        $('head').append(`
          <script build-only>
            window.BUILD_ENV_API = {
              provider: 'pree@${myVersion()}',
              baseURL: '${slashed}',
            }

            console.log(
              '%cbuild environment APIs available.',
              'color: ${COLORS.highlight}'
            )
          </script>
        `)
        ctx.body = $.html()
      }
    }
  }
}
