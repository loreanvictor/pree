import { load } from 'cheerio'

import { linkedPath } from '../linked-path'


describe(linkedPath, () => {
  test('makes a nice HTML linked representation from given path.', () => {
    const $ = load(linkedPath('/a/b/c/d'))

    expect($('a').length).toBe(4)
    expect($('a').eq(0).text()).toBe('/')
    expect($('a').eq(1).text()).toBe('a/')
    expect($('a').eq(2).text()).toBe('b/')
    expect($('a').eq(3).text()).toBe('c/')
  })
})
