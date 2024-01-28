#!/usr/bin/env node

import { main } from './main'
import { args } from './args'

const { command, ...options } = args()
main(command, options).catch(() => process.exit(1))
