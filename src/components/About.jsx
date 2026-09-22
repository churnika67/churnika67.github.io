import { useEffect, useRef, useState } from 'react'
import { profile, about, skills, experience } from '../data/content'
import { gsap, ScrollTrigger, reduceMotion } from '../lib/scroll'
import Globe from './Globe'
import { Copy, Check, Download } from './Icons'

function CopyRow({ value }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(value) } catch { /* ignore */ }
    setDone(true); setTimeout(() => setDone(false), 1600)
  }
  return (
    <button className={`copy-row ${done ? 'done' : ''}`} onClick={copy} aria-label={`Copy ${value}`}>
      <span>{done ? 'Copied!' : value}</span>{done ? <Check /> : <Copy />}
    </button>
  )
}

function Stat({ value, suffix, label }) {
  const ref = useRef(null)
  const numeric = typeof value === 'number'
  const [n, setN] = useState(numeric && !reduceMotion ? 0 : value)
  useEffect(() => {
    if (!numeric || reduceMotion) return
    const o = { v: 0 }
    const st = ScrollTrigger.create({
      trigger: ref.current, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { v: value, duration: 1.6, ease: 'power3.out', onUpdate: () => setN(Math.round(o.v)) }),
    })
    return () => st.kill()
  }, [numeric, value])
  return (
    <div className="stat" ref={ref}>
      <div className="num grad-text">{n}{suffix}</div>
      <div className="lbl">{label}</div>
    </div>
  )
}

export default function About() {
  const all = skills.flatMap((g) => g.items.map((s) => ({ s, c: g.color })))
  const half = Math.ceil(all.length / 2)
  const rows = [all.slice(0, half), all.slice(half)]
  const current = experience.find((e) => e.period.includes('Present'))

  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="about-head">
          <div>
            <span className="eyebrow rv">About me</span>
            <h2 className="section-title rv">Data, end to end<span className="grad-text">.</span></h2>
          </div>
          <p className="section-sub rv">{profile.tagline}</p>
        </div>

        <div className="bento">
          <div className="card c-profile rv">
            <div className="avatar-ring"><img src={profile.photo} alt={`Portrait of ${profile.name}`} /></div>
            <div className="pname">{profile.name}</div>
            <div className="prole">{profile.roles.join(' · ')}</div>
            <CopyRow value={profile.email} />
            <CopyRow value={profile.phone} />
            <a className="btn primary" href={profile.resume} download={profile.resumeFileName}>Download resume <Download /></a>
          </div>

          <div className="card c-globe rv">
            <div className="globe-text">
              <span className="label">Based in {profile.location}</span>
              <h3 style={{ marginTop: 10 }}>From Coimbatore to Buffalo, and ready for wherever’s next.</h3>
              <p>B.Tech in India, MS in New York. Drag the globe to spin it.</p>
            </div>
            <Globe />
          </div>

          <div className="card c-stack rv">
            <span className="label">My tech stack</span>
            {rows.map((row, i) => (
              <div className={`marquee ${i ? 'rev' : ''}`} key={i}>
                {[0, 1].map((k) => (
                  <div className="marquee-track" key={k} aria-hidden={k === 1}>
                    {row.map(({ s, c }) => <span className="chip" key={s}><i style={{ background: c }} />{s}</span>)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="card c-bio rv">
            <span className="label">Philosophy</span>
            <p className="quote">“{about.headline}”</p>
            {about.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <div className="card c-now rv">
            <span className="label">Right now</span>
            <ul>
              <li><span><b>{profile.status}</b>: Data Engineering, Full-Stack and AI/ML roles</span></li>
              {current && <li><span><b>{current.role.split(',')[0]}</b> at {current.org}</span></li>}
              <li><span><b>MS Data Science</b>, graduating Dec 2026</span></li>
            </ul>
          </div>

          <div className="card c-lens rv">
            <span className="label">Product lens</span>
            <h3 style={{ marginTop: 10 }}>I build for the decision someone has to make, not just the metric.</h3>
            <div className="lens-grid">
              {about.productLens.map((l, k) => (
                <div key={l.title}><i>0{k + 1}</i><b>{l.title}</b><p>{l.text}</p></div>
              ))}
            </div>
          </div>

          <div className="card c-stats rv">
            {about.stats.map((s) => <Stat key={s.label} {...s} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
