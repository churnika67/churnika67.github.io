import { site } from '../data/content'

// GoatCounter: privacy-friendly visitor stats. Turned on by setting `site.goatcounter` in content.js.
export function initAnalytics() {
  if (!site.goatcounter || typeof document === 'undefined') return
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://gc.zgo.at/count.js'
  s.dataset.goatcounter = `https://${site.goatcounter}.goatcounter.com/count`
  document.head.appendChild(s)
}

// Count an event, e.g. track('resume-download'). Safe to call when analytics is off.
export function track(name) {
  try { window.goatcounter?.count?.({ path: name, title: name, event: true }) } catch { /* ignore */ }
}
