
import { basename, extname, join } from 'path'

import { build } from '../build'
import { serve } from '../serve'
import { LOG_LEVEL, THEME, createLogger } from '../util/logger'
import { version } from './version'
import { help } from './help'
import { Command, Options } from './types'
import { LOGO } from './logo'


export async function main(command: Command, options: Options) {
  const logLevel = options.logLevel ?? LOG_LEVEL.INFO
  const logger = createLogger({ logLevel })

  logger.info(LOGO)

  if (command === 'build') {
    const src = options.src
    const dest = options.dest


    if (!src) {
      logger.error('missing source path')
      logger.info(
        THEME.secondary('👉 pree build <src> <dest> \n\n') +
        'Run ' + THEME.highlight('pree help') + ' for more information.'
      )
      throw new Error('missing source path')
    }

    if (!dest) {
      logger.error('missing destination path')
      logger.info(
        THEME.secondary('👉 pree build <src> <dest> \n\n') +
        'Run ' + THEME.highlight('pree help') + ' for more information.'
      )
      throw new Error('missing destination path')
    }

    if (!extname(src)) {
      await build({ ...options, dir: src, target: dest })
    } else {
      await build({
        ...options,
        file: src,
        target: extname(dest) ? dest : join(dest, basename(src)),
      })
    }
  } else if (command === 'view') {
    await serve(options)
  } else if (command === 'version') {
    await version(options)
  } else {
    await help(options)
  }
}
