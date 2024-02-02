import { define, currentNode } from 'https://esm.sh/minicomp'


define('hex-line', () => {
  const node = currentNode()
  const L = Math.min(window.innerWidth, window.innerHeight)
  let top = Math.random() * L/2
  let left = Math.random() * L/2 + L/4
  const width = Math.random() * L/3 + L/6
  const T = width * 10

  setTimeout(() => {
    setInterval(() => {
      let rot = Math.floor(Math.random() * 6) * 60
      let dl = Math.cos(rot * Math.PI / 180) * L/2
      let dt = Math.sin(rot * Math.PI / 180) * L/2

      if (left < L/4) { dl = Math.abs(dl) }
      if (left > 3*L/4) { dl = -Math.abs(dl) }
      if (top < 0) { dt = Math.abs(dt) }
      if (top > L/2) { dt = -Math.abs(dt) }

      rot = Math.atan2(dt, dl) * 180 / Math.PI

      left = left + dl
      top = top + dt
      node.style.left = `${left}px`
      node.style.top = `${top}px`
      node.style.opacity = .15
      node.style.transform = `rotate(${rot}deg)`
      setTimeout(() => node.style.opacity = 0, T / 2)
    }, T)

    node.style.transition = `left ${T}ms linear, top ${T}ms linear, opacity ${T / 2.5}ms`
  }, Math.random() * 12000 + 3000)


  return `
    <style>
      :host {
        position: absolute;
        top: ${top}px;
        left: ${left}px;
        opacity: 0;
        width: ${width}px;
        height: 1px;
        background: var(--text-color);
      }
    </style>
  `
})


define('hex-lines', ({ n = 16 }) => `
  <style>
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
  </style>
  ${'<hex-line></hex-line>'.repeat(parseInt(n))}
  `)
