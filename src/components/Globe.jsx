import { useEffect, useRef } from 'react'
import createGlobe from 'cobe'
import useInView from '../hooks/useInView'

const BUFFALO = [42.8864, -78.8784]
const COIMBATORE = [11.0168, 76.9558]

// Interactive dotted globe (drag to spin) with an arc from Coimbatore to Buffalo.
export default function Globe() {
  const canvas = useRef(null)
  const [wrap, inView] = useInView('100px')
  const drag = useRef(null)
  const phiOffset = useRef(0)

  useEffect(() => {
    if (!inView || !canvas.current) return
    const el = canvas.current
    let width = el.offsetWidth
    const dpr = Math.min(window.devicePixelRatio, 2)
    let phi = 4.3
    const globe = createGlobe(el, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi, theta: 0.32,
      dark: 1, diffuse: 1.4,
      mapSamples: 18000, mapBrightness: 5.5, mapBaseBrightness: 0.02,
      baseColor: [0.22, 0.16, 0.45],
      markerColor: [0.96, 0.45, 0.71],
      glowColor: [0.42, 0.26, 0.85],
      markers: [
        { location: BUFFALO, size: 0.08 },
        { location: COIMBATORE, size: 0.05, color: [0.13, 0.83, 0.93] },
      ],
      arcs: [{ from: COIMBATORE, to: BUFFALO, color: [0.65, 0.55, 0.98] }],
      arcColor: [0.65, 0.55, 0.98], arcWidth: 0.6, arcHeight: 0.35,
      markerElevation: 0.02,
    })
    let raf
    const loop = () => {
      if (drag.current === null) phi += 0.0035
      globe.update({ phi: phi + phiOffset.current })
      raf = requestAnimationFrame(loop)
    }
    loop()
    requestAnimationFrame(() => (el.style.opacity = '1'))
    const onResize = () => {
      width = el.offsetWidth
      globe.update({ width: width * dpr, height: width * dpr })
    }
    addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); globe.destroy(); removeEventListener('resize', onResize) }
  }, [inView])

  const down = (e) => { drag.current = e.clientX - phiOffset.current * 200; e.currentTarget.style.cursor = 'grabbing' }
  const up = (e) => { drag.current = null; e.currentTarget.style.cursor = 'grab' }
  const move = (e) => { if (drag.current !== null) phiOffset.current = (e.clientX - drag.current) / 200 }

  return (
    <div className="globe-wrap" ref={wrap}>
      <canvas
        ref={canvas}
        style={{ opacity: 0, transition: 'opacity 1s' }}
        onPointerDown={down} onPointerUp={up} onPointerOut={up} onPointerMove={move}
        aria-label="Globe showing Coimbatore, India and Buffalo, New York"
        role="img"
      />
    </div>
  )
}
