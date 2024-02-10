import { conf } from '../conf'


describe(conf, () => {
  test('returns values from a config.', async () => {
    const handler = conf({ a: 'a', b: { c: [42, 'c'], d: true } })
    const resA = await handler('/b')
    const resB = await handler('/a')
    const resC = await handler('/')

    expect(resA).toEqual({ c: [42, 'c'], d: true })
    expect(resB).toEqual('a')
    expect(resC).toEqual({ a: 'a', b: { c: [42, 'c'], d: true } })
  })
})
