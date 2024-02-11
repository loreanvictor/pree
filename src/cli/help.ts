import { LoggerOptions, THEME, createLogger } from '../util/logger'


export type HelpOptions = LoggerOptions

export async function help(options: HelpOptions = {}) {
  const logger = createLogger(options)
  logger.info(
    'builds static websites with web components. \n' +
    '👉 usage: \n' +
    THEME.secondary('   pree view <dir>\n') +
    THEME.secondary('   pree build <src> <dest>\n\n') +
    '🎛️  options: \n' +
    THEME.secondary('   -p, --port <port>\n') +
    THEME.secondary('   -P, --prod\n') +
    THEME.secondary('   -r, --root <dir>\n') +
    THEME.secondary('   -V, --verbose\n') +
    THEME.secondary('   -S, --silent\n') +
    THEME.secondary('   -b, --base <path>\n') +
    THEME.secondary('   -i, --include <glob>\n') +
    THEME.secondary('   -e, --exclude <glob>\n') +
    THEME.secondary('   -c, --config <config file>\n\n') +
    '📖 Read more at ' + THEME.highlight('https://loreanvictor.github.io/pree')
  )
}
