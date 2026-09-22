import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import Studio from '../three/Studio'
import { profile } from '../data/content'
import { gsap, ScrollTrigger, heroState, reduceMotion } from '../lib/scroll'
import useInView from '../hooks/useInView'

export default function Hero({ ready }) {
  const section = useRef(null)
  const [viewRef, inView] = useInView('0px')
  const [lowPower] = useState(() => window.innerWidth < 760)

  // Scroll-driven camera + title
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (s) => { heroState.progress = s.progress },
      })
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      })
      tl.to('.hero-name .ch', { yPercent: -60, opacity: 0, stagger: 0.02, ease: 'power2.in', duration: 0.4 }, 0)
        .to('.hero-hi, .hero-bottom', { opacity: 0, y: -30, duration: 0.25 }, 0)
        .to('.hero-flash', { opacity: 1, duration: 0.2 }, 0.8)
    }, section)
    return () => ctx.revert()
  }, [])

  // Intro animation after loader
  useEffect(() => {
    if (!ready || reduceMotion) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-name .ch', { yPercent: 120, rotate: 8, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.05, delay: 0.2 })
      gsap.from('.hero-hi', { opacity: 0, y: 20, duration: 1, delay: 0.3 })
      gsap.from('.hero-bottom > *', { opacity: 0, y: 30, duration: 1, stagger: 0.1, delay: 0.7 })
    }, section)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero" id="top" ref={section} aria-label="Intro">
      <div className="hero-sticky" ref={viewRef}>
        <div className="hero-canvas" aria-hidden="true">
          <Canvas
            shadows={!lowPower}
            dpr={lowPower ? [1, 1.5] : [1, 2]}
            frameloop={inView ? 'always' : 'never'}
            camera={{ position: [0, 1.8, 7], fov: 42, near: 0.1, far: 40 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <Studio />
              <EffectComposer disableNormalPass multisampling={0}>
                <Bloom intensity={1.1} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur />
              </EffectComposer>
            </Suspense>
          </Canvas>
        </div>
        <div className="hero-vignette" />

        <div className="hero-top">
          <div className="hero-hi">Hi, I’m</div>
          <h1 className="hero-name" aria-label={profile.name}>
            {profile.firstName.toUpperCase().split('').map((c, i) => <span className="ch" key={i} aria-hidden="true">{c}</span>)}
          </h1>
        </div>

        <div className="hero-bottom">
          <div className="hero-roles">
            <span><span className="dot" />{profile.status}</span>
            {profile.roles.map((r) => <b key={r}>{r}</b>)}
          </div>
          <div className="scroll-cue"><span>Scroll</span><i /></div>
          <p className="hero-tag">{profile.tagline}</p>
        </div>
        <div className="hero-flash" />
      </div>
    </section>
  )
}
