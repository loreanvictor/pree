import { define } from 'https://esm.sh/minicomp'


console.log('LOADED')


define('say-hi', ({ to }) => `<span>Hellow ${to}</span>`)
