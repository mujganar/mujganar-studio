'use client'

import { useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%<>/\\|{}[]αβγδεζ'
const FONT_SIZE = 13
const GREEN_BRIGHT = '#39ff14'
const GREEN_DIM    = '#0d3d00'

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const cols = () => Math.floor(canvas.width / FONT_SIZE)
    let drops: number[] = Array.from({ length: cols() }, () => Math.random() * -100)

    const onResize = () => {
      drops = Array.from({ length: cols() }, () => Math.random() * -100)
    }
    window.addEventListener('resize', onResize)

    let animId: number
    const draw = () => {
      animId = requestAnimationFrame(draw)
      // Fade trail — semi-transparent black overlay
      ctx.fillStyle = 'rgba(10, 12, 10, 0.075)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${FONT_SIZE}px monospace`
      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x    = i * FONT_SIZE
        const y    = drops[i] * FONT_SIZE

        // Head character: bright green
        ctx.fillStyle = GREEN_BRIGHT
        ctx.shadowColor = GREEN_BRIGHT
        ctx.shadowBlur  = 4
        ctx.fillText(char, x, y)
        ctx.shadowBlur = 0

        // Occasionally render a dimmer trail char just behind
        if (drops[i] > 1) {
          ctx.fillStyle = GREEN_DIM
          const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)]
          ctx.fillText(trailChar, x, y - FONT_SIZE)
        }

        // Reset column when it hits bottom (with randomness)
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.4 + Math.random() * 0.3
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        1,
        opacity:       0.18,
        pointerEvents: 'none',
      }}
    />
  )
}
