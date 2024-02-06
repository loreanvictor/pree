import { define } from 'https://esm.sh/minicomp'


define('emo-li', () => `
  <style>
  .holder {
    display: flex;
    gap: 1rem;
  }
  </style>
  <div class="holder">
    <span><slot name="emo"></slot></span>
    <div><slot></slot></div>
  </div>
`)
