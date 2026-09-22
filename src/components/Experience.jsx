import { useEffect, useRef } from 'react'
import { experience } from '../data/content'
import { gsap, ScrollTrigger } from '../lib/scroll'

export default function Experience() {
  const root = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.tl-line i', {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true },
      })
      gsap.utils.toArray('.tl-item').forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: 'top 65%', onEnter: () => el.classList.add('lit'), onLeaveBack: () => el.classList.remove('lit') })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section className="section" id="experience" ref={root}>
      <div className="wrap">
        <span className="eyebrow rv">Experience & education</span>
        <h2 className="section-title rv">The journey<span className="grad-text">.</span></h2>
        <div className="timeline">
          <div className="tl-line"><i /></div>
          {experience.map((e) => (
            <div className={`tl-item ${e.type === 'edu' ? 'edu' : ''}`} key={e.role + e.period}>
              <div className="tl-node" />
              <div className="tl-meta rv">
                <div className="tl-period">{e.period}</div>
                <div className="tl-kind">{e.type === 'edu' ? 'Education' : 'Work'}</div>
              </div>
              <div className="card tl-card rv">
                <div className="org">{e.org}</div>
                <h3>{e.role}</h3>
                {e.points.length > 0 && <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>}
                {e.tags.length > 0 && <div className="tl-tags">{e.tags.map((t) => <span key={t}>{t}</span>)}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
