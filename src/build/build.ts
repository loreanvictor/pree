import { cp } from 'fs/promises'
import minimatch from 'minimatch'

import { Logger, THEME, createLogger } from '../util/logger'
import { Builder } from './builder'
import { BuildOptions, isBuildOptionsWithFile, isBuildOptionsWithDir, isBuildOptionsWithUrlPath } from './options'
import { pathToUrl } from './path'
import { ls } from '../util/ls'
import { mimetype } from '../util/file-types'
import { join } from 'path'

const _DefaultBuildOptions = {
  exclude: ['**/_*'],
}

async function buildOne(src: string, target: string, builder: Builder, logger: Logger) {
  logger.debug('building: ' +
    THEME.highlight(src) +
    THEME.secondary(' -> ') +
    THEME.highlight(target)
  )

  try {
    await builder.build(src, target)
    logger.success('built: ' +
      THEME.highlight(src) +
      THEME.secondary(' -> ') +
      THEME.highlight(target)
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
        ).map(file => join(options.target, file))

      for (const file of files) {
        await buildOne(pathToUrl(file), file, builder, logger)
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
