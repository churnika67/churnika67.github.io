import { useState } from 'react'
import { profile } from '../data/content'
import { Arrow, Send } from './Icons'

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  // GitHub Pages has no server, so the form opens the visitor's email app pre-filled.
  const submit = (e) => {
    e.preventDefault()
    const body = `${f.message}\n\n— ${f.name}${f.email ? ` (${f.email})` : ''}`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(f.subject || `Hello from ${f.name || 'your portfolio'}`)}&body=${encodeURIComponent(body)}`
  }

  const links = [
    ['Email', profile.email, `mailto:${profile.email}`],
    ['LinkedIn', 'in/churnika', profile.socials.linkedin],
    ['GitHub', 'churnika67', profile.socials.github],
    ['Phone', profile.phone, `tel:${profile.phone.replace(/[^+\d]/g, '')}`],
  ]

  return (
    <section className="section" id="contact" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        <span className="eyebrow rv">Contact me</span>
        <h2 className="contact-big rv">Let’s talk<span className="grad-text">.</span></h2>
        <p className="section-sub rv">Hiring for data engineering, full-stack or AI/ML? Or just want to talk pipelines? My inbox is open.</p>

        <div className="contact-grid">
          <form className="card form rv" onSubmit={submit}>
            <div className="row">
              <label>Name<input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
              <label>Email address<input type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></label>
            </div>
            <label>Subject<input value={f.subject} onChange={set('subject')} /></label>
            <label>Message<textarea required value={f.message} onChange={set('message')} /></label>
            <button className="btn primary" type="submit">Send message <Send /></button>
            <p className="note">Opens your email app with the message ready to send.</p>
          </form>
          <div className="contact-links">
            {links.map(([k, v, href]) => (
              <a key={k} className="card clink rv" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span><span className="k">{k}</span><br /><span className="v">{v}</span></span>
                <Arrow />
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-marquee" aria-hidden="true">
          {[0, 1].map((k) => (
            <div key={k}>
              {['Data Engineer', '✦', 'Full-Stack', '✦', 'AI / ML', '✦'].map((t, i) => <span key={i}>{t}</span>)}
            </div>
          ))}
        </div>
        <div className="wrap footer-bar">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with React, Three.js & GSAP · {profile.location}</span>
        </div>
      </footer>
    </section>
  )
}
