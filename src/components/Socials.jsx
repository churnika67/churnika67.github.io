import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { profile } from '../data/content'
import SocialTokens from '../three/SocialTokens'
import useInView from '../hooks/useInView'

export default function Socials() {
  const [ref, inView] = useInView('100px')
  const [hover, setHover] = useState(null)
  const compact = typeof window !== 'undefined' && window.innerWidth < 760
  const items = [
    { kind: 'github', label: 'GitHub', bg: '#f4f1ff', fg: '#0b0717', href: profile.socials.github },
    { kind: 'linkedin', label: 'LinkedIn', bg: '#0a66c2', fg: '#ffffff', href: profile.socials.linkedin },
    { kind: 'mail', label: 'Email', bg: '#f472b6', fg: '#1a0a14', href: `mailto:${profile.email}` },
    { kind: 'resume', label: 'Resume', bg: '#7c3aed', fg: '#ffffff', href: profile.resume, download: profile.resumeFileName },
  ]
  const hovered = items.find((i) => i.kind === hover)
  return (
    <section className="section socials" aria-label="Find me online">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <span className="eyebrow rv">Find me online</span>
        <h2 className="section-title rv">{hovered ? hovered.label : 'Say hi, anywhere'}<span className="grad-text">.</span></h2>
        <div className="socials-canvas rv" ref={ref}>
          <Canvas dpr={[1, 2]} frameloop={inView ? 'always' : 'never'} camera={{ position: [0, 0, compact ? 12.5 : 10], fov: compact ? 45 : 40 }}>
            <SocialTokens items={items} onHover={setHover} compact={compact} />
          </Canvas>
        </div>
        <div className="socials-legend">
          {items.map((i) => (
            <a key={i.kind} className="chip" href={i.href} target={i.download || i.href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" download={i.download}>
              <i style={{ background: i.bg }} />{i.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
