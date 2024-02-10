import { LOG_LEVEL } from '../../../util/logger'
import { run } from '../loader'


const logger = {
  level: LOG_LEVEL.SILENT,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  success: jest.fn(),
}

describe(run, () => {
  test('it runs a bunch of loaders in succession.', async () => {
    const loader = await run(
      async (ctx, next) => ctx.path === '/a' ? { type: 'text/plain', content: 'a' } : await next(),
      async (ctx, next) => ctx.path === '/b' ? { type: 'text/plain', content: 'b' } : await next(),
      async (ctx, next) => ctx.path === '/c' ? { type: 'text/plain', content: 'c' } : await next(),
      async (ctx, next) => {
        if (ctx.path === '/e') {
          throw new Error()
        } else {
          return await next()
        }
      },
    )

    const resA = await loader({ path: '/a', root: '', base: '', logger })
    const resB = await loader({ path: '/b', root: '', base: '', logger })
    const resC = await loader({ path: '/c', root: '', base: '', logger })
    const resD = await loader({ path: '/d', root: '', base: '', logger })
    const resE = await loader({ path: '/e', root: '', base: '', logger })

    expect(resA).toEqual({ type: 'text/plain', content: 'a' })
    expect(resB).toEqual({ type: 'text/plain', content: 'b' })
    expect(resC).toEqual({ type: 'text/plain', content: 'c' })
    expect(resD).toEqual({ type: 'text/plain', content: expect.any(String), status: 400 })
    expect(resE).toEqual({ type: 'text/plain', content: expect.any(String), status: 500 })
  })
})
