import { useEffect, useRef, useState } from 'react'
import { gsap, reduceMotion } from '../lib/scroll'
import { profile } from '../data/content'

export default function Loader({ onDone }) {
  const root = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    const counter = { v: 0 }
    const tl = gsap.timeline({
      onComplete: onDone,
    })
    tl.from('.loader-name span', { yPercent: 110, duration: 0.8, ease: 'expo.out', stagger: 0.04 })
      .to(counter, {
        v: 100, duration: reduceMotion ? 0.2 : 1.3, ease: 'power2.inOut',
        onUpdate: () => setN(Math.round(counter.v)),
      }, 0.1)
      .to('.loader-bar i', { width: '100%', duration: reduceMotion ? 0.2 : 1.3, ease: 'power2.inOut' }, 0.1)
      .to(root.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '+=0.15')
    return () => tl.kill()
  }, [onDone])

  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader-name">
        {profile.firstName.split('').map((c, i) => <span key={i}>{c}</span>)}
        <span className="grad-text">.</span>
      </div>
      <div className="loader-bar"><i /></div>
      <div className="loader-count">{String(n).padStart(3, '0')}%</div>
    </div>
  )
}
