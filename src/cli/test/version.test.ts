jest.mock('libnpmsearch', () => jest.fn())

import search from 'libnpmsearch'

import { LOG_LEVEL } from '../../util/logger'
import { version } from '../version'
import { myVersion } from '../../util/my-version'


describe(version, () => {
  test('checks the current version', async () => {
    const v = myVersion();

    (search as any).mockImplementation(async () => [{ version: v }])

    let msg = ''

    await version({
      logLevel: LOG_LEVEL.INFO,
      logTransport: {
        [LOG_LEVEL.INFO]: s => msg = s
      }
    })

    expect(msg).toContain(v)
  })

  test('hints for an update if need be.', async () => {
    (search as any).mockImplementation(async () => [{ version: '9999.9.9' }])

    let warn = ''

    await version({
      logLevel: LOG_LEVEL.INFO,
      logTransport: {
        [LOG_LEVEL.INFO]: () => {},
        [LOG_LEVEL.WARN]: s => warn = s
      }
    })

    expect(warn).toContain('npm i -g pree@latest')
  })

  test('gives a hint when it fails to fetch the latest version.', async () => {
    (search as any).mockImplementation(async () => { throw new Error('nope') })
    const warn = jest.fn()

    await version({
      logLevel: LOG_LEVEL.INFO,
      logTransport: {
        [LOG_LEVEL.INFO]: () => {},
        [LOG_LEVEL.WARN]: warn,
      }
    })

    expect(warn).toHaveBeenCalled()
  })
})
