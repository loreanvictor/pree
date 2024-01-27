import { mkdir } from 'fs/promises'
import { dirname } from 'path'


export async function ensureDir(path: string) {
  await mkdir(dirname(path), { recursive: true })
}
