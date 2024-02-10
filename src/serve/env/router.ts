import { els } from '../../util/ensure-slash'


const _CustomResponse = Symbol('CustomResponse')

export type CustomResponse = {
  [_CustomResponse]: true
  body: string
  type: string
  status?: number
}

export type Handler = (path: string) => Promise<any>

export function router(routes: {[path: string]: Handler}): Handler {
  return async (path: string) => {
    const normal = els(path)

    for (const route in routes) {
      if (normal.startsWith(route) || route === normal + '/') {
        return routes[route]!(normal.slice(route.length))
      }
    }

    throw new Error('no route matched: ' + path)
  }
}

export function response(body: string, type: string, status = 200): CustomResponse {
  return {
    [_CustomResponse]: true,
    body,
    type,
    status,
  }
}

export function isCustomResponse(value: any): value is CustomResponse {
  return !!value && !!value[_CustomResponse]
}
