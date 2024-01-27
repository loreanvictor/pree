import { define } from 'https://esm.sh/minicomp'


console.log('LOADED')


define('say-hi', () => `
  <div>
    Hellow <slot></slot>
    <hr/>
    <slot name="footer"></slot>
  </span>
`)
