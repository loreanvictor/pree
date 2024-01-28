import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Command, Options } from './main'


export interface Args extends Options {
  command: Command,
}


export function args(): Args {
  const parsed = yargs
    .help(false).alias('h', 'help')
    .version(false).alias('v', 'version')
    .parseSync(hideBin(process.argv))

  if (parsed._.length === 0) {
    return { command: 'help' }
  } else {
    const command = parsed._[0] as Command ??
      (parsed['help'] ? 'help' : parsed['version'] ? 'version' : 'help')

    return {
      command,
      src: parsed._[1] as string | undefined,
      dest: parsed._[2] as string | undefined,
    }
  }
}
