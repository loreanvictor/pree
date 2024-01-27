import { readFile } from 'fs/promises'
import { load } from 'cheerio'
import { dirname, isAbsolute, join } from 'path'
import matter from 'gray-matter'

import { mimetype } from '../../util/file-types'
import { meta } from './meta'


async function layout(src: string, html: string, template: string) {
  const layoutpath = isAbsolute(template) ? template : join(dirname(src), template)

  const { content } = await get(layoutpath)
  const $ = load(content)
  $('slot').replaceWith(html)

  return $.html()
}


export async function get(path: string) {
  const type = mimetype(path)
  const raw = await readFile(path)

  if (type === 'text/html') {
    const { content, data } = matter(raw)
    const layouted = data['layout'] ? (await layout(path, content, data['layout'])) : content

    return { type, content: meta(layouted, data) }
  } else {
    return { type, content: raw }
  }
}
