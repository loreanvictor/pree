import { myVersion } from '../my-version'


describe(myVersion, () => {
  test('it returns my version.', () => {
    expect(myVersion()).toMatch(/\d+\.\d+\.\d+/)
  })
})

