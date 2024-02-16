import sleep from 'sleep-promise'
import WebSocket from 'ws'
import { join } from 'path/posix'
import { rm, mkdir, writeFile } from 'fs/promises'

import { view } from '../view'


const root = join(__dirname, '__tmp__')


describe(view, () => {
  beforeEach(async () => {
    await rm(root, { recursive: true, force: true })
    await mkdir(root, { recursive: true })
  })

  afterEach(async () => {
    await rm(root, { recursive: true, force: true })
  })

  test('it watches files.', async () => {
    await sleep(100)
    await writeFile(join(root, 'index.html'), 'hello world')

    const viewer = await view({ root })
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
    await sleep(100)
    await writeFile(join(root, 'index.html'), 'hello world')

    const viewer = await view({ root, prod: true })

    expect(viewer.watcher).toBeUndefined()
    expect(viewer.ws).toBeUndefined()

    await viewer.close()
  })

  test('without options, watches EVERYTHING.', async () => {
    await sleep(100)
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
