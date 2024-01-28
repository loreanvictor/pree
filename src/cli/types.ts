export type Command = 'build' | 'view' | 'help' | 'version'
export interface Options {
  src?: string,
  dest?: string,
  logLevel?: number,
}
