import { match } from '../file-match'


describe(match, () => {
  test('should match test given file name against include exclude rules.', () => {
    expect(match('some-file')).toBe(true)
    expect(match('some/other/file.ts')).toBe(true)
  })

  test('should ignore _ and . files by default.', () => {
    expect(match('_some-file')).toBe(false)
    expect(match('.some-file')).toBe(false)
  })

  test('should exclude all files that match exclude patterns.', () => {
    expect(match('some-file', { exclude: ['**/some-file'] })).toBe(false)
    expect(match('some/other/file.ts', { exclude: ['**/some-file'] })).toBe(true)
  })

  test('should include only files matching include patterns.', () => {
    expect(match('some-file', { include: ['**/some-file'] })).toBe(true)
    expect(match('some/other/file.ts', { include: ['**/some-file'] })).toBe(false)
  })
})
