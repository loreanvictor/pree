import { LOG_LEVEL } from '../../util/logger'
import { injector } from '../injector'

const logger = {
  level: LOG_LEVEL.SILENT,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  success: jest.fn(),
}

describe(injector, () => {
  test('injects live reload script.', async () => {
    const loader = injector()
    const res = await loader({
      path: 'some.html', root: '', base: '', logger, host: 'localhost:3000'
    }, async () => ({
      type: 'text/html',
      content: '<p>Hellow World!</p>'
    }))

    expect(res.content).toContain('ws://localhost:')
    expect(res.content).toContain('Hellow World!')
  })

  test('does not inject if file is not html, status is not ok or path does not match.', async () => {
    const loader = injector()
    const ctx = { root: '', base: '', logger }

    const resA = await loader({ ...ctx, path: '_some.html', host: 'localhost:3000' },
      async () => ({ type: 'text/html', content: 'Jackson!' }))
    const resB = await loader({ ...ctx, path: 'some.css', host: 'localhost:3000' },
      async () => ({ type: 'text/css', content: 'Jackson!', status: 200 }))
    const resC = await loader({ ...ctx, path: 'some.html', host: 'localhost:3000' },
      async () => ({ type: 'text/html', status: 404, content: 'Jackson!' }))

    expect(resA.content).toBe('Jackson!')
    expect(resB.content).toBe('Jackson!')
    expect(resC.content).toBe('Jackson!')
  })
})
