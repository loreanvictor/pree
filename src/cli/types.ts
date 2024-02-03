export type Command = 'build' | 'view' | 'check' | 'help' | 'version'
export interface Options {
  src?: string,
  dest?: string,
  logLevel?: number,
  base?: string,
  root?: string,
  prod?: boolean,
  port?: number,
  include?: string[],
  exclude?: string[],
  config?: string,
}

export function merge(a: Options, b: Options) {
  const merged = {
    src: a.src ?? b.src,
    dest: a.dest ?? b.dest,
    logLevel: Math.max(a.logLevel ?? 0, b.logLevel ?? 0),
    base: a.base ?? b.base,
    root: a.root ?? b.root,
    prod: !!a.prod || !!b.prod,
    port: a.port ?? b.port,
    include: a.include ?? b.include,
    exclude: (a.exclude || b.exclude) ? [
      ...new Set([
        ...(a.exclude ?? []),
        ...(b.exclude ?? []),
      ])
    ] : undefined,
    config: a.config ?? b.config,
  }

  merged.src = merged.src ?? merged.root
  merged.root = merged.root ?? merged.src

  return merged
}
