export type Handler = (path: string) => Promise<any>

export function router(routes: {[path: string]: Handler}): Handler {
  return async (path: string) => {
    const normal = path.startsWith('/') ? path : '/' + path

    for (const route in routes) {
      if (normal.startsWith(route) || route === normal + '/') {
        return routes[route]!(normal.slice(route.length))
      }
    }

    throw new Error('no route matched: ' + path)
  }
}
