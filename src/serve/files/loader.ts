import { Logger } from '../../util/logger'


export interface LoaderResponse {
  type: string,
  content: string | Buffer,
  status?: number,
}

export interface LoadingContext {
  path: string,
  root: string,
  base: string,
  logger: Logger,
}

export type NextLoader = () => Promise<LoaderResponse>

export type Loader = (ctx: LoadingContext, next: NextLoader) => Promise<LoaderResponse>

export function run(...loaders: Loader[]) {
  return async (ctx: LoadingContext, next?: NextLoader) => {
    const _next = next ?? (async () => ({
      type: 'text/plain',
      content: 'No matching loader.',
      status: 400,
    }))

    if (loaders.length === 0) {
      if (next) {
        return await _next()
      }
    }

    const loader = loaders[0]!
    const rest = loaders.slice(1)
    try {
      return await loader(ctx, () => run(...rest)(ctx, _next))
    } catch (error) {
      ctx.logger.error((error as Error).message)

      return {
        type: 'text/plain',
        content: 'Something went terribly wrong.',
        status: 500,
      }
    }
  }
}
