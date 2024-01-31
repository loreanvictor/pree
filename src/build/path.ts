import { relative } from 'path'


export interface PathMapOptions {
  root?: string
  namespace?: string
}

export function pathToUrl(path: string, options: PathMapOptions = {}) {
  const pathrel = relative(process.cwd(), path)
  const rootrel = relative(process.cwd(), options.root || process.cwd())
  const pathrelroot = slash(relative(rootrel, pathrel))

  if (options.namespace) {
    return options.namespace + '/' + pathrelroot
  } else {
    return pathrelroot
  }
}

export function slash(path: string) {
  const isExtendedLengthPath = path.startsWith('\\\\?\\')

  if (isExtendedLengthPath) {
    return path
  }

  return path.replace(/\\/g, '/')
}
