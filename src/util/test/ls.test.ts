import { join } from 'path'

import { ls } from '../ls'


describe(ls, () => {
  test('lists files in a directory.', async () => {
    const files = await ls(join(__dirname, '..', '..'))

    expect(files).toContain('util/test/ls.test.ts')
    expect(files).toContain('util/ls.ts')
  })
})
