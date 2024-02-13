import { env } from '../env'


describe(env, () => {
  test('responds to requests.', async () => {
    const handler = env()
    const ctx = { method: 'GET', path: '/@env/files/read/package.json' } as any
    await handler(ctx, async () => {})

    expect(JSON.parse(ctx.body).name).toEqual('pree')
  })

  test('responds to json requests.', async () => {
    const handler = env()
    const ctx = { method: 'GET', path: '/@env/git/commits/first' } as any
    await handler(ctx, async () => {})

    expect(JSON.parse(ctx.body).author_name).toEqual('Eugene Ghanizadeh Khoub')
  })

  test('handlers errors.', async () => {
    const handler = env()
    const ctx = { method: 'GET', path: '/@env/files/read/unknown' } as any
    await handler(ctx, async () => {})

    expect(ctx.status).toEqual(404)
  })

  test('handles not found responses.', async () => {
    const handler = env()
    const ctx = { method: 'GET', path: '/@env/vars/WhaTEV' } as any
    await handler(ctx, async () => {})

    expect(ctx.status).toEqual(404)
  })

  test('handles internal errors.', async () => {
    const handler = env()
    const ctx = { method: 'GET', path: '/@env/git/show/stuff' } as any

    await handler(ctx, async () => {})

    expect(ctx.status).toEqual(500)
  })

  test('invokes next.', async () => {
    const handler = env()
    const ctx = { method: 'GET', path: '/other' } as any
    const next = jest.fn()

    await handler(ctx, next)

    expect(next).toHaveBeenCalled()
  })

  test('injects build env data into htmls.', async () => {
    const handler = env()
    const ctx = { method: 'GET', path: '/index.html' } as any
    const next = async () => {
      ctx.type = 'text/html'
      ctx.body = '<html><head></head><body></body></html>'
    }

    await handler(ctx, next)

    expect(ctx.body).toMatch(
      /BUILD_ENV_API\s*=\s*\{\s*[^}]*baseURL:\s*['"]\/@env\/['"],?\s*\}/
    )
  })
})
