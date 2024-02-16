import { join } from 'path'
import { mkdir, readFile, rm } from 'fs/promises'

import { build } from '../build'


const src = join(__dirname, '__fixture__')
const dest = join(__dirname, '__tmp__')

describe(build, () => {
  beforeEach(async () => {
    await rm(dest, { recursive: true, force: true })
    await mkdir(dest, { recursive: true })
  })

  afterEach(async () => {
    await rm(dest, { recursive: true, force: true })
  })

  test('builds a single file.', async () => {
    await build({
      file: join(src, 'single.html'),
      target: join(dest, 'single.html'),
    })

    const result = await readFile(join(dest, 'single.html'), 'utf8')
    expect(result).toMatch(/Hellow World/)
  })

  test('can build a url.', async () => {
    await build({
      root: src,
      urlpath: '/single.html',
      target: join(dest, 'single.html'),
    })

    const result = await readFile(join(dest, 'single.html'), 'utf8')
    expect(result).toMatch(/Hellow World/)
  })

  test('can build a directory.', async () => {
    await build({
      dir: join(src, 'dir'),
      target: join(dest, 'dir'),
    })

    const first = await readFile(join(dest, 'dir', 'first.html'), 'utf8')
    const second = await readFile(join(dest, 'dir', 'second.html'), 'utf8')

    expect(first).toMatch(/Hellow World!/)
    expect(second).toMatch(/Halo Welt!/)
  })

  test('handles errors gracefully.', async () => {
    await build({} as any)
    await build({ file: 'does-not-exist', target: join(dest, 'does-not-exist') })
    await build({ dir: 'does-not-exist', target: join(dest, 'does-not-exist') })
  })
})
