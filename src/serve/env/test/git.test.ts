import { git } from '../git'


describe('git', () => {
  test('it returns the remote url.', async () => {
    const res = await git('/remote/url')
    expect(res.status).toBe(200)
    expect(res.type).toBe('text/plain')
    expect(res.body).toMatch(/loreanvictor\/pree/)
  })

  test('it returns the remote info.', async () => {
    const res = await git('/remote/info')
    expect(res.full_name).toBe('loreanvictor/pree')
    expect(res.host).toBe('github.com')
  })

  test('it returns given commit.', async () => {
    const res = await git('/commit/HEAD')
    expect(res.hash).toMatch(/[a-f0-9]{40}/)
  })

  test('it returns the first commit.', async () => {
    const res = await git('/commits/first/')
    expect(res.hash).toMatch(/[a-f0-9]{40}/)
  })

  test('it returns the last commit.', async () => {
    const res = await git('/commits/last/')
    expect(res.hash).toMatch(/[a-f0-9]{40}/)
  })

  test('it returns all commits.', async () => {
    const res = await git('/commits/all/')
    expect(res.length).toBeGreaterThan(0)
  })

  test('it returns first commit of a file.', async () => {
    const res = await git('/commits/first/src/serve/env/git.ts')
    expect(res.hash).toMatch(/[a-f0-9]{40}/)
  })

  test('it returns last commit of a file.', async () => {
    const res = await git('/commits/last/src/serve/env/git.ts')
    expect(res.hash).toMatch(/[a-f0-9]{40}/)
  })

  test('it returns all commits of a file.', async () => {
    const res = await git('/commits/all/src/serve/env/git.ts')
    expect(res.length).toBeGreaterThan(0)
  })

  test('it returns content of a file.', async () => {
    const res = await git('/show/HEAD:src/serve/env/git.ts')
    expect(res.status).toBe(200)
    expect(res.type).toBe('text/typescript')
    expect(res.body).toMatch(/import parse from 'git-url-parse'/)
  })

  test('it shows stuff.', async () => {
    const res = await git('/show/HEAD')
    expect(res.status).toBe(200)
    expect(res.type).toBe('text/plain')
    expect(res.body).toMatch(/commit [a-f0-9]{40}/)
  })
})
