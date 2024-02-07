export type Task = () => Promise<any>

export interface ParallelOptions {
  concurrency?: number
}

const _DefaultOptions = {
  concurrency: 16
}

export async function parallel(tasks: Task[], options?: ParallelOptions): Promise<void> {
  const concurrency = options?.concurrency ?? _DefaultOptions.concurrency

  let cursor = 0
  let running = 0

  const run = (task: Task): Promise<void> => {
    running++
    cursor++

    return task().then(() => {
      running--
      const next = tasks[cursor]
      if (next && running < concurrency) {
        return run(next)
      }

      return
    })
  }

  await Promise.all(tasks.slice(0, concurrency).map(run))
}
