import WebSocket from 'ws'
import { join } from 'path/posix'
import { rm, mkdir, writeFile } from 'fs/promises'

import { view } from '../view'


const root = join(__dirname, '__tmp__')
const randomPort = () => Math.floor(Math.random() * 1000) + 3000


describe(view, () => {
  beforeEach(async () => {
    await rm(root, { recursive: true, force: true })
    await mkdir(root, { recursive: true })
  })

  afterEach(async () => {
    await rm(root, { recursive: true, force: true })
  })

  test('it watches files.', async () => {
    await writeFile(join(root, 'index.html'), 'hello world')

    const viewer = await view({ root, port: randomPort()})
    const ws = new WebSocket(`ws://localhost:${viewer.port}`)

    await new Promise((resolve) => {
      ws.on('open', () => {
        ws.on('message', resolve)
        writeFile(join(root, 'index.html'), 'hello world 2')
      })
    })

    await viewer.close()
  })

  test('it does not watch in prod mode.', async () => {
    await writeFile(join(root, 'index.html'), 'hello world')

    const viewer = await view({ root, prod: true, port: randomPort() })

    expect(viewer.watcher).toBeUndefined()
    expect(viewer.ws).toBeUndefined()

    await viewer.close()
  })

  test('without options, watches EVERYTHING.', async () => {
    await writeFile(join(root, 'index.html'), 'hello world')

    const viewer = await view()
    const ws = new WebSocket(`ws://localhost:${viewer.port}`)

    await new Promise((resolve) => {
      ws.on('open', () => {
        ws.on('message', resolve)
        writeFile(join(root, 'index.html'), 'hello world 2')
      })
    })

    await viewer.close()
  })
})
