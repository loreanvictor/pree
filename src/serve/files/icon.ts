import { basename, extname } from 'path'

import { isCode } from './code'


const PKG_FILES = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'pnpm-lock.json',
  'pnpm-workspace.yaml',
  'pnpmfile.js',
  'shrinkwrap.yaml',
  'shrinkwrap.json',
  'Cargo.toml',
  'go.mod',
  'requirements.txt',
  'Gemfile',
]

const IMG_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
]

const VIDEO_EXTENSIONS = [
  '.mp4',
  '.webm',
  '.ogg',
]

const AUDIO_EXTENSIONS = [
  '.mp3',
  '.wav',
  '.ogg',
]

const CONFIG_FILE_PATTERNS = [
  /^\.babelrc$/,
  /^\.eslintrc(\.js|\.json|\.yaml|\.yml)?$/,
  /^\.prettierrc(\.js|\.json|\.yaml|\.yml)?$/,
  /^\.stylelintrc(\.js|\.json|\.yaml|\.yml)?$/,
  /^\.gitignore$/,
  /^\.npmignore$/,
  /^\.dockerignore$/,
  /^\.gitmodules$/,
  /^\.editorconfig$/,
  /^\.flowconfig$/,
  /^\.buckconfig$/,
  /^\.watchmanconfig$/,
  /^\.htaccess$/,
  /^\.firebaserc$/,
  /^firebase\.json$/,
  /^firebase\.hosting\.json$/,
  /^\.gitattributes$/,
  /^\.gitkeep$/,
  /^\.npmrc$/,
  /^\.yarnrc$/,
  /^\.yarnrc\.yml$/,
  /^\.yarnrc\.yaml$/,
  /^\.yarnclean$/,
  /^\.yarnclean$/,
  /^\.env$/,
  /.*\.config\..*$/,
]

export function fileIcon(path: string) {
  const ext = extname(path)
  const name = basename(path)

  if (PKG_FILES.includes(name)) {
    return '📦'
  }

  if (IMG_EXTENSIONS.includes(ext)) {
    return '🖼'
  }

  if (VIDEO_EXTENSIONS.includes(ext)) {
    return '🎥'
  }

  if (AUDIO_EXTENSIONS.includes(ext)) {
    return '🎵'
  }

  if (CONFIG_FILE_PATTERNS.some(pattern => pattern.test(name))) {
    return '⚙'
  }

  if (isCode(path)) {
    return '｛'
  }

  return '📄'
}
