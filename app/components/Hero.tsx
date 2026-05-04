'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/app/context/LanguageContext'

const HeroParticles = dynamic(() => import('./HeroParticles'), { ssr: false })

const E = 'easeOut' as const

const LEFT_TAGS  = ['VJ', 'TouchDesigner', 'UE5', 'p5.js', 'Sónar', 'Kenan Doğulu']
const RIGHT_TAGS = ['Oncology', 'Parexel', 'ICH-GCP', 'IQVIA', '8+ yrs', 'TSCA VP']

type Side = 'left' | 'right' | null

export default function Hero() {
  const { t }        = useLang()
  const router       = useRouter()
  const [hovered, setHovered] = useState<Side>(null)
  const [dotY,    setDotY]    = useState(50)
  const [glowL,   setGlowL]   = useState({ x: 50, y: 50 })
  const [glowR,   setGlowR]   = useState({ x: 50, y: 50 })

  // Track cursor Y for divider dot
  useEffect(() => {
    const nav = 56 // 3.5rem navbar
    const onMove = (e: MouseEvent) => {
      const rel = Math.max(0, e.clientY - nav)
      const tot = window.innerHeight - nav
      setDotY(Math.min(99, (rel / tot) * 100))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const trackGlow = (side: 'left' | 'right') =>
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect()
      const pt = {
        x: ((e.clientX - r.left)  / r.width)  * 100,
        y: ((e.clientY - r.top)   / r.height) * 100,
      }
      side === 'left' ? setGlowL(pt) : setGlowR(pt)
    }

  const panelBase: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    overflow: 'hidden',
    // content at top ~18vh and bottom ~18vh, center stays empty for name box
    paddingTop:    'clamp(2.5rem, 18vh, 7rem)',
    paddingBottom: 'clamp(2.5rem, 18vh, 7rem)',
  }

  const tagStyle = (side: 'left' | 'right'): React.CSSProperties => ({
    fontFamily:    'var(--font-mono)',
    fontSize:      '0.68rem',
    padding:       '3px 9px',
    letterSpacing: '0.06em',
    transition:    'all 0.3s',
    color: hovered === side
      ? (side === 'left' ? 'var(--color-green)' : 'var(--color-teal)')
      : 'var(--color-border)',
    border: `1px solid ${hovered === side
      ? (side === 'left' ? 'var(--color-green-dim)' : 'var(--color-teal)')
      : 'color-mix(in srgb, var(--color-border) 55%, transparent)'}`,
  })

  return (
    <section
      className="relative flex flex-col md:flex-row overflow-hidden"
      style={{ minHeight: 'calc(100vh - 3.5rem)' }}
    >
      {/* ── Particles ── */}
      <HeroParticles />

      {/* ─────────────────────────── LEFT PANEL ─────────────────────────── */}
      <div
        style={{ ...panelBase, paddingLeft: 'clamp(1.5rem, 5vw, 4rem)', paddingRight: 'clamp(1.5rem, 5vw, 3rem)' }}
        onClick={() => router.push('/work?tab=creative')}
        onMouseEnter={() => setHovered('left')}
        onMouseLeave={() => setHovered(null)}
        onMouseMove={trackGlow('left')}
      >
        {/* Ambient green glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowL.x}% ${glowL.y}%, rgba(122,182,72,0.06) 0%, transparent 55%)`,
            opacity: hovered === 'left' ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />

        {/* Top: title + tags */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: E }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize:   'clamp(1.5rem, 2.8vw, 2.5rem)',
              fontWeight: 300,
              color:      'var(--color-white)',
              lineHeight: 1.2,
              marginBottom: '1.1rem',
            }}
          >
            {t('Creative Technologist', 'Yaratıcı Teknolog')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {LEFT_TAGS.map(tag => (
              <span key={tag} style={tagStyle('left')}>{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom: capabilities + hover CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: E }}
        >
          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '0.72rem',
            color:         'var(--color-muted)',
            letterSpacing: '0.1em',
            lineHeight:    1.75,
            marginBottom:  '0.6rem',
          }}>
            {t(
              'Stage Design · Experience Design · Visual Production',
              'Sahne Tasarımı · Deneyim Tasarımı · Görsel Prodüksiyon',
            )}
          </p>

          <AnimatePresence>
            {hovered === 'left' && (
              <motion.p
                key="cta-l"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '0.72rem',
                  color:         'var(--color-green)',
                  letterSpacing: '0.12em',
                }}
              >
                {t('explore creative work →', 'yaratıcı projelere bak →')}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ─────────────────────────── RIGHT PANEL ────────────────────────── */}
      <div
        style={{
          ...panelBase,
          paddingLeft:  'clamp(1.5rem, 5vw, 3rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
        }}
        onClick={() => router.push('/work?tab=clinical')}
        onMouseEnter={() => setHovered('right')}
        onMouseLeave={() => setHovered(null)}
        onMouseMove={trackGlow('right')}
      >
        {/* Ambient teal glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowR.x}% ${glowR.y}%, rgba(74,154,184,0.06) 0%, transparent 55%)`,
            opacity: hovered === 'right' ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />

        {/* Top: title + tags (right-aligned on desktop) */}
        <motion.div
          className="md:text-right"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: E }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize:   'clamp(1.5rem, 2.8vw, 2.5rem)',
              fontWeight: 300,
              color:      'var(--color-white)',
              lineHeight: 1.2,
              marginBottom: '1.1rem',
            }}
          >
            {t('Clinical Research Professional', 'Klinik Araştırma Uzmanı')}
          </h2>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {RIGHT_TAGS.map(tag => (
              <span key={tag} style={tagStyle('right')}>{tag}</span>
            ))}
          </div>
        </motion.div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom: capabilities + hover CTA (right-aligned) */}
        <motion.div
          className="md:text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55, ease: E }}
        >
          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '0.72rem',
            color:         'var(--color-muted)',
            letterSpacing: '0.1em',
            lineHeight:    1.75,
            marginBottom:  '0.6rem',
          }}>
            {t(
              'Senior CRA · Project Management · Digital Health',
              'Kıdemli KAU · Proje Yönetimi · Dijital Sağlık',
            )}
          </p>

          <AnimatePresence>
            {hovered === 'right' && (
              <motion.p
                key="cta-r"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.18 }}
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '0.72rem',
                  color:         'var(--color-teal)',
                  letterSpacing: '0.12em',
                }}
              >
                {t('explore clinical work →', 'klinik projelere bak →')}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ─────────────────── CROSS OVERLAY ─────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 20 }}
        aria-hidden="true"
      >
        {/* Vertical center line (desktop only) */}
        <div
          className="hidden md:block absolute top-0 bottom-0"
          style={{ left: '50%', width: '1px', backgroundColor: 'var(--color-border)' }}
        />

        {/* Horizontal center line */}
        <div
          className="absolute left-0 right-0"
          style={{ top: '50%', height: '1px', backgroundColor: 'var(--color-border)' }}
        />

        {/* Divider dot — follows cursor Y along vertical line */}
        <div
          className="hidden md:block absolute"
          style={{
            top:       `${dotY}%`,
            left:      '50%',
            transform: 'translate(-50%, -50%)',
            width:     '5px',
            height:    '5px',
            borderRadius: '50%',
            background: hovered === 'left'
              ? 'var(--color-green)'
              : hovered === 'right'
              ? 'var(--color-teal)'
              : 'var(--color-border)',
            boxShadow: hovered === 'left'
              ? '0 0 10px var(--color-green), 0 0 4px var(--color-green)'
              : hovered === 'right'
              ? '0 0 10px var(--color-teal), 0 0 4px var(--color-teal)'
              : 'none',
            transition: 'top 0.07s linear, background 0.35s, box-shadow 0.35s',
          }}
        />

        {/* Name box at exact intersection */}
        <div
          className="absolute pointer-events-auto"
          style={{
            left:      '50%',
            top:       '50%',
            transform: 'translate(-50%, -50%)',
            zIndex:    30,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            animate={{
              borderColor: [
                'rgba(122,182,72,0.15)',
                'rgba(122,182,72,0.40)',
                'rgba(122,182,72,0.15)',
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:     '#0a0c0a',
              border:         '1px solid',
              backdropFilter: 'blur(8px)',
              padding:        'clamp(0.7rem, 1.5vw, 1rem) clamp(1rem, 3vw, 2rem)',
              textAlign:      'center',
            }}
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize:   'clamp(1rem, 2.2vw, 1.65rem)',
                fontWeight: 300,
                color:      'var(--color-white)',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
              }}
            >
              Müjgan Armağan Türközü
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.65 }}
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '0.6rem',
                color:         'var(--color-muted)',
                letterSpacing: '0.18em',
                marginTop:     '0.35rem',
              }}
            >
              Istanbul · mujganar.studio
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
