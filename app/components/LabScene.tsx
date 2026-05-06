'use client'

import { useEffect, useRef } from 'react'
import type * as ThreeNS from 'three'

const TEAL  = 0x4a9ab8
const COLD  = 0xe8f4f8

export function LabScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let animId: number
    let active = true

    ;(async () => {
      const THREE = await import('three')
      if (!active) return

      const w = window.innerWidth
      const h = window.innerHeight

      // ─── Renderer ──────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(w, h)
      renderer.setClearColor(0x0a0c0a, 1)
      mount.appendChild(renderer.domElement)

      // ─── Scene + camera ────────────────────────────────────────────────────
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
      camera.position.set(0, 1.5, 7)
      camera.lookAt(0, 0, 0)

      // ─── Lighting ──────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x0a2030, 1.2))

      const dirLight = new THREE.DirectionalLight(COLD, 1.8)
      dirLight.position.set(5, 10, 5)
      scene.add(dirLight)

      // ─── Object group (rotates for auto-spin) ──────────────────────────────
      const group = new THREE.Group()
      scene.add(group)

      // Grid floor
      const grid = new THREE.GridHelper(30, 30, 0x0a2030, 0x122535)
      grid.position.y = -2.5
      group.add(grid)

      // Wireframe icosahedra
      const icoMat = new THREE.MeshBasicMaterial({ color: TEAL, wireframe: true, transparent: true, opacity: 0.55 })
      const icoDefs = [
        { pos: [-2.5, 0.2, -1.5], r: 0.7 },
        { pos: [2.8,  -0.4, -2.2], r: 0.9 },
        { pos: [0.2,  1.2,  -3.5], r: 0.55 },
        { pos: [-1.0, -1.0, -2.0], r: 0.45 },
      ]
      const icosahedra: ThreeNS.Mesh[] = []
      icoDefs.forEach(({ pos, r }) => {
        const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), icoMat.clone())
        mesh.position.set(...pos as [number, number, number])
        group.add(mesh)
        icosahedra.push(mesh)

        // Point light for each
        const pt = new THREE.PointLight(TEAL, 1.5, 5)
        pt.position.copy(mesh.position)
        group.add(pt)
      })

      // Glass spheres
      const sphereDefs = [
        { pos: [1.5, 0.5, -1.2], r: 0.55 },
        { pos: [-1.8, -0.8, -2.5], r: 0.7 },
        { pos: [0.3, 1.8, -2.8], r: 0.4 },
      ]
      const sphereMat = new THREE.MeshPhongMaterial({
        color:       TEAL,
        transparent: true,
        opacity:     0.12,
        shininess:   160,
        specular:    new THREE.Color(0x88ddff),
        side:        THREE.DoubleSide,
      })
      sphereDefs.forEach(({ pos, r }) => {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), sphereMat.clone())
        mesh.position.set(...pos as [number, number, number])
        group.add(mesh)
      })

      // Floating particles
      const N = 250
      const particlePos = new Float32Array(N * 3)
      const particleVel = new Float32Array(N)
      for (let i = 0; i < N; i++) {
        particlePos[i * 3]     = (Math.random() - 0.5) * 14
        particlePos[i * 3 + 1] = (Math.random() - 0.5) * 8
        particlePos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
        particleVel[i]         = 0.003 + Math.random() * 0.005
      }
      const particleGeo = new THREE.BufferGeometry()
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
      const particles = new THREE.Points(
        particleGeo,
        new THREE.PointsMaterial({ color: TEAL, size: 0.025, transparent: true, opacity: 0.55 }),
      )
      scene.add(particles)

      // ─── Mouse parallax ────────────────────────────────────────────────────
      let mx = 0, my = 0
      const onMouseMove = (e: MouseEvent) => {
        mx = (e.clientX / window.innerWidth)  * 2 - 1
        my = (e.clientY / window.innerHeight) * 2 - 1
      }
      window.addEventListener('mousemove', onMouseMove)

      const onResize = () => {
        const w2 = window.innerWidth, h2 = window.innerHeight
        camera.aspect = w2 / h2
        camera.updateProjectionMatrix()
        renderer.setSize(w2, h2)
      }
      window.addEventListener('resize', onResize)

      // ─── Animate ───────────────────────────────────────────────────────────
      let t = 0
      const camBase = { x: 0, y: 1.5, z: 7 }
      const camTarget = { x: 0, y: 1.5 }
      const PARALLAX = 0.35

      const animate = () => {
        animId = requestAnimationFrame(animate)
        t += 0.008

        // Slow auto-rotation of scene group
        group.rotation.y = t * 0.04

        // Individual icosahedra rotation
        icosahedra.forEach((ico, i) => {
          ico.rotation.x = t * 0.12 + i * 0.8
          ico.rotation.y = t * 0.09 + i * 1.2
        })

        // Particle drift upward
        const pos = particleGeo.attributes.position.array as Float32Array
        for (let i = 0; i < N; i++) {
          pos[i * 3 + 1] += particleVel[i]
          if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -4
        }
        particleGeo.attributes.position.needsUpdate = true

        // Camera parallax (smooth lerp)
        camTarget.x += (mx * PARALLAX - camTarget.x) * 0.04
        camTarget.y += (-my * PARALLAX - (camTarget.y - camBase.y)) * 0.04
        camera.position.x = camBase.x + camTarget.x
        camera.position.y = camBase.y + camTarget.y
        camera.lookAt(0, 0, 0)

        renderer.render(scene, camera)
      }
      animate()

      return () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize',    onResize)
        particleGeo.dispose()
        renderer.dispose()
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      }
    })().then(cleanup => {
      if (!active && cleanup) cleanup()
    })

    return () => {
      active = false
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    />
  )
}
