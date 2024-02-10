import { define } from 'https://esm.sh/minicomp'


define('emo-li', () => `
  <style>
  .holder {
    display: flex;
    gap: 1rem;
    align-items: baseline;

    & > span {
      width: 1.2rem;
      text-align: center;
      display: inline-block;
    }
  }

  </style>
  <div class="holder">
    <span><slot name="emo"></slot></span>
    <div><slot></slot></div>
  </div>
`)
