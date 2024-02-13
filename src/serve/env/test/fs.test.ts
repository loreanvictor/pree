import { fs } from '../fs'


describe('fs', () => {
  test('it reads a file.', async () => {
    const res = await fs('/read/package.json')
    expect(res.status).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toMatch(/"name": "pree"/)
  })

  test('throws not found for non-existent file.', async () => {
    await expect(() => fs('/read/non-existent')).rejects.toThrow('Not Found')
  })

  test('it lists files.', async () => {
    const res = await fs('/list/**/*.ts')
    expect(res).toContain('src/serve/env/fs.ts')
  })
})
