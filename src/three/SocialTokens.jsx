// Floating, clickable 3D tokens for GitHub, LinkedIn, Email and Resume.
import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { pointer } from '../lib/scroll'

function faceTexture(kind, bg, fg) {
  const S = 512
  const c = document.createElement('canvas'); c.width = S; c.height = S
  const x = c.getContext('2d')
  x.fillStyle = bg; x.fillRect(0, 0, S, S)
  x.strokeStyle = fg; x.fillStyle = fg; x.lineCap = 'round'; x.lineJoin = 'round'
  x.save(); x.translate(S / 2, S / 2)
  if (kind === 'github') {
    x.scale(11, 11); x.translate(-12, -12); x.lineWidth = 1.7
    x.stroke(new Path2D('M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'))
  } else if (kind === 'linkedin') {
    x.font = '800 250px "Bricolage Grotesque", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'
    x.fillText('in', 0, 10)
  } else if (kind === 'mail') {
    x.lineWidth = 22
    x.strokeRect(-150, -105, 300, 210)
    x.beginPath(); x.moveTo(-150, -105); x.lineTo(0, 20); x.lineTo(150, -105); x.stroke()
  } else {
    x.lineWidth = 20
    x.beginPath(); x.moveTo(-100, -150); x.lineTo(50, -150); x.lineTo(110, -90); x.lineTo(110, 150); x.lineTo(-100, 150); x.closePath(); x.stroke()
    x.font = '800 96px "Bricolage Grotesque", Arial, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'
    x.fillText('CV', 5, 20)
  }
  x.restore()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function Token({ kind, bg, fg, href, download, position, onHover }) {
  const ref = useRef()
  const [hover, setHover] = useState(false)
  const tex = useMemo(() => faceTexture(kind, bg, fg), [kind, bg, fg])
  useFrame(() => {
    const g = ref.current
    const s = hover ? 1.15 : 1
    g.scale.x += (s - g.scale.x) * 0.12; g.scale.y = g.scale.z = g.scale.x
    g.rotation.y += ((pointer.x * 0.5 + (hover ? 0.25 : 0)) - g.rotation.y) * 0.08
    g.rotation.x += ((-pointer.y * 0.35) - g.rotation.x) * 0.08
  })
  const open = () => {
    if (download) { const a = document.createElement('a'); a.href = href; a.download = download; a.click() }
    else window.open(href, href.startsWith('mailto:') ? '_self' : '_blank', 'noopener')
  }
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.2} floatingRange={[-0.2, 0.2]}>
      <group
        ref={ref} position={position}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); onHover(kind); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHover(false); onHover(null); document.body.style.cursor = '' }}
        onClick={open}
      >
        <RoundedBox args={[2, 2, 0.45]} radius={0.38} smoothness={6}>
          <meshStandardMaterial color={bg} roughness={0.25} metalness={0.25} />
        </RoundedBox>
        <mesh position={[0, 0, 0.228]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

export default function SocialTokens({ items, onHover, compact }) {
  const pos = compact
    ? [[-1.3, 1.3, 0], [1.3, 1.3, 0], [-1.3, -1.3, 0], [1.3, -1.3, 0]]
    : [[-4.5, 0.4, 0], [-1.5, -0.5, 0.6], [1.5, 0.5, 0], [4.5, -0.3, 0.4]]
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <pointLight position={[-6, -2, 3]} intensity={40} color="#a855f7" distance={14} />
      <pointLight position={[6, 2, 3]} intensity={30} color="#ec4899" distance={14} />
      {items.map((it, i) => <Token key={it.kind} {...it} position={pos[i]} onHover={onHover} />)}
      <Sparkles count={50} scale={[14, 6, 4]} size={2} speed={0.4} color="#c4b5fd" opacity={0.5} />
    </>
  )
}
