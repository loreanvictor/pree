
import { basename, extname, join } from 'path'

import { build } from '../build'
import { serve } from '../serve'
import { LOG_LEVEL, createLogger } from '../util/logger'


export type Command = 'build' | 'serve' | 'help' | 'version'
export interface Options {
  src?: string,
  dest?: string,
  logLevel?: number,
}

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
  } else if (command === 'serve') {
    await serve({ logLevel })
  } else if (command === 'help') {
    // TODO: print help
  } else if (command === 'version') {
    // TODO: print version
  }
}
