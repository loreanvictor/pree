import { fileIcon } from '../icon'


describe(fileIcon, () => {
  test('returns correct icon for various file types.', () => {
    expect(fileIcon('package.json')).toBe('📦')
    expect(fileIcon('image.jpg')).toBe('🖼')
    expect(fileIcon('video.mp4')).toBe('🎥')
    expect(fileIcon('audio.mp3')).toBe('🎵')
    expect(fileIcon('config.yml')).toBe('🎛')
    expect(fileIcon('code.ts')).toBe('｛')
    expect(fileIcon('license')).toBe('⚖')
    expect(fileIcon('file.txt')).toBe('📄')
  })
})
