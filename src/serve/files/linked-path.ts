export function linkedPath(path: string) {
  return path.split('/').map((part, i, arr) => {
    if (i === arr.length - 1) {
      return part
    } else {
      const link = arr.slice(0, i + 1).join('/')

      return `<a href="${link.startsWith('/') ? link : '/' + link}">${part}/</a>`
    }
  }).join('')
}
