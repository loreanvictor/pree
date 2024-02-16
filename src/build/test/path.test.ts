
import { pathToUrl } from '../path'

describe(pathToUrl, () => {
  test('converts path to url.', () => {
    const url = pathToUrl('./src/path/to/file.html', {
      root: './src',
      base: '/base',
    })

    expect(url).toBe('/base/path/to/file.html')
  })

  test('assumes no base and cwd as root without options.', () => {
    const url = pathToUrl('./src/path/to/file.html')

    expect(url).toBe('src/path/to/file.html')
  })
})
