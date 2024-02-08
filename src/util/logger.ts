import chalk from 'chalk'

export const COLORS = {
  error: '#FF6868',
  warn: '#FFBB64',
  highlight: '#9AD0C2',
  secondary: '#2D9596',
  shy: '#265073',
  fade: '#424242',
}

export const THEME = {
  error: chalk.hex(COLORS.error).bold,
  warn: chalk.hex(COLORS.warn),
  highlight: chalk.hex(COLORS.highlight).bold,
  secondary: chalk.hex(COLORS.secondary),
  shy: chalk.hex(COLORS.shy),
  fade: chalk.hex(COLORS.fade),
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
  [LOG_LEVEL.ERROR]: (...args) => console.error(...args),
  [LOG_LEVEL.WARN]: (...args) => console.warn(...args),
  [LOG_LEVEL.INFO]: (...args) => console.info(...args),
  [LOG_LEVEL.DEBUG]: (...args) => console.debug(...args),
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
  error: (text: string) => void
  warn: (text: string) => void
  info: (text: string) => void
  debug: (text: string) => void,
  success: (text: string) => void,
}

export function createLogger(options: LoggerOptions = _DefaultOptions): Logger {
  const name = options.name
  const level = options.logLevel ?? _DefaultOptions.logLevel
  const logTransport = options.logTransport ?? _DefaultOptions.logTransport
  const transport = (l: number) => logTransport[l] ?? _DefaultOptions.logTransport[l]!

  const format = (text: string) => name ? THEME.shy(`[${name}]`) + ' ' + text : text
  const log = (text: string, loglevel) => {
    if (loglevel <= level) {
      transport(loglevel)(format(text))
    }
  }

  return {
    level,
    error: (text: string) => log('❌ ' + THEME.error(text), LOG_LEVEL.ERROR),
    warn: (text: string) => log(THEME.warn(text), LOG_LEVEL.WARN),
    info: (text: string) => log(text, LOG_LEVEL.INFO),
    debug: (text: string) => log(THEME.shy(text), LOG_LEVEL.DEBUG),
    success: (text: string) => log('✅ ' + text, LOG_LEVEL.INFO),
  }
}
