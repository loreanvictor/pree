import search from 'libnpmsearch'
import { gt } from 'semver'

import { createLogger, LoggerOptions, THEME } from '../util/logger'
import { myVersion } from '../util/my-version'


export type VersionOptions = LoggerOptions

export async function version(options?: VersionOptions) {
  const logger = createLogger(options)
  const local = myVersion()

  logger.info('🏠 installed: ' + THEME.highlight(local))

  try {
    const remote = (await search('pree', { limit: 1 }))[0]!.version
    logger.info('🌍 latest:    ' + THEME.highlight(remote))

    if (gt(remote, local!)) {
      logger.warn('there is a newer version available.')
      logger.warn('run ' + THEME.secondary('npm i -g pree@latest') + ' to update.')
    }

  } catch (error) {
    logger.warn('could not fetch the latest version.')
  }
}
