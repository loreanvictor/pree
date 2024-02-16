import { files } from '../files'


describe(files, () => {
  test('returns files.', async () => {
    const handler = files()
    const ctx = { method: 'GET', path: '/src/serve/files/files.ts' } as any
    await handler(ctx, async () => {})

    expect(ctx.status).toBe(200)
    expect(ctx.type).toBe('text/typescript')
  })

  test('invokes next with post requests.', async () => {
    const handler = files()
    const ctx = { method: 'POST', path: '/whatevs' } as any
    const next = jest.fn()
    await handler(ctx, next)

    expect(next).toHaveBeenCalled()
  })

  test('invokes next when unrelated request.', async () => {
    const handler = files({ base: 'stuff' })
    const ctx = { method: 'GET', path: '/whatevs' } as any
    const next = jest.fn()
    await handler(ctx, next)

    expect(next).toHaveBeenCalled()
  })

  test('handles base urls.', async () => {
    const handler = files({ base: 'stuff' })
    const ctx = { method: 'GET', path: '/stuff/src/serve/files/files.ts' } as any
    await handler(ctx, async () => {})

    expect(ctx.status).toBe(200)
    expect(ctx.type).toBe('text/typescript')
  })

  test('ensures trailing slash on root paths.', async () => {
    const observed: string[] = []

    const handler = files({
      loaders: [async ctx => {
        observed.push(ctx.path)

        return { type: 'text/plain', content: 'No matching loader.' }
      }]
    })

    const ctx = { method: 'GET', path: '/' } as any
    await handler(ctx, async () => {})

    expect(observed.length).toBe(1)
    expect(observed[0]!.endsWith('/')).toBe(true)
  })
})
