import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

// Shared, mutable scroll values read inside 3D render loops (no React re-renders).
export const heroState = { progress: 0 }
export const pointer = { x: 0, y: 0 }

export const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null
export function initSmoothScroll() {
  if (reduceMotion) return null
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}
export function scrollTo(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
}
export function lockScroll(lock) {
  document.body.classList.toggle('locked', lock)
  if (!lenis) return
  lock ? lenis.stop() : lenis.start()
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
  }, { passive: true })
}
