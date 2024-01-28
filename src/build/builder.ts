import puppeteer, { Browser } from 'puppeteer'
import { writeFile, mkdir } from 'fs/promises'
import { load } from 'cheerio'
import { dirname } from 'path'

import { LOG_LEVEL } from '../util/logger'
import { serve, ServeOptions, Server } from '../serve'


export interface BuilderOptions extends ServeOptions {
  blockedResourceTypes?: string[]
}

export const _DefaultOptions = {
  blockedResourceTypes: [
    'image',
    'media',
    'font',
    'texttrack',
    'object',
    'beacon',
    'csp_report',
    'imageset',
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
    this.server ??= await serve({...this.options, logLevel: LOG_LEVEL.SILENT})
    this.browser ??= await puppeteer.launch({ headless: 'new' })
  }

  public async close() {
    await this.browser?.close()
    await this.server?.close()
    this.server = this.browser = undefined
  }

  public async build(path: string, target: string) {
    await this.start()
    await this.buildUrl(`http://localhost:${this.server!.port}/${path}`, target)
  }

  protected async buildUrl(url: string, target: string) {
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

    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, $.html())
  }
}
