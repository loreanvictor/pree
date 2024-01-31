import { access, lstat } from 'fs/promises'


export async function exists(path: string) {
  try {
    await access(path)

    return true
  } catch {
    return false
  }
}


export async function isDirectory(path: string) {
  return (await lstat(path)).isDirectory()
}
