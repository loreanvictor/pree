// TODO: this should become an independent package.

import lunr from 'lunr'
import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import { load } from 'cheerio'

import { ls } from './ls'
import { FilterFilesOptions, match } from './file-match'


interface IndexOptions extends FilterFilesOptions {
  target: string
  contentQuery?: string
}

const _DefaultOptions = {
  contentQuery: 'main :is(h1, h2, h3, h4, h5, p, li, pre code, td)'
}

async function index(options: IndexOptions) {
  const files = await ls(options.target)
  const query = options.contentQuery ?? _DefaultOptions.contentQuery
  const filtered =files
    .filter(file => match(file, options))
    .filter(file => file.endsWith('.html'))

  const docs: {path: string, content: string, title: string, ref: string }[]  = []

  await Promise.all(filtered.map(async path => {
    const $ = load(await readFile(join(options.target, path), 'utf-8'))
    let content = ''

    const $meta = $('meta[name="dont search"]')
    if ($meta.length > 0 && $meta.attr('content') === 'true') {
      return
    }

    $(query).each((_, el) => { content += $(el).text() + ' ' })
    const $heading = $('h1, h2, h3').first()
    const $title = $('title').last()

    $heading.children('a, button, menu').remove()

    const title = $heading.text() || $title.text()

    docs.push({ path, content, title, ref: JSON.stringify({ p: path, t: title }) })
  }))

  const idx = lunr(function() {
    this.ref('ref')
    this.field('content')
    this.field('title')

    docs.forEach(doc => { this.add(doc) })
  })

  const serializedIndex = JSON.stringify(idx)
  await writeFile(join(options.target, 'search-index.json'), serializedIndex, 'utf-8')
}

index({ target: 'site' })
