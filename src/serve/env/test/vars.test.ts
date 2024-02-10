import { vars } from '../vars'


describe('vars', () => {
  test('returns values from env vars.', async () => {
    const res = await vars('/PATH')
    expect(res.status).toBe(200)
    expect(res.type).toBe('text/plain')
    expect(res.body).toBe(process.env['PATH'])
  })

  test('returns 404 when not found.', async () => {
    const res = await vars('/NOT_FOUND')
    expect(res.status).toBe(404)
    expect(res.type).toBe('text/plain')
  })
})
