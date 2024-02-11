import { define } from 'https://esm.sh/minicomp'


define('small-device', ({ width = '768px' }) => `
  <style>
    @media (min-width: ${width}) {
      :host {
        display: none;
      }
    }
  </style>
  <slot></slot>
`)

define('large-device', ({ width = '767px' }) => `
  <style>
    @media (max-width: ${width}) {
      :host {
        display: none;
      }
    }
  </style>
  <slot></slot>
`)
