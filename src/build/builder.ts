import puppeteer, { Browser } from 'puppeteer'

import { serve, ServeOptions, Server } from '../serve'
import { relative } from 'path'
import { createLogger, THEME, LOG_LEVEL, Logger } from '../util/logger'
import { buildPage } from './page'


export type BuilderOptions = ServeOptions


export class Builder {
  private server?: Server
  private browser?: Browser
  private logger: Logger

  constructor(readonly options: BuilderOptions = {}) {
    this.logger = createLogger({ ...options, name: 'build' })
  }

  public async start() {
    await this.startServer()
    await this.startBrowser()
  }

  public async close() {
    await this.stopBrowser()
    await this.stopServer()
  }

  protected async startServer() {
    this.logger.debug('starting server')
    this.server ??= await serve({
      ...this.options,
      logLevel: LOG_LEVEL.ERROR,
    })
  }

  protected async stopServer() {
    this.logger.debug('stopping server')
    await this.server?.close()
    this.server = undefined
  }

  protected async startBrowser() {
    this.logger.debug('starting browser')
    this.browser ??= await puppeteer.launch({ headless: 'new' })
  }

  protected async stopBrowser() {
    this.logger.debug('stopping browser')
    await this.browser?.close()
    this.browser = undefined
  }

  protected started() {
    return this.server && this.browser
  }

  public async build(path: string, target: string) {
    if (!this.started()) {
      await this.start()
    }

    try {
      this.logger.log('building: ' + THEME.highlight(path) + THEME.secondary(' -> ') + THEME.highlight(target))
      await buildPage(this.browser!, `http://localhost:${this.server!.port}/${this.mapPath(path)}`, target)
      this.logger.success('built: ' + THEME.highlight(path))
    } catch (error) {
      this.logger.error('failed: ' + THEME.highlight(path))
      this.logger.error((error as Error).message)
    }
  }

  protected mapPath(path: string) {
    const pathrel = relative(process.cwd(), path)
    const rootrel = relative(process.cwd(), this.options.root || process.cwd())
    const pathrelroot = relative(rootrel, pathrel)

    if (this.options.namespace) {
      return this.options.namespace + '/' + pathrelroot
    } else {
      return path
    }
  }
}
