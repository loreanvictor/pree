import puppeteer, { Browser } from 'puppeteer'
import { writeFile } from 'fs/promises'

import { serve, ServeOptions, Server } from '../serve'
import { parse, format } from 'path'


export interface BuildOptions extends ServeOptions {
  sourceDir?: string
  targetDir?: string
}


export class Builder {
  private server?: Server
  private browser?: Browser

  constructor(readonly options: BuildOptions = {}) {}

  public async start() {
    await this.startServer()
    await this.startBrowser()
  }

  public async close() {
    await this.server?.close()
    await this.browser?.close()

    this.server = undefined
    this.browser = undefined
  }

  protected async startServer() {
    this.server ??= await serve(this.options)
  }

  protected async startBrowser() {
    this.browser ??= await puppeteer.launch({ headless: 'new' })
  }

  protected started() {
    return this.server && this.browser
  }

  public async build(path: string, target?: string) {
    if (!this.started()) {
      await this.start()
    }

    const page = await this.browser!.newPage()
    await page.goto(`http://localhost:${this.server!.port}/${this.mapPath(path)}`)

    await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[build-only]')
      scripts.forEach((script) => script.remove())
    })

    // TODO: this should be done more gracefully
    //       perhaps using a tool like cheerio
    const head = await page.$eval('head', (el) => el.innerHTML)
    const body = await page.$eval('body', (el: any) => el.getInnerHTML())

    const content = `<!DOCTYPE html><html><head>${head}</head><body>${body}</body></html>`

    await writeFile(this.getTarget(path, target), content)
  }

  protected mapPath(path: string) {
    if (this.options.namespace) {
      return this.options.namespace + '/' + path
    } else {
      return path
    }
  }

  protected getTarget(path: string, target?: string) {
    if (target) {
      return target
    } else {
      // TODO: detect based on sourceDir and targetDir
      return format({ ...parse(path), base: '', ext: '.dist.html'})
    }
  }
}
