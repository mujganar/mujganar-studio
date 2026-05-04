'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '@/app/context/LanguageContext'

const HeroParticles = dynamic(() => import('./HeroParticles'), { ssr: false })

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
})

export default function Hero() {
  const { t } = useLang()

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: 'calc(100vh - 3.5rem)' }}
    >
      {/* ── Particle canvas ── */}
      <HeroParticles />

      {/* ── Vignette overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 70% at 50% 50%,
              rgba(10,12,10,0.05) 0%,
              rgba(10,12,10,0.55) 100%
            )
          `,
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">

        {/* Label */}
        <motion.p
          {...fade(0.15)}
          className="text-xs uppercase tracking-widest mb-8"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-muted)',
            letterSpacing: '0.22em',
          }}
        >
          {t('Creative Technologist · Clinical Research Professional', 'Yaratıcı Teknolog · Klinik Araştırma Uzmanı')}
        </motion.p>

        {/* Name */}
        <motion.h1
          {...fade(0.35)}
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--color-white)',
            fontWeight: 300,
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
          }}
        >
          Müjgan Armağan
          <br />
          <span style={{ fontStyle: 'italic', fontWeight: 300 }}>Türközü</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.65, ease: 'easeOut' }}
          className="my-7"
          style={{
            width: '4rem',
            height: '1px',
            backgroundColor: 'var(--color-green-dim)',
            transformOrigin: 'left',
          }}
        />

        {/* Tagline */}
        <motion.p
          {...fade(0.75)}
          className="text-sm uppercase tracking-widest mb-10"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-muted)',
            letterSpacing: '0.18em',
          }}
        >
          {t('Clinical Precision', 'Klinik Hassasiyet')}
          <span style={{ color: 'var(--color-green-dim)', margin: '0 0.6em' }}>·</span>
          {t('Creative Fluidity', 'Yaratıcı Akışkanlık')}
        </motion.p>

        {/* CTA */}
        <motion.div {...fade(0.9)}>
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 text-xs uppercase tracking-widest px-6 py-3 transition-all duration-300"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
              letterSpacing: '0.18em',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--color-white)'
              el.style.borderColor = 'var(--color-green-dim)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.color = 'var(--color-muted)'
              el.style.borderColor = 'var(--color-border)'
            }}
          >
            {t('Explore Work', 'Projelere Bak')}
            <span
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </motion.div>
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-border)',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
          }}
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  )
}
