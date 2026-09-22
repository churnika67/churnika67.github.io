import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/content'
import { scrollTo, lockScroll, gsap, ScrollTrigger } from '../lib/scroll'
import { Download } from './Icons'

const links = [
  ['Home', '#top'],
  ['About', '#about'],
  ['Stack', '#stack'],
  ['Experience', '#experience'],
  ['Projects', '#projects'],
  ['Contact', '#contact'],
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const bar = useRef(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => {
        gsap.set(bar.current, { scaleX: self.progress })
        setHidden(self.direction === 1 && self.scroll() > 400)
      },
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    lockScroll(open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollTo(href === '#top' ? document.body : href), open ? 350 : 0)
  }

  return (
    <>
      <div className="progress" ref={bar} />
      <header className={`nav ${hidden && !open ? 'hidden' : ''}`}>
        <button className={`menu-btn ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          <span />
        </button>
        <a href="#top" className="nav-avatar" onClick={(e) => go(e, '#top')} aria-label="Back to top">
          <img src={profile.photo} alt="" />
        </a>
        <div className="nav-right">
          <a className="btn" href={profile.resume} download={profile.resumeFileName}>
            Resume <Download />
          </a>
        </div>
      </header>
      <nav className={`menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <ol>
          {links.map(([label, href]) => (
            <li key={href}><a href={href} onClick={(e) => go(e, href)} tabIndex={open ? 0 : -1}>{label}</a></li>
          ))}
        </ol>
        <div className="menu-foot">
          <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1}>{profile.email}</a>
          <a href={profile.socials.github} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>GitHub ↗</a>
          <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>LinkedIn ↗</a>
        </div>
      </nav>
    </>
  )
}
