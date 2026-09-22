// A procedural 3D "night studio": desk, monitors with live screens, speakers,
// acoustic wall, neon strip. Camera flies into the main monitor on scroll.
import { useMemo, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, MeshReflectorMaterial, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'
import { heroState, pointer } from '../lib/scroll'
import { profile } from '../data/content'

/* ---------- live screen textures ---------- */
function useTerminalTexture() {
  return useMemo(() => {
    const W = 1024, H = 576
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const ctx = c.getContext('2d')
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    const script = [
      ['$ ', 'whoami'],
      ['', `${profile.name.toLowerCase()}`],
      ['', 'data engineer · full-stack · ai/ml'],
      ['$ ', 'airflow dags trigger citibike_demand'],
      ['✔ ', 'extract → validate → features → train → serve'],
      ['$ ', 'python evaluate.py --vs baseline'],
      ['✔ ', 'operational penalty  ↓ 50.9%'],
      ['$ ', 'docker compose up api dashboard'],
      ['● ', 'fastapi :8000   streamlit :8501   ready'],
      ['$ ', 'open ./portfolio  # scroll ↓'],
    ]
    const state = { line: 3, ch: 0, t: 0, hold: 0 }
    const draw = (time) => {
      ctx.fillStyle = '#0b0818'; ctx.fillRect(0, 0, W, H)
      // title bar
      ctx.fillStyle = '#151029'; ctx.fillRect(0, 0, W, 44)
      ;['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(28 + i * 26, 22, 8, 0, 7); ctx.fill() })
      ctx.fillStyle = '#7a7399'; ctx.font = '500 20px JetBrains Mono, monospace'; ctx.textAlign = 'center'
      ctx.fillText('churnika@ub: ~/portfolio', W / 2, 29); ctx.textAlign = 'left'
      // glow grid
      ctx.strokeStyle = 'rgba(167,139,250,0.05)'; ctx.lineWidth = 1
      for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 44); ctx.lineTo(x, H); ctx.stroke() }
      ctx.font = '500 25px JetBrains Mono, monospace'
      let y = 92
      for (let i = 0; i <= state.line && i < script.length; i++) {
        const [pre, txt] = script[i]
        const shown = i < state.line ? txt : txt.slice(0, state.ch)
        ctx.fillStyle = pre === '$ ' ? '#f472b6' : pre === '✔ ' ? '#34d399' : pre === '● ' ? '#22d3ee' : '#a78bfa'
        ctx.fillText(pre, 36, y)
        ctx.fillStyle = pre === '$ ' ? '#f4f1ff' : '#b9b2d6'
        ctx.fillText(shown, 36 + ctx.measureText(pre).width, y)
        if (i === state.line && Math.floor(time * 2) % 2 === 0) {
          ctx.fillStyle = '#f4f1ff'; ctx.fillRect(36 + ctx.measureText(pre + shown).width + 2, y - 22, 13, 28)
        }
        y += 46
      }
      tex.needsUpdate = true
    }
    const step = (time, dt) => {
      state.t += dt
      if (state.t < 0.045) return
      state.t = 0
      if (state.line >= script.length) {
        state.hold += 1
        if (state.hold > 90) { state.line = 3; state.ch = 0; state.hold = 0 }
      } else {
        const [pre, txt] = script[state.line]
        const speed = pre === '$ ' ? 2 : 6
        state.ch += speed
        if (state.ch >= txt.length) { state.line++; state.ch = 0; state.t = -0.12 }
      }
      draw(time)
    }
    draw(0)
    return { tex, step }
  }, [])
}

function useChartTexture() {
  return useMemo(() => {
    const W = 384, H = 640
    const c = document.createElement('canvas'); c.width = W; c.height = H
    const ctx = c.getContext('2d')
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    let acc = 0
    const draw = (t) => {
      ctx.fillStyle = '#0b0818'; ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = '#7a7399'; ctx.font = '500 18px JetBrains Mono, monospace'
      ctx.fillText('station_demand / hr', 24, 42)
      // bars
      const cols = ['#22d3ee', '#a78bfa', '#f472b6']
      for (let i = 0; i < 10; i++) {
        const h = 60 + (Math.sin(t * 1.3 + i * 0.8) * 0.5 + 0.5) * 170
        ctx.fillStyle = cols[i % 3]
        ctx.globalAlpha = 0.85
        ctx.fillRect(24 + i * 34, 300 - h, 22, h)
      }
      ctx.globalAlpha = 1
      // sparkline
      ctx.strokeStyle = '#34d399'; ctx.lineWidth = 3; ctx.beginPath()
      for (let x = 0; x <= 336; x += 6) {
        const y = 440 + Math.sin(x * 0.04 + t * 2) * 30 + Math.sin(x * 0.11 + t) * 14
        x === 0 ? ctx.moveTo(24 + x, y) : ctx.lineTo(24 + x, y)
      }
      ctx.stroke()
      ctx.fillStyle = '#7a7399'; ctx.fillText('model: lightgbm', 24, 540)
      ctx.fillStyle = '#34d399'; ctx.fillText('● pipeline healthy', 24, 580)
      tex.needsUpdate = true
    }
    const step = (t, dt) => { acc += dt; if (acc > 1 / 20) { acc = 0; draw(t) } }
    draw(0)
    return { tex, step }
  }, [])
}

/* ---------- pieces ---------- */
function AcousticWall() {
  const ref = useRef()
  const cols = 22, rows = 9
  useEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    let i = 0
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const d = 0.08 + Math.random() * 0.06
      m.compose(new THREE.Vector3((c - cols / 2) * 0.62 + 0.31, r * 0.62 + 0.3, -3 + d / 2), q, new THREE.Vector3(1, 1, d / 0.1))
      ref.current.setMatrixAt(i++, m)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <instancedMesh ref={ref} args={[null, null, cols * rows]} receiveShadow>
      <boxGeometry args={[0.58, 0.58, 0.1]} />
      <meshStandardMaterial color="#1a1233" roughness={0.95} />
    </instancedMesh>
  )
}

function Speaker({ x }) {
  return (
    <group position={[x, 0, -0.9]} rotation={[0, -x * 0.09, 0]}>
      {/* stand */}
      <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.06, 0.06, 0.7, 12]} /><meshStandardMaterial color="#222" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.35, 0.35, 0.04, 24]} /><meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} /></mesh>
      <RoundedBox args={[0.95, 1.35, 0.85]} radius={0.06} position={[0, 1.4, 0]} castShadow>
        <meshStandardMaterial color="#d9d4e6" roughness={0.45} />
      </RoundedBox>
      {[[1.6, 0.3], [1.05, 0.14]].map(([y, r], i) => (
        <group key={i} position={[0, y, 0.43]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[r + 0.05, r + 0.05, 0.02, 32]} /><meshStandardMaterial color="#b9b3c9" roughness={0.5} /></mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.012]}><cylinderGeometry args={[r, r * 0.6, 0.03, 32]} /><meshStandardMaterial color="#111" roughness={0.6} /></mesh>
          <mesh position={[0, 0, 0.03]}><sphereGeometry args={[r * 0.28, 16, 16]} /><meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} /></mesh>
        </group>
      ))}
    </group>
  )
}

function Monitor({ w, h, position, rotation, tex, standH = 0.35 }) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[w + 0.08, h + 0.08, 0.06]} radius={0.03} castShadow>
        <meshStandardMaterial color="#0c0a14" metalness={0.5} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, -h / 2 - standH / 2, -0.06]}><boxGeometry args={[0.08, standH, 0.05]} /><meshStandardMaterial color="#1b1a22" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, -h / 2 - standH, -0.06]}><boxGeometry args={[0.5, 0.02, 0.3]} /><meshStandardMaterial color="#1b1a22" metalness={0.8} roughness={0.3} /></mesh>
    </group>
  )
}

function Keyboard() {
  const keys = useMemo(() => {
    const k = []
    for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) k.push([(c - 7) * 0.058, r * 0.056 - 0.11])
    return k
  }, [])
  const ref = useRef()
  useEffect(() => {
    const m = new THREE.Matrix4()
    keys.forEach(([x, z], i) => { m.setPosition(x, 0.02, z); ref.current.setMatrixAt(i, m) })
    ref.current.instanceMatrix.needsUpdate = true
  }, [keys])
  return (
    <group position={[0, 0.84, 0.35]}>
      <RoundedBox args={[0.95, 0.03, 0.33]} radius={0.012}><meshStandardMaterial color="#141221" roughness={0.6} /></RoundedBox>
      <instancedMesh ref={ref} args={[null, null, keys.length]}>
        <boxGeometry args={[0.05, 0.025, 0.048]} />
        <meshStandardMaterial color="#2b2448" emissive="#7c3aed" emissiveIntensity={0.25} roughness={0.5} />
      </instancedMesh>
    </group>
  )
}

function Rig() {
  const { camera, size } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  const mobile = size.width < 760
  useFrame((_, dt) => {
    const p = THREE.MathUtils.smoothstep(heroState.progress, 0, 1)
    const startZ = mobile ? 9.5 : 6.6
    const tx = THREE.MathUtils.lerp(pointer.x * 0.5, 0, p)
    const ty = THREE.MathUtils.lerp(1.75 + pointer.y * 0.25, 1.62, p)
    const tz = THREE.MathUtils.lerp(startZ, mobile ? 1.9 : 1.0, p)
    const k = 1 - Math.pow(0.001, dt)
    camera.position.x += (tx - camera.position.x) * k * 2
    camera.position.y += (ty - camera.position.y) * k * 2
    camera.position.z += (tz - camera.position.z) * k * 2
    look.set(0, THREE.MathUtils.lerp(1.52, 1.62, p), -0.35)
    camera.lookAt(look)
  })
  return null
}

export default function Studio() {
  const term = useTerminalTexture()
  const chart = useChartTexture()
  const strip = useRef()

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    term.step(t, dt)
    chart.step(t, dt)
    if (strip.current) {
      const hue = (0.75 + Math.sin(t * 0.3) * 0.08) % 1
      strip.current.color.setHSL(hue, 0.9, 0.6)
    }
  })

  return (
    <>
      <color attach="background" args={['#0a0718']} />
      <fog attach="fog" args={['#0a0718', 7, 16]} />
      <Rig />

      <ambientLight intensity={0.25} color="#b9a4ff" />
      <pointLight position={[-3.5, 3.2, 1]} intensity={25} color="#a855f7" distance={10} />
      <pointLight position={[3.5, 3, 1]} intensity={22} color="#ec4899" distance={10} />
      <pointLight position={[0, 1.8, 0.6]} intensity={4} color="#8b5cf6" distance={4} />
      <spotLight position={[0, 6, 3]} angle={0.5} penumbra={1} intensity={30} color="#c4b5fd" castShadow />

      <AcousticWall />

      {/* neon strip */}
      <mesh position={[0, 3.35, -2.85]}>
        <boxGeometry args={[9, 0.05, 0.05]} />
        <meshBasicMaterial ref={strip} color="#a855f7" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.02, -2.85]}>
        <boxGeometry args={[12, 0.03, 0.03]} />
        <meshBasicMaterial color="#ec4899" toneMapped={false} />
      </mesh>

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <MeshReflectorMaterial blur={[300, 80]} resolution={512} mixBlur={1} mixStrength={18} roughness={0.9} depthScale={1} minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#0d0a1c" metalness={0.5} mirror={0.5} />
      </mesh>

      {/* desk */}
      <group>
        <RoundedBox args={[4.4, 0.08, 1.5]} radius={0.03} position={[0, 0.8, -0.2]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1528" roughness={0.5} metalness={0.2} />
        </RoundedBox>
        {[[-2.05, -0.85], [2.05, -0.85], [-2.05, 0.45], [2.05, 0.45]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.4, z]}><boxGeometry args={[0.06, 0.8, 0.06]} /><meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} /></mesh>
        ))}
      </group>

      <Monitor w={2.1} h={1.18} position={[0, 1.62, -0.35]} rotation={[0, 0, 0]} tex={term.tex} standH={0.2} />
      <Monitor w={0.62} h={1.04} position={[-1.62, 1.6, -0.22]} rotation={[0, 0.45, 0]} tex={chart.tex} standH={0.21} />
      <Keyboard />

      {/* mouse + mug + lamp */}
      <RoundedBox args={[0.1, 0.04, 0.16]} radius={0.02} position={[0.72, 0.86, 0.38]}><meshStandardMaterial color="#e9e3ff" roughness={0.4} /></RoundedBox>
      <group position={[1.45, 0.94, 0.05]}>
        <mesh><cylinderGeometry args={[0.1, 0.09, 0.2, 24]} /><meshStandardMaterial color="#f472b6" roughness={0.35} /></mesh>
        <mesh position={[0.11, 0, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.05, 0.015, 8, 16]} /><meshStandardMaterial color="#f472b6" roughness={0.35} /></mesh>
      </group>
      <group position={[1.65, 0.84, -0.6]}>
        <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.12, 0.14, 0.04, 24]} /><meshStandardMaterial color="#222" metalness={0.7} /></mesh>
        <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.012, 0.012, 0.6, 8]} /><meshStandardMaterial color="#333" metalness={0.8} /></mesh>
        <mesh position={[0, 0.66, 0]}><sphereGeometry args={[0.1, 24, 24]} /><meshBasicMaterial color="#ffd7a8" toneMapped={false} /></mesh>
        <pointLight position={[0, 0.66, 0]} intensity={2.5} color="#ffb86b" distance={2.5} />
      </group>

      <Speaker x={-3.1} />
      <Speaker x={3.1} />

      {/* floating data cubes */}
      {[[-2.6, 2.6, -1.4, '#22d3ee'], [2.5, 2.9, -1.6, '#f472b6'], [-1.1, 2.75, -1.9, '#a78bfa']].map(([x, y, z, c], i) => (
        <Float key={i} speed={1.6} rotationIntensity={1.2} floatIntensity={1.4}>
          <mesh position={[x, y, z]}>
            <icosahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={1.4} roughness={0.2} toneMapped={false} />
          </mesh>
        </Float>
      ))}
      <Sparkles count={70} scale={[9, 4, 5]} position={[0, 2, -0.5]} size={2.2} speed={0.3} color="#c4b5fd" opacity={0.6} />
    </>
  )
}
