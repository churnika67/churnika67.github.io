import { useEffect } from 'react'
import { gsap, ScrollTrigger, reduceMotion } from '../lib/scroll'

// Any element with class "rv" fades/slides in when scrolled into view.
export default function useReveal(ready) {
  useEffect(() => {
    if (!ready || reduceMotion) return
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.rv', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
      })
    })
    return () => ctx.revert()
  }, [ready])
}
