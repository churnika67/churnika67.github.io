import { useEffect, useRef } from 'react'
import useInView from '../hooks/useInView'

// Generative animated artwork for each project card (no screenshots needed).
export default function ProjVisual({ accent, seed = 0 }) {
  const canvas = useRef(null)
  const [wrap, inView] = useInView('50px')

  useEffect(() => {
    const c = canvas.current
    if (!c || !inView) return
    const ctx = c.getContext('2d')
    const dpr = Math.min(devicePixelRatio, 2)
    let W, H, raf, last = 0
    const size = () => { W = c.offsetWidth; H = c.offsetHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    size()
    const style = seed % 3
    const draw = (ms) => {
      raf = requestAnimationFrame(draw)
      if (ms - last < 33) return
      last = ms
      const t = ms / 1000
      const g = ctx.createLinearGradient(0, 0, W, H)
      g.addColorStop(0, '#120d26'); g.addColorStop(1, '#07060f')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
      // glow blob
      const bx = W * (0.7 + Math.sin(t * 0.5 + seed) * 0.12), by = H * (0.35 + Math.cos(t * 0.4 + seed) * 0.15)
      const rg = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(W, H) * 0.6)
      rg.addColorStop(0, accent + '88'); rg.addColorStop(1, 'transparent')
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = accent; ctx.fillStyle = accent
      if (style === 0) {
        // flowing waves
        for (let k = 0; k < 14; k++) {
          ctx.globalAlpha = 0.08 + k * 0.03
          ctx.lineWidth = 1.2
          ctx.beginPath()
          for (let x = 0; x <= W; x += 8) {
            const y = H * 0.55 + Math.sin(x * 0.012 + t + k * 0.35) * (20 + k * 3) + Math.sin(x * 0.03 - t * 0.7) * 8 - k * 6
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      } else if (style === 1) {
        // dot matrix
        for (let x = 12; x < W; x += 18) for (let y = 12; y < H; y += 18) {
          const d = Math.sin(x * 0.02 + t * 1.5) * Math.cos(y * 0.03 - t) * 0.5 + 0.5
          ctx.globalAlpha = 0.1 + d * 0.8
          ctx.beginPath(); ctx.arc(x, y, 1 + d * 2.2, 0, 7); ctx.fill()
        }
      } else {
        // bar chart / grid
        ctx.globalAlpha = 0.12; ctx.lineWidth = 1
        for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
        for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }
        const n = Math.floor(W / 28)
        for (let i = 0; i < n; i++) {
          const h = (Math.sin(i * 0.7 + t * 1.2 + seed) * 0.5 + 0.5) * H * 0.55 + 10
          ctx.globalAlpha = 0.25 + (i / n) * 0.5
          ctx.fillRect(i * 28 + 6, H - h, 16, h)
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(draw)
    addEventListener('resize', size)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
  }, [inView, accent, seed])

  return <div ref={wrap} style={{ position: 'absolute', inset: 0 }}><canvas ref={canvas} aria-hidden="true" /></div>
}
