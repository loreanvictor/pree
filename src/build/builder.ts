import puppeteer, { Browser } from 'puppeteer'
import { load } from 'cheerio'

import { serve, ServeOptions, Server } from '../serve'
import { LOG_LEVEL } from '../util/logger'


export interface BuilderOptions extends ServeOptions {
  blockedResourceTypes?: string[]
}

const _DefaultOptions = {
  blockedResourceTypes: [
    'image',
    'media',
    'font',
    'texttrack',
    'object',
    'beacon',
    'csp_report',
    'imageset',
    'stylesheet',
  ]
}

export class Builder {
  private server?: Server
  private browser?: Browser
  private blockedResourceTypes: string[]

  constructor(readonly options: BuilderOptions = {}) {
    this.blockedResourceTypes = options.blockedResourceTypes ?? _DefaultOptions.blockedResourceTypes
  }

  public async start() {
    this.server ??= await serve({
      ...this.options,
      logLevel: (this.options.logLevel ?? 5) <= LOG_LEVEL.INFO ? LOG_LEVEL.SILENT : this.options.logLevel,
    })
    this.browser ??= await puppeteer.launch({ headless: 'new' })
  }

  public async close() {
    await this.browser?.close()
    await this.server?.close()
    this.server = this.browser = undefined
  }

  public async build(path: string) {
    await this.start()

    return await this.buildUrl(`http://localhost:${this.server!.port}/${path}`)
  }

  protected async buildUrl(url: string) {
    await this.start()
    const page = await this.browser!.newPage()
    await page.setRequestInterception(true)
    page.on('request', (request) => {
      const type = request.resourceType()
      if (this.blockedResourceTypes.includes(type)) {
        request.abort()
      } else {
        request.continue()
      }
    })

    await page.goto(url)
    await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[build-only]')
      scripts.forEach((script) => script.remove())
    })

    const html = await page.content()
    const body = await page.$eval('body', (el: any) => el.getInnerHTML())

    await page.close()

    const $ = load(html)
    $('body').html(body)

    return $.html()
  }
}
