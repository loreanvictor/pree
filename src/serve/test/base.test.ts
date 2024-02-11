import { load } from 'cheerio'

import { base } from '../base'


describe(base, () => {
  test('adds base tag to html.', async () => {
    const middleware = base({ base: 'jack' })
    const ctx = {
      type: 'text/html',
      body: '<p>Hello World!</p>',
    } as any

    await middleware(ctx, async () => {})

    const $ = load(ctx.body as string)
    expect($('base').attr('href')).toBe('/jack/')
    expect($('p').text()).toBe('Hello World!')
  })

  test('adds base tag with / to html, if not specified.', async () => {
    const ctx = {
      type: 'text/html',
      body: '<p>Hello World!</p>',
    } as any

    await base()(ctx, async () => {})

    const $ = load(ctx.body as string)
    expect($('base').attr('href')).toBe('/')
  })
})
