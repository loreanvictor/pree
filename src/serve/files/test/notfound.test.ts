import { load } from 'cheerio'

import { notFound } from '../notfound'
import { LOG_LEVEL } from '../../../util/logger'


const logger = {
  level: LOG_LEVEL.SILENT,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  success: jest.fn(),
}

describe(notFound, () => {
  test('returns a 404 HTML page.', async () => {
    const res = await notFound({
      path: '/not/exist',
      root: '', base: undefined as any, logger, host: '',
    }, jest.fn())

    expect(res.type).toBe('text/html')
    expect(res.status).toBe(404)
  })

  test('includes given base in the HTML page.', async () => {
    const res = await notFound({
      path: '/not/exist',
      root: '', base: 'base', logger, host: '',
    }, jest.fn())

    const $ = load(res.content)
    expect($('a').attr('href')).toBe('/base')
  })
})
