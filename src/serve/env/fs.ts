import { minimatch } from 'minimatch'
import { readFile } from 'fs/promises'
import { NotFound } from 'http-errors'

import { ls } from '../../util/ls'
import { response, router } from './router'
import { mimetype } from '../../util/file-types'


const _ExcludePatterns = [
  /node_modules/,
  /\.git/,
]

async function list(pattern: string) {
  return (await ls(process.cwd()))
    .filter(file => !_ExcludePatterns.some(p => p.test(file)))
    .filter(file => (!pattern || minimatch(file, pattern)))
}

async function read(path: string) {
  try {
    const content = await readFile(path, 'utf8')
    const type = mimetype(path)

    return response(content, type)
  } catch {
    throw new NotFound()
  }
}

export const fs = router({
  '/list/': list,
  '/read/': read,
})
