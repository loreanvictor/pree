export default function els(path: string) {
  return path.startsWith('/') ? path : '/' + path
}
