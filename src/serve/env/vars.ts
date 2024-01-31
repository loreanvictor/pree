import { response, router } from './router'


export const vars = router({
  '/': async (name: string) => {
    if (process.env[name] === undefined) {
      return response('', 'text/plain', 404)
    } else {
      return response(process.env[name]!, 'text/plain')
    }
  },
})
