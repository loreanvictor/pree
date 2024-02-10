import { router, response, isCustomResponse } from '../router'


describe(router, () => {
  test('creates a router that routes requests to handlers.', async () => {
    const handler = router({
      '/path/': async () => response('body', 'text/plain'),
      '/hellow/': async (name: string) => 'hello ' + name,
      '/undefined': async () => undefined,
    })

    const res1 = await handler('/path/')
    const res2 = await handler('/hellow/lorean')
    const res3 = await handler('/undefined')

    expect(res1).toEqual(response('body', 'text/plain'))
    expect(res2).toBe('hello lorean')
    expect(res3).toBe(undefined)

    expect(isCustomResponse(res1)).toBe(true)
    expect(isCustomResponse(res2)).toBe(false)
    expect(isCustomResponse(res3)).toBe(false)

    expect(() => handler('/no-route')).rejects.toThrow()
  })
})
