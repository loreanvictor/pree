import { LOG_LEVEL } from '../../util/logger'
import { help } from '../help'


describe(help, () => {
  test('logs a help message.', () => {
    let msg = ''
    help({
      logLevel: LOG_LEVEL.INFO,
      logTransport: {
        [LOG_LEVEL.INFO]: s => msg = s
      }
    })

    expect(msg).toMatch(/pree view/)
    expect(msg).toMatch(/--port/)
    expect(msg).toContain('https://loreanvictor.github.io/pree')
  })
})
