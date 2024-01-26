import chalk from 'chalk'
import { join } from 'path'
import mime from 'mime'
import { Context, Next } from 'koa'
import { access, readFile } from 'fs/promises'

import { isDirectory, renderDirectory } from './dir'
import { isCode, renderCode } from './code'


export interface FilesOptions {
  root?: string
}


const _DefaultOptions = {
  root: process.cwd()
}


export function files(options?: FilesOptions) {
  const root = options?.root || _DefaultOptions.root

  return async (ctx: Context, next: Next) => {
    if (ctx.method === 'GET') {
      const target = '.' + ctx.path
      console.log('requested: ' + chalk.blueBright(target))

      try {
        const path = join(root, target)
        await access(path)

        // TODO: clean this structure up into a bunch of configurable
        //      middleware system for handling various files.
        //      e.g.: you might want to handle front matter for html files
        //      or you might want to inject a hot reload script for all html files
        //      which shouild be invoked after all other middlewares have done their deed.
        //
        if (await isDirectory(path)) {
          const { type, content } = await renderDirectory(path, root)
          ctx.type = type
          ctx.body = content
        } else if (isCode(path)) {
          const { type, content } = await renderCode(path, root)
          ctx.type = type
          ctx.body = content
        } else {
          ctx.type = mime.getType(path) || 'text/plain'
          ctx.body = await readFile(path)
        }
      } catch (err) {
        console.log('❌ ' + chalk.redBright('cannot load: ') + chalk.blueBright(target))
        console.log('❌ ' + chalk.red((err as Error).message))
        ctx.body = '404 Not Found'
      }
    } else {
      await next()
    }
  }
}
