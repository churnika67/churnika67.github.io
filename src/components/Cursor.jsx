import { useEffect, useRef } from 'react'

export default function Cursor() {
  const glow = useRef(null)
  const dot = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    let x = innerWidth / 2, y = innerHeight / 2, gx = x, gy = y, raf
    const move = (e) => {
      x = e.clientX; y = e.clientY
      const t = e.target.closest?.('a, button, .proj, [data-cursor]')
      dot.current?.classList.toggle('big', !!t)
      // spotlight effect on cards
      const card = e.target.closest?.('.card')
      if (card) {
        const r = card.getBoundingClientRect()
        card.style.setProperty('--mx', `${x - r.left}px`)
        card.style.setProperty('--my', `${y - r.top}px`)
      }
    }
    const loop = () => {
      gx += (x - gx) * 0.12; gy += (y - gy) * 0.12
      if (glow.current) glow.current.style.transform = `translate(${gx}px, ${gy}px)`
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`
      raf = requestAnimationFrame(loop)
    }
    addEventListener('pointermove', move, { passive: true })
    loop()
    return () => { removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <>
      <div className="cursor-glow" ref={glow} aria-hidden="true" />
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
