import { cp,  mkdir, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { minimatch } from 'minimatch'

import { Logger, THEME, createLogger } from '../util/logger'
import { Builder } from './builder'
import { BuildOptions, isBuildOptionsWithFile, isBuildOptionsWithDir, isBuildOptionsWithUrlPath } from './options'
import { pathToUrl } from './path'
import { ls } from '../util/ls'
import { mimetype } from '../util/file-types'

const _DefaultBuildOptions = {
  exclude: ['**/_*'],
}

async function buildOne(src: string, target: string, builder: Builder, logger: Logger) {
  const start = Date.now()

  logger.debug('building: ' +
    THEME.highlight(src) +
    THEME.secondary(' -> ') +
    THEME.highlight(target)
  )

  try {
    const content = await builder.build(src)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, content)

    logger.success('built: ' +
      THEME.highlight(src) +
      THEME.secondary(' -> ') +
      THEME.highlight(target) + ' in ' + (Date.now() - start) + 'ms'
    )
  } catch(error) {
    logger.error('failed: ' + THEME.highlight(src))
    logger.error((error as Error).message)
  }
}

export async function build(options: BuildOptions) {
  const logger = createLogger({ ...options, name: 'build' })

  const builder = new Builder(options)

  await builder.start()
  logger.debug('builder started.')

  if (isBuildOptionsWithFile(options)) {
    await buildOne(pathToUrl(options.file, options), options.target, builder, logger)
  } else if (isBuildOptionsWithUrlPath(options)) {
    await buildOne(options.urlpath, options.target, builder, logger)
  } else if (isBuildOptionsWithDir(options)) {
    const exclude = options.exclude ?? _DefaultBuildOptions.exclude

    try {
      logger.info('copying: ' +
        THEME.highlight(options.dir) +
        THEME.secondary(' -> ') +
        THEME.highlight(options.target)
      )

      await cp(options.dir, options.target, { recursive: true })

      const files = (await ls(options.target))
        .filter(file =>
          mimetype(file) === 'text/html'
          && !exclude.some(pattern => minimatch(file, pattern))
          && (!options.include || options.include.some(pattern => minimatch(file, pattern)))
        )

      for (const file of files) {
        await buildOne(pathToUrl(file), join(options.target, file), builder, logger)
      }
    } catch (error) {
      logger.error('failed: ' + THEME.highlight(options.dir))
      logger.error((error as Error).message)
    }
  } else {
    logger.error('invalid build options.')
  }

  await builder.close()
  logger.debug('builder closed.')
}
