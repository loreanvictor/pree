import { Context, Next } from 'koa'
import { load } from 'cheerio'

import { els, ets } from '../util/ensure-slash'


export interface BaseOptions {
  base?: string
}

const _DefaultOptions = {
  base: '',
}

export function base(options?: BaseOptions) {
  const url = ets(els(options?.base ?? _DefaultOptions.base))

  return async (ctx: Context, next: Next) => {
    await next()

    if (ctx.type.match(/html/)) {
      const $ = load(ctx.body as string)
      $('base').remove()
      $('head').prepend(`<base href="${url}">`)
      ctx.body = $.html()
    }
  }
}

