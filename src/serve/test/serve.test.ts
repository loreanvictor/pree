import sleep from 'sleep-promise'
import { serve } from '../serve'


describe(serve, () => {
  test('it serves stuff.', async () => {
    await sleep(100)
    const { close, port } = await serve()

    const raw = await fetch(`http://localhost:${port}/src/serve/serve.ts`)
    const text = await raw.text()

    expect(text).toMatch(/export function serve\(/)

    await close()
  })

  test('it serves stuff with a base.', async () => {
    await sleep(100)
    const { close, port } = await serve({ base: 'X' })

    const raw = await fetch(`http://localhost:${port}/X/src/serve/serve.ts`)
    const text = await raw.text()

    expect(text).toMatch(/export function serve\(/)

    await close()
  })

  test('it serves stuff and injects a base.', async () => {
    await sleep(100)
    const { close, port } = await serve({ base: 'XAVIER', injectBase: true })

    const raw = await fetch(`http://localhost:${port}/XAVIER/docs/index.html`)
    const text = await raw.text()

    expect(text).toMatch(/<base\s+href=["']\/XAVIER\/["']\s*\/?>/)

    await close()
  })
})
