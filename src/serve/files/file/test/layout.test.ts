import { load } from 'cheerio'

import { layout } from '../layout'


describe(layout, () => {
  test('layouts the page.', () => {
    const template = `
      <main><slot></slot></main>
      <footer><slot name="footer">Bobby</slot></footer>
      <slot name="trash">Trash</slot>
    `

    const page = `
      Hellow World!
      <span slot="footer">Footer</span>
    `

    const html = layout(template, page)
    const $ = load(html)

    expect($('main').text().trim()).toBe('Hellow World!')
    expect($('footer').text().trim()).toBe('Footer')
    expect($.html()).not.toMatch(/Bobby/)
    expect($.html()).toMatch(/Trash/)
  })
})
