import { readFile } from 'fs/promises'
import { parse } from 'yaml'

import { LOG_LEVEL, LoggerOptions, createLogger } from '../util/logger'
import { earr } from '../util/ensure-array'


export interface ConfigOptions extends LoggerOptions {
  config?: string
}

const _DefaultOptions = {
  config: '.pree.yml'
}

export async function conf(options?: ConfigOptions) {
  const config = options?.config ?? _DefaultOptions.config

  const logger = createLogger({ ...options, name: 'conf.' })

  try {
    logger.debug(`reading config file: ${config}`)
    const file = await readFile(config, 'utf8')
    const parsed = parse(file)

    parsed.include = parsed.include ? earr(parsed.include) : undefined
    parsed.exclude = parsed.exclude ? earr(parsed.exclude) : undefined
    parsed.logLevel = (
      parsed.logLevel === 'debug'? LOG_LEVEL.DEBUG :
        parsed.logLevel === 'info' ? LOG_LEVEL.INFO :
          parsed.logLevel === 'warn' ? LOG_LEVEL.WARN :
            parsed.logLevel === 'error' ? LOG_LEVEL.ERROR :
              parsed.logLevel === 'silent' ? LOG_LEVEL.SILENT :
                parsed.logLevel
    )

    parsed.injectBase = parsed['inject base']

    return parsed
  } catch (error) {
    logger.debug(`config file not found: ${config}`)

    return {}
  }
}
