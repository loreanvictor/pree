import { join } from 'path'

import { conf } from '../conf'
import { LOG_LEVEL } from '../../util/logger'


describe(conf, () => {
  test('reads conf file.', async () => {
    const config = await conf()
    expect(config.src).toBe('docs')
  })

  test('auto arrays include and exclude fileds.', async () => {
    const config = await conf({config: join(__dirname, '__fixture__', 'conf', 'conf-include.yml')})
    expect(config.include).toEqual(['stuff'])
    expect(config.exclude).toEqual(['other', 'things'])
  })

  test('gracefully skips not finding config file.', async () => {
    const config = await conf({config: 'non-existent.yml'})
    expect(config).toEqual({})
  })

  test('parses log levels properly.', async () => {
    const silent = await conf({config: join(__dirname, '__fixture__', 'conf', 'll-silent.yml')})
    const error = await conf({config: join(__dirname, '__fixture__', 'conf', 'll-error.yml')})
    const warn = await conf({config: join(__dirname, '__fixture__', 'conf', 'll-warn.yml')})
    const info = await conf({config: join(__dirname, '__fixture__', 'conf', 'll-info.yml')})
    const debug = await conf({config: join(__dirname, '__fixture__', 'conf', 'll-debug.yml')})
    const numeric = await conf({config: join(__dirname, '__fixture__', 'conf', 'numeric-ll.yml')})

    expect(silent.logLevel).toBe(LOG_LEVEL.SILENT)
    expect(error.logLevel).toBe(LOG_LEVEL.ERROR)
    expect(warn.logLevel).toBe(LOG_LEVEL.WARN)
    expect(info.logLevel).toBe(LOG_LEVEL.INFO)
    expect(debug.logLevel).toBe(LOG_LEVEL.DEBUG)
    expect(numeric.logLevel).toBe(3)
  })
})
