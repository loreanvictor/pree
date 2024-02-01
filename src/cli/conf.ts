import { readFile } from 'fs/promises'
import { parse } from 'yaml'

import { LoggerOptions, createLogger } from '../util/logger'


export interface ConfigOptions extends LoggerOptions {
  config?: string
}

const _DefaultOptions = {
  config: '.pree.yml'
}

export async function conf(options?: ConfigOptions) {
  const { config } = { ..._DefaultOptions, ...options }

  const logger = createLogger({ ...options, name: 'conf.' })

  try {
    logger.debug(`reading config file: ${config}`)
    const file = await readFile(config, 'utf8')
    const parsed = parse(file)

    return parsed
  } catch (error) {
    logger.debug(`config file not found: ${config}`)

    return {}
  }
}
