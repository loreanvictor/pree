import { load } from 'cheerio'

import { meta } from '../meta'


describe(meta, () => {
  test('adds metadata to the page.', () => {
    const html = meta('<p>Hellow!</p>', {
      title: 'Hello',
      description: 'World',
      keywords: ['hello', 'world'],
      base: 'https://example.com'
    })

    const $ = load(html)

    expect($('head title').text()).toBe('Hello')
    expect($('head meta[name="description"]').attr('content')).toBe('World')
    expect($('head meta[name="keywords"]').attr('content')).toBe('hello, world')
    expect($('head base').attr('href')).toBe('https://example.com')
  })
})
