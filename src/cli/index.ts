#!/usr/bin/env node

import { main } from './main'
import { args } from './args'
import { conf } from './conf'
import { merge } from './types'

const { command, ...options } = args()
conf(options).then((config) => {
  main(command, merge(options, config)).catch((error) => {
    console.error(error)
    process.exit(1)
  })
})
