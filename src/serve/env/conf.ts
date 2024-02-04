import { router } from './router'


export function conf(options: any) {
  return router({
    '/': async (name: string) => name && name.length > 0 ? options[name] : options
  })
}
