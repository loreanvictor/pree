import { define } from 'https://esm.sh/minicomp'


define('say-hi', ({ to, greet = 'Hellow' }) => `<div>${greet} ${to}!</div>`)
