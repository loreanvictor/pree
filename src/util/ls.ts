import { readdir, stat } from 'fs/promises'
import { join } from 'path'

// TODO: spin into own library?

export async function ls(path: string) {
  const res: string[] = []

  await Promise.all(
    (await readdir(path)).map(async (name) => {
      if ((await stat(join(path, name))).isDirectory()) {
        res.push(...(await ls(join(path, name))).map(p => join(name, p)))
      } else {
        res.push(name)
      }
    })
  )

  return res
}
