import { is, AUDIO, CODE, CONFIG_FILE, IMAGE, LICENSE_FILE, PACKAGE_FILE, VIDEO } from '../../../util/file-types'


export function fileIcon(path: string) {
  if (is(path, PACKAGE_FILE)) {
    return '📦'
  }

  if (is(path, IMAGE)) {
    return '🖼'
  }

  if (is(path, VIDEO)) {
    return '🎥'
  }

  if (is(path, AUDIO)) {
    return '🎵'
  }

  if (is(path, CONFIG_FILE)) {
    return '🎛'
  }

  if (is(path, CODE)) {
    return '｛'
  }

  if (is(path, LICENSE_FILE)) {
    return '⚖'
  }

  return '📄'
}
