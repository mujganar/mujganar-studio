'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudio, type AmbientMode } from '@/app/context/AudioContext'

const MODES: Array<{ id: AmbientMode; label: string; tagline: string; freq: string }> = [
  {
    id:      'bio',
    label:   'MODE_01 · BIO',
    tagline: 'Organic pulse. Cellular breath.',
    freq:    '55Hz drone + filtered noise',
  },
  {
    id:      'signal',
    label:   'MODE_02 · SIGNAL',
    tagline: 'Digital precision. Clinical tone.',
    freq:    '220Hz sine · 1320Hz ping · 4.5s',
  },
  {
    id:      'drift',
    label:   'MODE_03 · DRIFT',
    tagline: 'Chaotic beauty. Unresolved tension.',
    freq:    '110Hz + 113Hz beating · random LFO',
  },
]

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

function WaveIcon({ on }: { on: boolean }) {
  const bars = [
    { x: 3,  baseH: 4,  animH: 10, delay: 0 },
    { x: 8,  baseH: 8,  animH: 14, delay: 0.15 },
    { x: 13, baseH: 5,  animH: 9,  delay: 0.3 },
  ]
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {bars.map(b => (
        <motion.rect
          key={b.x}
          x={b.x} width={3} rx={1} fill="currentColor"
          animate={on
            ? { height: [b.baseH, b.animH, b.baseH], y: [10 - b.baseH / 2, 10 - b.animH / 2, 10 - b.baseH / 2] }
            : { height: b.baseH, y: 10 - b.baseH / 2 }
          }
          transition={on
            ? { duration: 1.1 + b.delay, repeat: Infinity, delay: b.delay, ease: 'easeInOut' }
            : { duration: 0.25 }
          }
        />
      ))}
    </svg>
  )
}

export function AudioPanel() {
  const { playing, mode, initialized, toggle, setMode } = useAudio()
  const [expanded,  setExpanded]  = useState(false)
  const [showToast, setShowToast] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // One-time toast on first audio initialization
  useEffect(() => {
    if (!initialized) return
    setShowToast(true)
    const t = setTimeout(() => setShowToast(false), 4000)
    return () => clearTimeout(t)
  }, [initialized])

  // Collapse on outside click
  useEffect(() => {
    if (!expanded) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [expanded])

  return (
    <>
      {/* ─── Toast ─── */}
      <div
        style={{
          position: 'fixed', bottom: '5.5rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 200,
          pointerEvents: 'none', whiteSpace: 'nowrap',
        }}
      >
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{
                ...MONO,
                background: '#0a0c0a',
                border: '1px solid rgba(122,182,72,0.25)',
                padding: '0.75rem 1.25rem',
                textAlign: 'center',
              }}
            >
              <p style={{ color: 'rgba(122,182,72,0.85)', fontSize: '0.65rem', letterSpacing: '0.15em', marginBottom: '0.3rem' }}>
                // AUDIO ENGINE ACTIVE — procedural sound initialized
              </p>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.6rem', letterSpacing: '0.1em', opacity: 0.7 }}>
                Select a mode or mute in the sound panel →
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Panel ─── */}
      <div
        ref={panelRef}
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100 }}
      >
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{
                ...MONO,
                background: '#0a0c0a',
                border: '1px solid rgba(122,182,72,0.2)',
                padding: '1.1rem',
                marginBottom: '0.625rem',
                width: '272px',
              }}
            >
              {/* Header */}
              <div style={{ marginBottom: '0.875rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(122,182,72,0.1)' }}>
                <p style={{ color: 'rgba(122,182,72,0.75)', fontSize: '0.65rem', letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
                  // AUDIO ENGINE
                </p>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.6rem', lineHeight: 1.65, opacity: 0.7 }}>
                  Procedural sound — generated in real time.<br />No files, no tracking.
                </p>
              </div>

              {/* Mode selector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.875rem' }}>
                {MODES.map(m => {
                  const active = mode === m.id
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      style={{
                        textAlign:   'left',
                        padding:     '0.55rem 0.7rem',
                        background:  active ? 'rgba(122,182,72,0.06)' : 'transparent',
                        border:      `1px solid ${active ? 'rgba(122,182,72,0.45)' : 'rgba(122,182,72,0.1)'}`,
                        cursor:      'pointer',
                        transition:  'border-color 0.2s, background 0.2s',
                        fontFamily:  'var(--font-mono)',
                      }}
                      onMouseEnter={e => {
                        if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(122,182,72,0.25)'
                      }}
                      onMouseLeave={e => {
                        if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(122,182,72,0.1)'
                      }}
                    >
                      <p style={{
                        color:         active ? 'var(--color-green)' : 'var(--color-muted)',
                        fontSize:      '0.62rem',
                        letterSpacing: '0.12em',
                        marginBottom:  '0.2rem',
                        transition:    'color 0.2s',
                      }}>
                        {m.label}
                      </p>
                      <p style={{ color: active ? 'rgba(122,182,72,0.65)' : 'var(--color-border)', fontSize: '0.58rem', lineHeight: 1.5, transition: 'color 0.2s' }}>
                        {m.tagline}
                      </p>
                      <p style={{ color: 'var(--color-border)', fontSize: '0.55rem', marginTop: '0.2rem', opacity: active ? 0.8 : 0.5 }}>
                        {m.freq}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Master toggle */}
              <button
                onClick={toggle}
                style={{
                  width:         '100%',
                  padding:       '0.45rem',
                  background:    'transparent',
                  border:        `1px solid ${playing ? 'rgba(122,182,72,0.4)' : 'var(--color-border)'}`,
                  color:         playing ? 'var(--color-green)' : 'var(--color-muted)',
                  fontSize:      '0.62rem',
                  letterSpacing: '0.18em',
                  cursor:        'pointer',
                  display:       'flex',
                  alignItems:    'center',
                  justifyContent: 'center',
                  gap:           '0.5rem',
                  fontFamily:    'var(--font-mono)',
                  transition:    'border-color 0.2s, color 0.2s',
                }}
              >
                <motion.span
                  animate={{ opacity: playing ? [1, 0.4, 1] : 1 }}
                  transition={playing ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
                >
                  {playing ? '●' : '○'}
                </motion.span>
                <span>{playing ? 'PLAYING' : 'PAUSED'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pill */}
        <motion.button
          onClick={() => setExpanded(e => !e)}
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           '0.5rem',
            padding:       '0.375rem 0.875rem',
            background:    '#0a0c0a',
            border:        `1px solid ${playing ? 'rgba(122,182,72,0.4)' : 'rgba(30,35,30,0.9)'}`,
            cursor:        'pointer',
            fontFamily:    'var(--font-mono)',
            fontSize:      '0.62rem',
            letterSpacing: '0.15em',
            color:         playing ? 'var(--color-green)' : 'var(--color-muted)',
            transition:    'border-color 0.3s, color 0.3s',
          }}
          whileHover={{ borderColor: 'rgba(122,182,72,0.5)' }}
        >
          <motion.span
            style={{ color: playing ? 'var(--color-green)' : 'var(--color-border)', display: 'flex' }}
            animate={playing ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
            transition={playing ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
          >
            <WaveIcon on={playing} />
          </motion.span>
          <span>SOUND · {playing ? 'ON' : 'OFF'}</span>
        </motion.button>
      </div>
    </>
  )
}
