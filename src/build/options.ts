import { BuilderOptions } from './builder'


interface BuildOptionsBase extends BuilderOptions {
  target: string
}

interface BuildOptionsWithFile extends BuildOptionsBase {
  file: string
}

interface BuildOptionsWithDir extends BuildOptionsBase {
  dir: string
  exclude?: string[]
  include?: string[]
}

interface BuildOptionsWithUrlPath extends BuildOptionsBase {
  urlpath: string
}

export type BuildOptions = BuildOptionsWithFile | BuildOptionsWithDir | BuildOptionsWithUrlPath

export function isBuildOptionsWithFile(options: BuildOptions): options is BuildOptionsWithFile {
  return 'file' in options
}

export function isBuildOptionsWithDir(options: BuildOptions): options is BuildOptionsWithDir {
  return 'dir' in options
}

export function isBuildOptionsWithUrlPath(options: BuildOptions): options is BuildOptionsWithUrlPath {
  return 'urlpath' in options
}
