export type Command = 'build' | 'view' | 'help' | 'version'
export interface Options {
  src?: string,
  dest?: string,
  logLevel?: number,
  namespace?: string,
  root?: string,
  prod?: boolean,
  port?: number,
  include?: string[],
  exclude?: string[],
}
