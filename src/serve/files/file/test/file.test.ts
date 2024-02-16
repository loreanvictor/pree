import { join } from 'path/posix'
import { load } from 'cheerio'

import { file } from '../file'
import { LOG_LEVEL } from '../../../../util/logger'


const logger = {
  level: LOG_LEVEL.SILENT,
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  success: jest.fn(),
}

describe(file, () => {
  test('it loads given file.', async () => {
    const res = await file({
      path: join(__dirname, '__fixture__', 'index.html'),
      root: '',
      base: '',
      logger,
      host: '',
    }, jest.fn())

    expect(res.type).toBe('text/html')
    expect(res.content).toMatch(/This is layout/)
    expect(res.content).toMatch(/This is index/)
  })

  test('it loads given index.html of a directory.', async () => {
    const res = await file({
      path: join(__dirname, '__fixture__/'),
      root: '',
      base: '',
      logger,
      host: '',
    }, jest.fn())

    expect(res.type).toBe('text/html')
    expect(res.content).toMatch(/This is layout/)
    expect(res.content).toMatch(/This is index/)
  })

  test('it loads given file without .html extension.', async () => {
    const res = await file({
      path: join(__dirname, '__fixture__', 'some'),
      root: '',
      base: '',
      logger,
      host: '',
    }, jest.fn())

    expect(res.type).toBe('text/html')
    expect(res.content).toMatch(/This is layout/)
    expect(res.content).toMatch(/This is some/)
  })

  test('it handles metadata.', async () => {
    const res = await file({
      path: join(__dirname, '__fixture__', 'meta.html'),
      root: '',
      base: '',
      logger,
      host: '',
    }, jest.fn())

    const $ = load(res.content)
    expect($('title').text()).toBe('Meta')
    expect($('meta[name="description"]').attr('content')).toBe('Meta description')
    expect($('meta[name="keywords"]').attr('content')).toBe('layout, test')
  })

  test('it passes to the next loader when cannot find the file.', async () => {
    const next = jest.fn()
    await file({
      path: join(__dirname, '__fixture__', 'not-found.html'),
      root: '',
      base: '',
      logger,
      host: '',
    }, next)

    expect(next).toBeCalled()
  })

  test('it can load other file types.', async () => {
    const res = await file({
      path: join(__dirname, '__fixture__', 'other.txt'),
      root: '',
      base: '',
      logger,
      host: '',
    }, jest.fn())

    expect(res.type).toBe('text/plain')
    expect(String(res.content)).toBe('Hey there!')
  })
})
