import { minimatch } from 'minimatch'

// TODO: spin into separate package

export interface FilterFilesOptions {
  exclude?: string[]
  include?: string[]
}

export function match(path: string, options: FilterFilesOptions = {}) {
  const { exclude = ['**/_*', '**/.*'], include } = options

  return !exclude.some(pattern => minimatch(path, pattern))
    && (!include || include.some(pattern => minimatch(path, pattern)))
}
