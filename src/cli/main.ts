
import { basename, extname, join } from 'path'

import { build } from '../build'
import { serve } from '../serve'
import { LOG_LEVEL, createLogger } from '../util/logger'
import { version } from './version'
import { help } from './help'
import { Command, Options } from './types'


export async function main(command: Command, options: Options) {
  const logLevel = options.logLevel ?? LOG_LEVEL.INFO

  if (command === 'build') {
    const src = options.src
    const dest = options.dest

    const logger = createLogger({ logLevel })

    if (!src) {
      logger.error('missing source path')
      throw new Error('missing source path')
    }

    if (!dest) {
      logger.error('missing destination path')
      throw new Error('missing destination path')
    }

    if (!extname(src)) {
      await build({ dir: src, target: dest, logLevel })
    } else {
      await build({
        file: src,
        target: extname(dest) ? dest : join(dest, basename(src)),
        logLevel,
      })
    }
  } else if (command === 'view') {
    await serve({ logLevel, root: options.src })
  } else if (command === 'version') {
    await version({ logLevel })
  } else {
    await help({ logLevel })
  }
}
