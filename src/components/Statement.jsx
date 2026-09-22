import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { about } from '../data/content'
import { ScrollTrigger } from '../lib/scroll'
import DataSphere from '../three/DataSphere'
import useInView from '../hooks/useInView'

const HIGHLIGHT = /^(raw|data|pipeline|prediction|interface|whole)/i

export default function Statement() {
  const section = useRef(null)
  const progress = useRef(0)
  const [viewRef, inView] = useInView('0px')
  const words = about.statement.split(' ')

  useEffect(() => {
    const els = section.current.querySelectorAll('.w')
    const st = ScrollTrigger.create({
      trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (s) => {
        progress.current = s.progress
        const lit = Math.floor(s.progress * 1.15 * els.length)
        els.forEach((el, i) => el.classList.toggle('on', i < lit))
      },
    })
    return () => st.kill()
  }, [])

  return (
    <section className="statement" ref={section} aria-label="Statement">
      <div className="statement-sticky" ref={viewRef}>
        <div className="statement-canvas" aria-hidden="true">
          <Canvas dpr={[1, 1.75]} frameloop={inView ? 'always' : 'never'} camera={{ position: [0, 0, 7], fov: 50 }}>
            <DataSphere progress={progress} />
          </Canvas>
        </div>
        <div className="wrap">
          <p className="statement-text">
            {words.map((w, i) => <span key={i} className={`w ${HIGHLIGHT.test(w) ? 'hl' : ''}`}>{w}</span>)}
          </p>
        </div>
        <div className="statement-hint">Keep scrolling</div>
      </div>
    </section>
  )
}
