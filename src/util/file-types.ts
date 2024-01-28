import mime from 'mime'


export const PACKAGE_FILE = [
  /^package\.json$/,
  /^package-lock\.json$/,
  /^yarn\.lock$/,
  /^pnpm-lock\.(yml|yaml|json)$/,
  /^shrinkwrap\.(yml|yaml|json)$/,
  /^Cargo\.toml$/,
  /^go\.mod$/,
  /^requirements\.txt$/,
  /^Gemfile$/,
]

export const CONFIG_FILE = [
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
  /\.(json|yml|yaml|toml)$/,
]

export const LICENSE_FILE = [
  /^LICENSE$/,
  /^LICENCE$/,
  /^COPYING$/,
]

export const IMAGE = [
  /\.png$/,
  /\.jpe?g$/,
  /\.gif$/,
  /\.ico$/,
  /\.bmp$/,
  /\.svg$/,
  /\.webp$/,
]

export const VIDEO = [
  /\.mov$/,
  /\.mp4$/,
  /\.webm$/,
]

export const AUDIO = [
  /\.mp3$/,
  /\.wav$/,
  /\.ogg$/,
  /\.m4a$/,
  /\.aac$/,
  /\.flac$/,
]

export const CODE = [
  /\.(j|t)sx?$/,
  /\.(sa|le|sc|c)ss$/,
  /\.vue$/,
  /\.svelte$/,
  /\.php$/,
  /\.rb$/,
  /\.py$/,
  /\.java$/,
  /\.swift$/,
  /\.go$/,
  /\.rs$/,
  /\.dart$/,
  /\.lua$/,
  /\.perl$/,
  /\.r$/,
  /\.(c|h)(pp)?$/,
  /\.scala$/,
  /\.groovy$/,
  /\.cs$/,
  /\.fs$/,
  /\.erl$/,
  /\.haskell$/,
  /\.purs$/,
  /\.elm$/,
]

export function is(path: string, patterns: RegExp[]) {
  return patterns.some(pattern => pattern.test(path))
}

export function mimetype(path: string) {
  if (path.endsWith('.ts')) {
    return 'text/typescript'
  } else {
    return mime.getType(path) || 'text/plain'
  }
}
