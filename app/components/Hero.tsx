'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useLang } from '@/app/context/LanguageContext'
import { audio } from '@/lib/audio'

const HeroParticles = dynamic(() => import('./HeroParticles'), { ssr: false })

const E = 'easeOut' as const

const LEFT_TAGS  = ['VJ', 'TouchDesigner', 'UE5', 'p5.js', 'Sónar', 'Kenan Doğulu']
const RIGHT_TAGS = ['Oncology', 'Parexel', 'ICH-GCP', 'IQVIA', '8+ yrs', 'TSCA VP']

type Side = 'left' | 'right' | null

// ─────────────────────────────────────────────────────────────────────────────
// Style helpers — all conditional on which side is active
// ─────────────────────────────────────────────────────────────────────────────

const T = 'color 0.3s, background 0.3s, border-color 0.3s, opacity 0.3s'

function labelStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily:   'var(--font-serif)',
    fontSize:     'clamp(20px, 5vw, 32px)',
    fontWeight:   400,
    color:        active ? '#0a0c0a' : '#c8ddb8',
    opacity:      0.95,
    lineHeight:   1.2,
    marginBottom: '1.1rem',
    transition:   T,
  }
}

function tagStyle(side: 'left' | 'right', active: boolean): React.CSSProperties {
  const isLeft = side === 'left'
  return {
    fontFamily:       'var(--font-mono)',
    fontSize:         '12px',
    padding:          '4px 12px',
    letterSpacing:    '0.06em',
    transition:       T,
    color:            active ? '#0a0c0a'                                    : (isLeft ? '#7ab648' : '#4a9ab8'),
    background:       active ? 'rgba(10,12,10,0.6)'                        : 'transparent',
    border:           `1px solid ${active ? (isLeft ? '#4a7c3f' : '#1a5a6a') : (isLeft ? 'rgba(122,182,72,0.7)' : 'rgba(74,154,184,0.7)')}`,
  }
}

function capStyle(side: 'left' | 'right', active: boolean): React.CSSProperties {
  return {
    fontFamily:    'var(--font-mono)',
    fontSize:      '13px',
    color:         active ? (side === 'left' ? '#1a2a10' : '#0a2030') : '#a8c898',
    opacity:       active ? 1 : 0.75,
    letterSpacing: '0.1em',
    lineHeight:    1.75,
    marginBottom:  '0.75rem',
    transition:    T,
  }
}

function ctaStyle(side: 'left' | 'right', active: boolean, hovered: Side): React.CSSProperties {
  const isLeft = side === 'left'
  return {
    fontFamily:    'var(--font-mono)',
    fontSize:      '13px',
    letterSpacing: '0.1em',
    color:         active ? (isLeft ? '#2a5a18' : '#0a3a50') : (isLeft ? '#7ab648' : '#4a9ab8'),
    opacity:       hovered === side ? 1 : 0.5,
    transition:    T,
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function Hero() {
  const { t }      = useLang()
  const router     = useRouter()
  const [hovered, setHovered] = useState<Side>(null)
  const [dotY,    setDotY]    = useState(50)
  const [glowL,   setGlowL]   = useState({ x: 50, y: 50 })
  const [glowR,   setGlowR]   = useState({ x: 50, y: 50 })

  useEffect(() => {
    const nav = 56
    const onMove = (e: MouseEvent) => {
      const rel = Math.max(0, e.clientY - nav)
      setDotY(Math.min(99, (rel / (window.innerHeight - nav)) * 100))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const trackGlow = (side: 'left' | 'right') => (e: React.MouseEvent<HTMLDivElement>) => {
    const r  = e.currentTarget.getBoundingClientRect()
    const pt = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }
    side === 'left' ? setGlowL(pt) : setGlowR(pt)
  }

  const leftActive  = hovered === 'left'
  const rightActive = hovered === 'right'

  const panelBase: React.CSSProperties = {
    flex:          1,
    minHeight:     '50vh',
    position:      'relative',
    display:       'flex',
    flexDirection: 'column',
    cursor:        'pointer',
    overflow:      'hidden',
    paddingTop:    'clamp(2.5rem, 18vh, 7rem)',
    paddingBottom: 'clamp(2.5rem, 18vh, 7rem)',
  }

  return (
    <section
      className="relative flex flex-col md:flex-row overflow-hidden"
      style={{ minHeight: 'calc(100vh - 3.5rem)' }}
    >
      <HeroParticles />

      {/* ───────────────────────── LEFT PANEL ───────────────────────── */}
      <div
        style={{ ...panelBase, paddingLeft: 'clamp(1.5rem, 5vw, 4rem)', paddingRight: 'clamp(1.5rem, 5vw, 3rem)' }}
        onClick={() => { audio.navigate(); router.push('/creative') }}
        onMouseEnter={() => { setHovered('left'); audio.hover(440) }}
        onMouseLeave={() => setHovered(null)}
        onMouseMove={trackGlow('left')}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowL.x}% ${glowL.y}%, rgba(122,182,72,0.10) 0%, transparent 55%)`,
            opacity:    leftActive ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: E }}>
          <h2 style={labelStyle(leftActive)}>
            {t('Creative Technologist', 'Yaratıcı Teknolog')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {LEFT_TAGS.map(tag => (
              <span key={tag} style={tagStyle('left', leftActive)}>{tag}</span>
            ))}
          </div>
        </motion.div>

        <div style={{ flex: 1 }} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5, ease: E }}>
          <p style={capStyle('left', leftActive)}>
            {t('Stage Design · Experience Design · Visual Production', 'Sahne Tasarımı · Deneyim Tasarımı · Görsel Prodüksiyon')}
          </p>
          <p style={ctaStyle('left', leftActive, hovered)}>
            {t('explore creative work →', 'yaratıcı projelere bak →')}
          </p>
        </motion.div>
      </div>

      {/* ───────────────────────── RIGHT PANEL ──────────────────────── */}
      <div
        style={{ ...panelBase, paddingLeft: 'clamp(1.5rem, 5vw, 3rem)', paddingRight: 'clamp(1.5rem, 5vw, 4rem)' }}
        onClick={() => { audio.navigate(); router.push('/clinical') }}
        onMouseEnter={() => { setHovered('right'); audio.hover(550) }}
        onMouseLeave={() => setHovered(null)}
        onMouseMove={trackGlow('right')}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowR.x}% ${glowR.y}%, rgba(74,154,184,0.10) 0%, transparent 55%)`,
            opacity:    rightActive ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />

        <motion.div
          className="md:text-right"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: E }}
        >
          <h2 style={labelStyle(rightActive)}>
            {t('Clinical Research Professional', 'Klinik Araştırma Uzmanı')}
          </h2>
          <div className="flex flex-wrap gap-2 md:justify-end">
            {RIGHT_TAGS.map(tag => (
              <span key={tag} style={tagStyle('right', rightActive)}>{tag}</span>
            ))}
          </div>
        </motion.div>

        <div style={{ flex: 1 }} />

        <motion.div
          className="md:text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55, ease: E }}
        >
          <p style={capStyle('right', rightActive)}>
            {t('Senior CRA · Project Management · Digital Health', 'Kıdemli KAU · Proje Yönetimi · Dijital Sağlık')}
          </p>
          <p style={ctaStyle('right', rightActive, hovered)}>
            {t('explore clinical work →', 'klinik projelere bak →')}
          </p>
        </motion.div>
      </div>

      {/* ─────────────────────── CROSS OVERLAY ─────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }} aria-hidden="true">

        <div
          className="hidden md:block absolute top-0 bottom-0"
          style={{ left: '50%', width: '1px', backgroundColor: 'var(--color-border)' }}
        />

        <div
          className="absolute left-0 right-0"
          style={{ top: '50%', height: '1px', backgroundColor: 'var(--color-border)' }}
        />

        <div
          className="hidden md:block absolute"
          style={{
            top:          `${dotY}%`,
            left:         '50%',
            transform:    'translate(-50%, -50%)',
            width:        '5px',
            height:       '5px',
            borderRadius: '50%',
            background:   leftActive ? 'var(--color-green)' : rightActive ? 'var(--color-teal)' : 'var(--color-border)',
            boxShadow:    leftActive
              ? '0 0 10px var(--color-green), 0 0 4px var(--color-green)'
              : rightActive
              ? '0 0 10px var(--color-teal), 0 0 4px var(--color-teal)'
              : 'none',
            transition: 'top 0.07s linear, background 0.35s, box-shadow 0.35s',
          }}
        />

        {/* Name box */}
        <div
          className="absolute pointer-events-auto"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            onMouseEnter={() => audio.hover(880)}
            animate={{
              borderColor: ['rgba(122,182,72,0.25)', 'rgba(122,182,72,0.55)', 'rgba(122,182,72,0.25)'],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:     '#0a0c0a',
              border:         '1px solid',
              backdropFilter: 'blur(8px)',
              padding:        'clamp(16px, 4vw, 28px) clamp(16px, 5vw, 48px)',
              textAlign:      'center',
              minWidth:       'min(520px, 88vw)',
              maxWidth:       '92vw',
            }}
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize:   'clamp(26px, 7vw, 48px)',
                fontWeight: 400,
                color:      'var(--color-white)',
                lineHeight: 1.15,
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
                fontSize:      '13px',
                color:         'var(--color-muted)',
                opacity:       0.85,
                letterSpacing: '0.18em',
                marginTop:     '0.5rem',
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
