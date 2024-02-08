import { CODE, CONFIG_FILE, is, mimetype } from '../file-types'


describe(is, () => {
  test('should return true if file is in given category.', () => {
    expect(is('file.js', CODE)).toBe(true)
    expect(is('some/file.json', CODE)).toBe(false)
    expect(is('file.yaml', CODE)).toBe(false)
    expect(is('some/file.yml', CONFIG_FILE)).toBe(true)
  })
})


describe(mimetype, () => {
  test('should return mime type of given path.', () => {
    expect(mimetype('file.js')).toBe('application/javascript')
    expect(mimetype('some/file.json')).toBe('application/json')
    expect(mimetype('../file.yaml')).toBe('text/yaml')
    expect(mimetype('file.ts')).toBe('text/typescript')
    expect(mimetype('file')).toBe('text/plain')
  })
})
