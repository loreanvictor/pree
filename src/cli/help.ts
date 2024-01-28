import { LoggerOptions, THEME, createLogger } from '../util/logger'
import { LOGO } from './logo'


export type HelpOptions = LoggerOptions

export async function help(options: HelpOptions = {}) {
  const logger = createLogger(options)
  logger.info(LOGO)
  logger.info(
    'builds static websites with web components. \n' +
    '👉 usage: \n' +
    THEME.secondary('   pree view <dir>\n') +
    THEME.secondary('   pree build <src> <dest>\n\n') +
    '📖 Read more at ' + THEME.highlight('https://github.com/loreanvictor/pree')
  )
}
