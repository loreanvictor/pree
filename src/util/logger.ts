import chalk from 'chalk'


export const THEME = {
  error: chalk.hex('#FF6868').bold,
  warn: chalk.hex('#FFBB64'),
  highlight: chalk.hex('#9AD0C2').bold,
  secondary: chalk.hex('#2D9596'),
  shy: chalk.hex('#265073'),
  fade: chalk.hex('#424242'),
}

export const LOG_LEVEL = {
  SILENT: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
}

export interface LogTransport {
  [level: number]: (text: string) => void,
}

const CONSOLE = {
  [LOG_LEVEL.ERROR]: console.error,
  [LOG_LEVEL.WARN]: console.warn,
  [LOG_LEVEL.INFO]: console.info,
  [LOG_LEVEL.DEBUG]: console.debug,
}

export interface LoggerOptions {
  name?: string,
  logLevel?: number,
  logTransport?: LogTransport,
}

const _DefaultOptions = {
  logLevel: LOG_LEVEL.SILENT,
  logTransport: CONSOLE,
}

export interface Logger {
  level: number,
  log: (text: string, loglevel?: number) => void
  error: (text: string) => void
  warn: (text: string) => void
  info: (text: string) => void
  debug: (text: string) => void,
  success: (text: string) => void,
}

export function createLogger(options: LoggerOptions = _DefaultOptions): Logger {
  const name = options?.name
  const level = options?.logLevel ?? _DefaultOptions.logLevel
  const transport = (l: number) => transport[l] ?? _DefaultOptions.logTransport[l]

  const format = (text: string) => name ? THEME.shy(`[${name}]`) + ' ' + text : text
  const log = (text: string, loglevel = LOG_LEVEL.INFO) => {
    if (loglevel <= level) {
      transport(loglevel)(format(text))
    }
  }

  return {
    level,
    log,
    error: (text: string) => log('❌ ' + THEME.error(text), LOG_LEVEL.ERROR),
    warn: (text: string) => log(THEME.warn(text), LOG_LEVEL.WARN),
    info: (text: string) => log(text, LOG_LEVEL.INFO),
    debug: (text: string) => log(THEME.shy(text), LOG_LEVEL.DEBUG),
    success: (text: string) => log('✅ ' + THEME.secondary(text), LOG_LEVEL.INFO),
  }
}
