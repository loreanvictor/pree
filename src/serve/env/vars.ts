import { router } from './router'


export const vars = router({
  '/': async (name: string) => ({ exists: !!process.env[name], value: process.env[name] }),
})
