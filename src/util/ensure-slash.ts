export function els(path: string) {
  return path.startsWith('/') ? path : '/' + path
}

export function ele(path: string) {
  return path.endsWith('/') ? path : path + '/'
}

export function trimslash(path: string) {
  return path.replace(/\/$/, '').replace(/^\//, '')
}
