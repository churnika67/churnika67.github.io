import { useEffect, useState } from 'react'
import { projects } from '../data/content'
import { lockScroll } from '../lib/scroll'
import ProjVisual from './ProjVisual'
import { Arrow } from './Icons'
import { track } from '../lib/analytics'

function tilt(e) {
  if (matchMedia('(hover: none)').matches) return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.transform = `perspective(1000px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`
}
const untilt = (e) => { e.currentTarget.style.transform = '' }

function Gallery({ p }) {
  const [idx, setIdx] = useState(0)
  return (
    <div className="gallery">
      <div className="gallery-main">
        <img src={p.images[idx]} alt={`${p.name} screenshot ${idx + 1} of ${p.images.length}`} />
      </div>
      {p.images.length > 1 && (
        <div className="gallery-thumbs">
          {p.images.map((src, k) => (
            <button key={src} className={k === idx ? 'on' : ''} onClick={() => setIdx(k)} aria-label={`Show screenshot ${k + 1}`}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Modal({ p, i, onClose }) {
  useEffect(() => {
    lockScroll(true)
    const k = (e) => e.key === 'Escape' && onClose()
    addEventListener('keydown', k)
    return () => { lockScroll(false); removeEventListener('keydown', k) }
  }, [onClose])
  return (
    <div className="modal-bg" onClick={onClose} role="dialog" aria-modal="true" aria-label={p.name}>
      <div className="modal" style={{ '--pa': p.accent }} onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <div className="modal-hero" style={p.images ? { height: 'auto' } : undefined}>
          {p.images ? <Gallery p={p} /> : <ProjVisual accent={p.accent} seed={i} />}
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
          {p.metric && !p.images && <div className="pv-metric" style={{ position: 'absolute', left: 28, bottom: 20 }}><b>{p.metric.value}</b><span>{p.metric.label}</span></div>}
        </div>
        <div className="modal-body">
          <span className="eyebrow" style={{ color: p.accent }}>{p.category}</span>
          <h3>{p.name}</h3>
          {p.metric && p.images && <p className="modal-metric"><b>{p.metric.value}</b> {p.metric.label}</p>}
          <p>{p.desc}</p>
          {p.caseStudy && (
            <div className="cs">
              <div><b>Problem</b><p>{p.caseStudy.problem}</p></div>
              <div><b>Approach</b><p>{p.caseStudy.approach}</p></div>
              <div><b>Result</b><p>{p.caseStudy.result}</p></div>
            </div>
          )}
          <div className="proj-tags" style={{ margin: '18px 0 24px' }}>{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
          <a className="btn primary" href={p.link} target="_blank" rel="noreferrer">View source on GitHub <Arrow /></a>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [open, setOpen] = useState(null)
  return (
    <section className="section" id="projects">
      <div className="wrap">
        <div className="projects-head">
          <div>
            <span className="eyebrow rv">My projects</span>
            <h2 className="section-title rv">Clean. Useful.<br />Shipped<span className="grad-text">.</span></h2>
          </div>
          <p className="section-sub rv">Seven builds across data engineering, full-stack apps and applied ML. Click any card for the full story.</p>
        </div>
        <div className="proj-grid">
          {projects.map((p, i) => (
            <button
              className="card proj rv" key={p.name} style={{ '--pa': p.accent }}
              onMouseMove={tilt} onMouseLeave={untilt} onClick={() => { setOpen(i); track(`project-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`) }}
              aria-label={`Open details for ${p.name}`}
            >
              <div className="proj-visual">
                {p.images
                  ? <img className="proj-shot" src={p.images[0]} alt={`${p.name} screenshot`} loading="lazy" />
                  : <ProjVisual accent={p.accent} seed={i} />}
                <span className="proj-cat">{p.category}</span>
                <span className="proj-num">{String(i + 1).padStart(2, '0')}</span>
                {p.metric && <div className="pv-metric"><b>{p.metric.value}</b><span>{p.metric.label}</span></div>}
              </div>
              <div className="proj-body">
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <div className="proj-tags">{p.tags.slice(0, 5).map((t) => <span key={t}>{t}</span>)}</div>
                <div className="proj-foot"><span>View details</span><span className="arrow"><Arrow width={16} height={16} /></span></div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {open !== null && <Modal p={projects[open]} i={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
