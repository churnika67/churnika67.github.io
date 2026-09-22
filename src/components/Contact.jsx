import { useState } from 'react'
import { profile, site } from '../data/content'
import { Arrow, Send } from './Icons'
import { track } from '../lib/analytics'

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '', _honey: '' })
  const [status, setStatus] = useState('idle') // idle | sending | ok | err
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const mailtoHref = () => {
    const body = `${f.message}\n\n— ${f.name}${f.email ? ` (${f.email})` : ''}`
    return `mailto:${profile.email}?subject=${encodeURIComponent(f.subject || `Hello from ${f.name || 'your portfolio'}`)}&body=${encodeURIComponent(body)}`
  }

  // Sends straight to the inbox via FormSubmit (GitHub Pages has no server of its own).
  const submit = async (e) => {
    e.preventDefault()
    if (f._honey) return // bot trap
    setStatus('sending')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${site.formEmail}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: f.name,
          email: f.email,
          _replyto: f.email,
          _subject: f.subject ? `Portfolio: ${f.subject}` : `Portfolio message from ${f.name}`,
          message: f.message,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || String(data.success) === 'false') throw new Error(data.message || 'send failed')
      setStatus('ok')
      track('contact-form-sent')
      setF({ name: '', email: '', subject: '', message: '', _honey: '' })
    } catch {
      setStatus('err')
    }
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
            <input className="hp" tabIndex={-1} autoComplete="off" value={f._honey} onChange={set('_honey')} aria-hidden="true" />
            <button className="btn primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : <>Send message <Send /></>}
            </button>
            {status === 'ok' && <p className="form-status ok" role="status">Thanks! Your message is on its way. I’ll get back to you soon.</p>}
            {status === 'err' && (
              <p className="form-status err" role="alert">
                Couldn’t send right now. <a href={mailtoHref()} style={{ textDecoration: 'underline' }}>Email me directly instead</a>.
              </p>
            )}
            {status === 'idle' && <p className="note">Goes straight to my inbox.</p>}
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
