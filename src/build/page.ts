import { Browser } from 'puppeteer'
import { load } from 'cheerio'
import { writeFile } from 'fs/promises'

import { ensureDir } from '../util/ensure-dir'


const BLOCKED_RESOURCE_TYPES = [
  'image',
  'media',
  'font',
  'texttrack',
  'object',
  'beacon',
  'csp_report',
  'imageset',
]

export async function buildPage(browser: Browser, url: string, target: string) {
  const page = await browser!.newPage()
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    const type = request.resourceType()
    if (BLOCKED_RESOURCE_TYPES.includes(type)) {
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

  await ensureDir(target)
  await writeFile(target, $.html())
}
