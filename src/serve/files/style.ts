export const STYLES = `
:root {
  --primary-color: #2D9596;
}

@media (prefers-color-scheme: dark) {
  :root {
    --border-expression: 0.15;
    --background-color: #000;
    --text-color: #ECF4D6;
  }
}

.footer {
  text-align: right;
  margin-top: 3rem;
}

.footer img {
  opacity: calc(var(--border-expression) * 2);
  filter: grayscale(1);
  transition: opacity .2s ease-out, filter .2s ease-out;
}

.footer img:hover {
  opacity: 1;
  filter: grayscale(0);
}
`

export const FOOTER = `
<div class="footer">
  <a href="https://github.com/loreanvictor/pree" target="_blank">
    <img src="https://raw.githubusercontent.com/loreanvictor/pree/main/logo.svg" height="32px"/>
  </a>
</div>
`
