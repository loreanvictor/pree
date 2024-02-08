import sleep from 'sleep-promise'

import { parallel } from '../parallel'


describe(parallel, () => {
  test('runs tasks in parallel', async () => {
    const res: string[] = []

    const tasks = [
      () => sleep(10).then(() => res.push('A')),
      () => sleep(30).then(() => res.push('B')),
      () => sleep(10).then(() => res.push('C')),
    ]

    await parallel(tasks, { concurrency: 2 })

    expect(res).toEqual(['A', 'C', 'B'])
  })

  test('assumes 5 as default concurrency', async () => {
    const res: string[] = []

    const tasks = [
      () => sleep(10).then(() => res.push('A')),
      () => sleep(30).then(() => res.push('B')),
      () => sleep(10).then(() => res.push('C')),
      () => sleep(30).then(() => res.push('D')),
      () => sleep(10).then(() => res.push('E')),
      () => sleep(10).then(() => res.push('F')),
      () => sleep(10).then(() => res.push('G')),
    ]

    await parallel(tasks)

    expect(res).toEqual(['A', 'C', 'E', 'F', 'G', 'B', 'D'])
  })
})
