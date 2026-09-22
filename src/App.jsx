import { useEffect, useState } from 'react'
import { initSmoothScroll, ScrollTrigger } from './lib/scroll'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Statement from './components/Statement'
import TechStack from './components/TechStack'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Socials from './components/Socials'
import Contact from './components/Contact'
import useReveal from './hooks/useReveal'
import { initAnalytics, track } from './lib/analytics'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    initSmoothScroll()
    initAnalytics()
    // count resume downloads anywhere on the page
    const onClick = (e) => { if (e.target.closest?.('a[download]')) track('resume-download') }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (ready) setTimeout(() => ScrollTrigger.refresh(), 300)
  }, [ready])

  useReveal(ready)

  return (
    <>
      {!ready && <Loader onDone={() => setReady(true)} />}
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Nav />
      <main>
        <Hero ready={ready} />
        <About />
        <Statement />
        <TechStack />
        <Experience />
        <Projects />
        <Socials />
        <Contact />
      </main>
    </>
  )
}
