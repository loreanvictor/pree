export function linkedPath(path: string) {
  return path.split('/').map((part, i, arr) => {
    if (i === arr.length - 1) {
      return part
    } else {
      const link = i === 0 ? '/' : arr.slice(0, i + 1).join('/')

      return `<a href="${link}">${part}/</a>`
    }
  }).join('')
}
