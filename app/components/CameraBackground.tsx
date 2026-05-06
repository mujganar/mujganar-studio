'use client'

import { useEffect, useRef } from 'react'

interface Props { stream: MediaStream }

const VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */`
  uniform sampler2D uVideo;
  uniform float     uTime;
  uniform vec2      uResolution;
  uniform float     uVideoAspect;
  varying vec2      vUv;

  void main() {
    // Mirror horizontally (selfie cam) + cover-fit aspect ratio
    float screenAspect = uResolution.x / uResolution.y;
    vec2 uv = vUv;
    if (screenAspect > uVideoAspect) {
      float scale = screenAspect / uVideoAspect;
      uv.y = (uv.y - 0.5) * scale + 0.5;
    } else {
      float scale = uVideoAspect / screenAspect;
      uv.x = (uv.x - 0.5) * scale + 0.5;
    }
    uv.x = 1.0 - uv.x;

    // 3x3 box blur (approximates 8px Gaussian)
    vec2 ts = vec2(8.0) / uResolution;
    vec3 blurred = vec3(0.0);
    for (int xi = -1; xi <= 1; xi++) {
      for (int yi = -1; yi <= 1; yi++) {
        blurred += texture2D(uVideo, clamp(uv + vec2(float(xi), float(yi)) * ts, 0.0, 1.0)).rgb;
      }
    }
    blurred /= 9.0;

    // Chromatic aberration on R and B channels
    float ca = 0.006;
    float r = texture2D(uVideo, clamp(vec2(uv.x - ca, uv.y), 0.0, 1.0)).r;
    float b = texture2D(uVideo, clamp(vec2(uv.x + ca, uv.y), 0.0, 1.0)).b;
    vec3 color = mix(blurred, vec3(r, blurred.g, b), 0.7);

    // Green tint rgba(0, 20, 0, 0.4) ≈ mix toward vec3(0, 0.078, 0) at 0.4
    color = mix(color, vec3(0.0, 0.08, 0.0), 0.4);

    // CRT scanlines — darken every other row
    float scan = step(1.0, mod(gl_FragCoord.y, 2.0));
    color *= mix(0.85, 1.0, scan);

    // Scanline opacity modulated by time (breathing)
    float breath = 1.0 + 0.04 * sin(uTime * 0.7);
    color.g *= breath;

    // Vignette
    vec2 v = (vUv - 0.5) * 2.0;
    float vignette = 1.0 - dot(v * 0.55, v * 0.55);
    color *= clamp(pow(max(vignette, 0.0), 0.65), 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`

export function CameraBackground({ stream }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    const video = videoRef.current
    if (!mount || !video) return

    video.srcObject = stream
    video.play().catch(() => {})

    let animId: number
    let active = true

    ;(async () => {
      const THREE = await import('three')
      if (!active) return

      const w = window.innerWidth
      const h = window.innerHeight

      const scene    = new THREE.Scene()
      const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(w, h)
      mount.appendChild(renderer.domElement)

      const videoTex = new THREE.VideoTexture(video)
      videoTex.minFilter = THREE.LinearFilter
      videoTex.magFilter = THREE.LinearFilter

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uVideo:       { value: videoTex },
          uTime:        { value: 0 },
          uResolution:  { value: new THREE.Vector2(w, h) },
          uVideoAspect: { value: 1 },
        },
        vertexShader:   VERT,
        fragmentShader: FRAG,
      })

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
      scene.add(mesh)

      const onResize = () => {
        const w2 = window.innerWidth, h2 = window.innerHeight
        renderer.setSize(w2, h2)
        material.uniforms.uResolution.value.set(w2, h2)
      }
      window.addEventListener('resize', onResize)

      let t = 0
      const animate = () => {
        animId = requestAnimationFrame(animate)
        t += 0.016
        material.uniforms.uTime.value = t
        // Update video aspect ratio once stream is ready
        if (video.videoWidth > 0) {
          material.uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight
        }
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('resize', onResize)
        material.dispose()
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
  }, [stream])

  return (
    <>
      <video
        ref={videoRef}
        muted playsInline
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <div
        ref={mountRef}
        aria-hidden="true"
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      />
    </>
  )
}
