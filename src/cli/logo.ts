import chalk from 'chalk'

import { myVersion } from '../util/my-version'


export const LOGO = chalk.hex('#ECF4D6').bold(
  '┌╮┌╮┌╴┌╴                                       ' +
  chalk.bgHex('#265073')(' ' + myVersion() + ' ') + '\n' +
  '├╯├╮├╴├╴ \n' +
  '╵ ╵╵└╴└╴ \n'
)
