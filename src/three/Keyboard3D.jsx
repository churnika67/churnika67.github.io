// Interactive 3D keyboard where every keycap is a skill.
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, PresentationControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function labelTexture(text, color) {
  const S = 256
  const c = document.createElement('canvas'); c.width = S; c.height = S
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#1a1530'; ctx.fillRect(0, 0, S, S)
  const g = ctx.createRadialGradient(S / 2, S / 2, 10, S / 2, S / 2, S * 0.75)
  g.addColorStop(0, 'rgba(255,255,255,0.06)'); g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S)
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(34, 34, 11, 0, 7); ctx.fill()
  ctx.fillStyle = '#f4f1ff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  const words = text.split(' ')
  const lines = words.length > 1 && text.length > 9 ? words : [text]
  let size = 64
  ctx.font = `700 ${size}px "Bricolage Grotesque", Manrope, sans-serif`
  const widest = () => Math.max(...lines.map((l) => ctx.measureText(l).width))
  while (widest() > S - 40 && size > 22) { size -= 2; ctx.font = `700 ${size}px "Bricolage Grotesque", Manrope, sans-serif` }
  const lh = size * 1.05
  lines.forEach((l, i) => ctx.fillText(l, S / 2, S / 2 + 12 + (i - (lines.length - 1) / 2) * lh))
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function Key({ item, position, index, active, onHover, hovered }) {
  const ref = useRef()
  const mat = useRef()
  const tex = useMemo(() => labelTexture(item.s, item.c), [item])
  const base = useMemo(() => new THREE.Color('#141026'), [])
  const glow = useMemo(() => new THREE.Color(item.c), [item.c])
  const tmp = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const isHover = hovered === item.s
    const isActive = active === item.g
    const wave = Math.sin(t * 2.2 - (position[0] + position[2]) * 0.6) * 0.04
    const target = isHover ? -0.14 : isActive ? 0.22 : wave
    ref.current.position.y += (target - ref.current.position.y) * 0.18
    const k = isHover || isActive ? 1 : 0
    tmp.copy(base).lerp(glow, k * 0.55)
    mat.current.color.lerp(tmp, 0.15)
    mat.current.emissive.lerp(k ? glow : base, 0.15)
    mat.current.emissiveIntensity += ((k ? 0.9 : 0.05) - mat.current.emissiveIntensity) * 0.15
  })

  return (
    <group position={position}>
      <group
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); onHover(item); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { onHover(null); document.body.style.cursor = '' }}
      >
        <RoundedBox args={[1, 0.5, 1]} radius={0.12} smoothness={4} castShadow>
          <meshStandardMaterial ref={mat} color="#141026" roughness={0.45} metalness={0.15} />
        </RoundedBox>
        <mesh position={[0, 0.252, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.82, 0.82]} />
          <meshBasicMaterial map={tex} toneMapped={false} transparent />
        </mesh>
      </group>
    </group>
  )
}

export default function Keyboard3D({ skills, active, hovered, onHover, compact }) {
  const items = useMemo(() => skills.flatMap((g) => g.items.map((s) => ({ s, g: g.group, c: g.color }))), [skills])
  const perRow = compact ? 5 : 8
  const rows = Math.ceil(items.length / perRow)
  const gap = 1.14
  const w = perRow * gap + 0.5
  const d = rows * gap + 0.5

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 10, 6]} intensity={1.6} castShadow />
      <pointLight position={[-6, 3, -2]} intensity={40} color="#a855f7" distance={16} />
      <pointLight position={[6, 3, 3]} intensity={30} color="#ec4899" distance={16} />
      <PresentationControls global={false} cursor snap speed={1.4} zoom={1} polar={[-0.35, 0.3]} azimuth={[-0.7, 0.7]} config={{ mass: 1, tension: 170, friction: 26 }}>
        <group rotation={[0.1, 0, 0]}>
          <RoundedBox args={[w, 0.4, d]} radius={0.2} position={[0, -0.35, 0]} receiveShadow>
            <meshStandardMaterial color="#0c0918" roughness={0.35} metalness={0.6} />
          </RoundedBox>
          <mesh position={[0, -0.14, -d / 2 + 0.02]}>
            <boxGeometry args={[w - 0.5, 0.03, 0.03]} />
            <meshBasicMaterial color="#a855f7" toneMapped={false} />
          </mesh>
          {items.map((it, i) => {
            const r = Math.floor(i / perRow)
            const c = i % perRow
            const inRow = Math.min(perRow, items.length - r * perRow)
            const x = (c - (inRow - 1) / 2) * gap + (r % 2) * 0.18
            const z = (r - (rows - 1) / 2) * gap
            return <Key key={it.s} item={it} index={i} position={[x, 0, z]} active={active} hovered={hovered} onHover={onHover} />
          })}
        </group>
      </PresentationControls>
      <ContactShadows position={[0, -0.8, 0]} opacity={0.6} scale={20} blur={2.6} far={4} color="#000" />
    </>
  )
}
