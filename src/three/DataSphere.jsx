// A rotating "neural" point cloud with connecting lines, used behind the statement.
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { pointer } from '../lib/scroll'

export default function DataSphere({ progress }) {
  const group = useRef()
  const { points, lines } = useMemo(() => {
    const N = 420
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const palette = ['#a78bfa', '#f472b6', '#22d3ee', '#c4b5fd'].map((c) => new THREE.Color(c))
    const v = []
    for (let i = 0; i < N; i++) {
      // fibonacci sphere with some jitter
      const y = 1 - (i / (N - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = i * 2.399963
      const R = 2.6 + (Math.random() - 0.5) * 0.35
      const p = new THREE.Vector3(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R)
      v.push(p)
      pos.set([p.x, p.y, p.z], i * 3)
      const c = palette[i % palette.length]
      col.set([c.r, c.g, c.b], i * 3)
    }
    const seg = []
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      if (v[i].distanceTo(v[j]) < 0.5 && Math.random() < 0.6) seg.push(v[i].x, v[i].y, v[i].z, v[j].x, v[j].y, v[j].z)
    }
    const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    pg.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const lg = new THREE.BufferGeometry()
    lg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3))
    return { points: pg, lines: lg }
  }, [])

  useFrame((s, dt) => {
    const g = group.current
    const p = progress.current
    g.rotation.y += dt * 0.08
    g.rotation.x += ((pointer.y * 0.3 + p * 0.8) - g.rotation.x) * 0.05
    g.rotation.z += ((pointer.x * 0.2) - g.rotation.z) * 0.05
    const sc = 0.85 + p * 0.5
    g.scale.setScalar(sc)
  })

  return (
    <group ref={group} position={[2.2, 0, 0]}>
      <points geometry={points}>
        <pointsMaterial size={0.05} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.22} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  )
}
