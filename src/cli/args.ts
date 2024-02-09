import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Command, Options } from './types'
import { LOG_LEVEL } from '../util/logger'
import { earr } from '../util/ensure-array'


export interface Args extends Options {
  command: Command,
}


export function args(): Args {
  const parsed = yargs
    .help(false).alias('h', 'help')
    .version(false).alias('v', 'version')
    .alias('p', 'port')
    .alias('P', 'prod')
    .alias('r', 'root')
    .alias('V', 'verbose')
    .alias('S', 'silent')
    .alias('b', 'base')
    .alias('i', 'include')
    .alias('e', 'exclude')
    .alias('c', 'config')
    .alias('C', 'concurrency')
    .parseSync(hideBin(process.argv))

  const command = parsed['help'] ? 'help' :
    parsed['version'] ? 'version' :
    parsed._[0] as Command ?? 'help'

  const src = parsed._[1] as string | undefined
  const dest = parsed._[2] as string | undefined
  const root = parsed['root'] as string | undefined

  const verboseLevel = parsed['verbose'] ? parsed['verbose']['length'] ?? 1 : 0
  const silentLevel = parsed['silent'] ? parsed['silent']['length'] ?? 1 : 0
  const logLevel = verboseLevel ? LOG_LEVEL.DEBUG : silentLevel ? (
    silentLevel > 2 ? LOG_LEVEL.SILENT :
      silentLevel > 1 ? LOG_LEVEL.ERROR :
        LOG_LEVEL.WARN
  ) : LOG_LEVEL.INFO

  return {
    command, src, dest, root,
    port: parsed['port'] as number | undefined,
    prod: parsed['prod'] as boolean | undefined,
    base: parsed['base'] as string | undefined,
    injectBase: parsed['inject-base'] as boolean | undefined,
    include: parsed['include'] ? earr(parsed['include'] as string) : undefined,
    exclude: parsed['exclude'] ? earr(parsed['exclude'] as string) : undefined,
    logLevel,
    config: parsed['config'] as string | undefined,
    concurrency: parsed['concurrency'] as number | undefined,
  }
}
