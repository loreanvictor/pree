import { readFile } from 'fs/promises'
import { dirname, isAbsolute, join } from 'path'
import matter from 'gray-matter'

import { mimetype } from '../../util/file-types'
import { meta } from './meta'
import { layout } from './layout'


async function withLayout(src: string, html: string, template: string) {
  const layoutpath = isAbsolute(template) ? template : join(dirname(src), template)
  const { content } = await read(layoutpath)

  return layout(content, html)
}

export async function read(path: string) {
  const type = mimetype(path)
  const raw = await readFile(path)

  if (type === 'text/html') {
    const { content, data } = matter(raw)
    const layouted = data['layout'] ? (await withLayout(path, content, data['layout'])) : content

    return { type, content: meta(layouted, data) }
  } else {
    return { type, content: raw }
  }
}
