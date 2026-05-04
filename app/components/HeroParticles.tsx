'use client'

import { useEffect, useRef } from 'react'

const N = 210
const REPEL_R = 0.45
const REPEL_F = 0.005
const SPRING  = 0.00035
const DAMP    = 0.965
const DRIFT   = 0.00055

// RGB palette — dim greens + teals
const PALETTE = [
  [0.184, 0.306, 0.157], // #4a7c3f
  [0.478, 0.714, 0.282], // #7ab648
  [0.184, 0.384, 0.357], // #4a9b8e
  [0.141, 0.235, 0.118], // #243c1f
  [0.200, 0.420, 0.380], // brighter teal
]

export default function HeroParticles() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let animId: number
    let cleanupFn: (() => void) | null = null
    let active = true

    ;(async () => {
      const THREE = await import('three')
      if (!active) return

      const w = mount.clientWidth
      const h = mount.clientHeight

      // Scene
      const scene    = new THREE.Scene()
      const camera   = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
      camera.position.z = 2

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(w, h)
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)

      // Buffers
      const positions  = new Float32Array(N * 3)
      const aColor     = new Float32Array(N * 3)
      const aSize      = new Float32Array(N)
      const velocities = new Float32Array(N * 2)
      const homePos    = new Float32Array(N * 2)

      for (let i = 0; i < N; i++) {
        const x = (Math.random() - 0.5) * 4.2
        const y = (Math.random() - 0.5) * 3.2
        const z = (Math.random() - 0.5) * 0.6

        positions[i * 3]     = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
        homePos[i * 2]       = x
        homePos[i * 2 + 1]   = y

        velocities[i * 2]     = (Math.random() - 0.5) * 0.0012
        velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.0012

        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]
        const b = 0.28 + Math.random() * 0.58
        aColor[i * 3]     = c[0] * b
        aColor[i * 3 + 1] = c[1] * b
        aColor[i * 3 + 2] = c[2] * b

        // ~15% large "cells", rest small
        aSize[i] = Math.random() < 0.15
          ? 4 + Math.random() * 6
          : 1.2 + Math.random() * 2.8
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('aColor',   new THREE.BufferAttribute(aColor,   3))
      geometry.setAttribute('aSize',    new THREE.BufferAttribute(aSize,    1))

      const material = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: /* glsl */`
          attribute float aSize;
          attribute vec3  aColor;
          varying   vec3  vColor;
          varying   float vAlpha;
          uniform   float uTime;

          void main() {
            vColor = aColor;
            float pulse = 0.82 + 0.18 * sin(uTime * 0.7 + position.x * 2.5 + position.y * 1.8);
            vAlpha = pulse;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * pulse * (290.0 / -mvPos.z);
            gl_Position  = projectionMatrix * mvPos;
          }
        `,
        fragmentShader: /* glsl */`
          varying vec3  vColor;
          varying float vAlpha;

          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            float a = (1.0 - smoothstep(0.22, 0.5, d)) * vAlpha * 0.7;
            gl_FragColor = vec4(vColor, a);
          }
        `,
        transparent: true,
        depthWrite: false,
      })

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      // Mouse → world space via ray-plane intersection
      const mouse      = { wx: 99999, wy: 99999 }
      const raycaster  = new THREE.Raycaster()
      const ndcMouse   = new THREE.Vector2()
      const plane      = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const worldPt    = new THREE.Vector3()

      const onMouseMove = (e: MouseEvent) => {
        const rect = mount.getBoundingClientRect()
        ndcMouse.set(
          ((e.clientX - rect.left) / rect.width)  * 2 - 1,
          -((e.clientY - rect.top)  / rect.height) * 2 + 1,
        )
        raycaster.setFromCamera(ndcMouse, camera)
        raycaster.ray.intersectPlane(plane, worldPt)
        mouse.wx = worldPt.x
        mouse.wy = worldPt.y
      }

      const onResize = () => {
        const w2 = mount.clientWidth
        const h2 = mount.clientHeight
        camera.aspect = w2 / h2
        camera.updateProjectionMatrix()
        renderer.setSize(w2, h2)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('resize',    onResize)

      let t = 0
      const pos = geometry.attributes.position.array as Float32Array

      const animate = () => {
        animId = requestAnimationFrame(animate)
        t += 0.016
        material.uniforms.uTime.value = t

        for (let i = 0; i < N; i++) {
          const px = pos[i * 3]
          const py = pos[i * 3 + 1]
          const hx = homePos[i * 2]
          const hy = homePos[i * 2 + 1]
          const ph = i * 0.71

          // Organic drift
          velocities[i * 2]     += Math.sin(t * 0.38 + ph)       * DRIFT
          velocities[i * 2 + 1] += Math.cos(t * 0.27 + ph * 1.3) * DRIFT

          // Mouse repulsion
          const dx    = px - mouse.wx
          const dy    = py - mouse.wy
          const dist2 = dx * dx + dy * dy
          if (dist2 < REPEL_R * REPEL_R && dist2 > 1e-5) {
            const dist  = Math.sqrt(dist2)
            const force = ((REPEL_R - dist) / REPEL_R) * REPEL_F
            velocities[i * 2]     += (dx / dist) * force
            velocities[i * 2 + 1] += (dy / dist) * force
          }

          // Spring toward home
          velocities[i * 2]     += (hx - px) * SPRING
          velocities[i * 2 + 1] += (hy - py) * SPRING

          // Damping
          velocities[i * 2]     *= DAMP
          velocities[i * 2 + 1] *= DAMP

          pos[i * 3]     += velocities[i * 2]
          pos[i * 3 + 1] += velocities[i * 2 + 1]
        }

        geometry.attributes.position.needsUpdate = true
        renderer.render(scene, camera)
      }

      animate()

      cleanupFn = () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize',    onResize)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement)
        }
      }
    })()

    return () => {
      active = false
      cleanupFn?.()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
