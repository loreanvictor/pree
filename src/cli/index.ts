#!/usr/bin/env node

import { Builder } from '../build'
import { serve } from '../serve'


async function main() {
  if (process.argv[2] === 'build') {
    const builder = new Builder()
    await builder.build(process.argv[3]!, process.argv[4]!)
    await builder.close()
  } else if (process.argv[2] === 'serve') {
    await serve()
  }
}

main()
