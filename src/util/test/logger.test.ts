import { LOG_LEVEL, createLogger } from '../logger'


describe(createLogger, () => {
  test('creates a logger that logs according to given log level.', () => {
    const err = jest.spyOn(console, 'error')
    const warn = jest.spyOn(console, 'warn')
    const info = jest.spyOn(console, 'log')
    const debug = jest.spyOn(console, 'debug')

    const logger = createLogger({ logLevel: LOG_LEVEL.WARN })

    logger.error('error')
    logger.warn('warn')
    logger.info('info')
    logger.debug('debug')
    logger.success('success')

    expect(err).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledTimes(0)
    expect(debug).toHaveBeenCalledTimes(0)

    jest.resetAllMocks()
  })

  test('it accepts a custom transport.', () => {
    const transport = {
      [LOG_LEVEL.ERROR]: jest.fn(),
      [LOG_LEVEL.WARN]: jest.fn(),
      [LOG_LEVEL.INFO]: jest.fn(),
      [LOG_LEVEL.DEBUG]: jest.fn(),
    }

    const logger = createLogger({ logLevel: LOG_LEVEL.DEBUG, logTransport: transport })

    logger.error('error')
    logger.warn('warn')
    logger.info('info')
    logger.debug('debug')

    expect(transport[LOG_LEVEL.ERROR]).toHaveBeenCalledTimes(1)
    expect(transport[LOG_LEVEL.ERROR]).toHaveBeenCalledTimes(1)
    expect(transport[LOG_LEVEL.WARN]).toHaveBeenCalledTimes(1)
    expect(transport[LOG_LEVEL.INFO]).toHaveBeenCalledTimes(1)
    expect(transport[LOG_LEVEL.DEBUG]).toHaveBeenCalledTimes(1)
  })

  test('default log leve should be silent.', () => {
    const err = jest.spyOn(console, 'error')
    const warn = jest.spyOn(console, 'warn')
    const info = jest.spyOn(console, 'log')
    const debug = jest.spyOn(console, 'debug')

    const logger = createLogger()

    logger.error('error')
    logger.warn('warn')
    logger.info('info')
    logger.debug('debug')
    logger.success('success')

    expect(err).toHaveBeenCalledTimes(0)
    expect(warn).toHaveBeenCalledTimes(0)
    expect(info).toHaveBeenCalledTimes(0)
    expect(debug).toHaveBeenCalledTimes(0)

    jest.resetAllMocks()
  })

  test('can log verbosely.', () => {
    const err = jest.spyOn(console, 'error')
    const warn = jest.spyOn(console, 'warn')
    const info = jest.spyOn(console, 'info')
    const debug = jest.spyOn(console, 'debug')

    const logger = createLogger({ logLevel: LOG_LEVEL.DEBUG })

    logger.error('error')
    logger.warn('warn')
    logger.info('info')
    logger.debug('debug')
    logger.success('success')

    expect(err).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledTimes(2)
    expect(debug).toHaveBeenCalledTimes(1)

    jest.resetAllMocks()
  })

  test('default log level is silent when transport is passed.', () => {
    expect(createLogger({ logTransport: {} }).level).toBe(LOG_LEVEL.SILENT)
  })

  test('assumes default if transport misses a function.', () => {
    const err = jest.spyOn(console, 'error')
    const transport = { [LOG_LEVEL.INFO]: jest.fn() }

    const logger = createLogger({ logLevel: LOG_LEVEL.DEBUG, logTransport: transport })

    logger.error('error')
    logger.info('log')

    expect(err).toHaveBeenCalledTimes(1)
    expect(transport[LOG_LEVEL.INFO]).toHaveBeenCalledTimes(1)

    jest.resetAllMocks()
  })

  test('can log with a name.', () => {
    const info = jest.spyOn(console, 'info')

    const logger = createLogger({ name: 'test', logLevel: LOG_LEVEL.INFO })

    logger.info('log')

    expect(info).toHaveBeenCalledWith(expect.stringMatching(/\[test\]/))

    jest.resetAllMocks()
  })
})
