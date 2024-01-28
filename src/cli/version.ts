import { gt } from 'semver'

import { createLogger, LoggerOptions, THEME } from '../util/logger'
import { LOGO } from './logo'


export type VersionOptions = LoggerOptions

export async function version(options?: VersionOptions) {
  const logger = createLogger(options)
  const local = process.env['npm_package_version']

  logger.info(LOGO)
  logger.info('🏠 installed: ' + THEME.highlight(local))

  try {
    const { $ } = await (Function('return import("execa")'))()
    const remote = (await $`npm view pree version`).stdout.trim()
    logger.info('🌍 latest:    ' + THEME.highlight(remote))

    if (gt(remote, local!)) {
      logger.warn('there is a newer version available.')
      logger.warn('run ' + THEME.secondary('npm i -g pree@latest') + ' to update.')
    }

  } catch (error) {
    logger.warn('could not fetch the latest version.')
  }
}
