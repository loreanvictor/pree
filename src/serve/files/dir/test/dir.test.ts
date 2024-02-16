import { join } from 'path'

import { dir } from '../dir'
import { LOG_LEVEL } from '../../../../util/logger'


const logger = {
  level: LOG_LEVEL.SILENT,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  success: jest.fn(),
}

describe(dir, () => {
  test('it previews given directory.', async () => {
    const res = await dir({
      path: join(__dirname, '../../../../../'),
      root: '', base: '', logger, host: '',
    }, jest.fn())

    expect(res.type).toBe('text/html')
    expect(res.content).toMatch(/node_modules/)
    expect(res.content).toMatch(/src/)
    expect(res.content).toMatch(/conf/)
  })

  test('it invokes next loader when stuff does not exist.', async () => {
    const next = jest.fn()
    await dir({
      path: join(__dirname, '../../../../../not-exist'),
      root: '', base: '', logger, host: '',
    }, next)

    expect(next).toBeCalled()
  })

  test('it invokes next loader when stuff is not a directory.', async () => {
    const next = jest.fn()
    await dir({
      path: join(__dirname, '../../../../../package.json'),
      root: '', base: '', logger, host: '',
    }, next)

    expect(next).toBeCalled()
  })
})
