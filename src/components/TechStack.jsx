import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { skills } from '../data/content'
import Keyboard3D from '../three/Keyboard3D'
import useInView from '../hooks/useInView'
import { Drag } from './Icons'

export default function TechStack() {
  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [ref, inView] = useInView('100px')
  const compact = typeof window !== 'undefined' && window.innerWidth < 760
  const activeGroup = skills.find((g) => g.group === (hovered?.g || active))

  return (
    <section className="section" id="stack">
      <div className="wrap">
        <span className="eyebrow rv">Tech stack</span>
        <h2 className="section-title rv">Pipeline to pixel<span className="grad-text">.</span><br />Now in 3D.</h2>
        <p className="section-sub rv">Every key is a tool I build with. Hover a key, pick a category, or drag the board to explore.</p>

        <div className="stack3d-grid">
          <div className="stack3d-canvas rv" ref={ref}>
            <Canvas
              shadows
              dpr={[1, 2]}
              frameloop={inView ? 'always' : 'never'}
              camera={{ position: [0, compact ? 12 : 8.2, compact ? 7 : 5.6], fov: compact ? 45 : 42 }}
            >
              <Keyboard3D skills={skills} active={active} hovered={hovered?.s} onHover={setHovered} compact={compact} />
            </Canvas>
            <div className="stack3d-hint"><Drag width={14} height={14} /> Drag to explore</div>
          </div>

          <div className="stack-side rv">
            {skills.map((g) => (
              <button
                key={g.group}
                className={`stack-group ${active === g.group ? 'active' : ''}`}
                style={{ '--gc': g.color }}
                onMouseEnter={() => setActive(g.group)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(g.group)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === g.group ? null : g.group)}
              >
                <b><i />{g.group}</b><span>{g.items.length}</span>
              </button>
            ))}
            <div className="stack-readout" aria-live="polite">
              {hovered ? (<><b>{hovered.s}</b>{hovered.g}</>)
                : activeGroup ? (<><b>{activeGroup.group}</b>{activeGroup.items.join(' · ')}</>)
                : (<><b>{skills.reduce((n, g) => n + g.items.length, 0)} tools</b>across {skills.length} categories</>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
