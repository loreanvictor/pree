import chalk from 'chalk'


export const LOGO = chalk.hex('#ECF4D6').bold(
  '┌╮┌╮┌╴┌╴ \n' +
  '├╯├╮├╴├╴ \n' +
  '╵ ╵╵└╴└╴ \n' +
  chalk.bgHex('#265073')(' ' + process.env['npm_package_version'] + ' ') + '\n'
)
