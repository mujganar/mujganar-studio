'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/app/context/LanguageContext'

const VENUES = [
  'Porsche Arena — Stuttgart',
  'Indigo at The O2 — London',
  'Mitsubishi Electric Halle — Düsseldorf',
  'Bodrum Antique Theatre',
  'Volkswagen Arena — Istanbul',
  'Zorlu PSM — Istanbul',
  'Harbiye Cemil Topuzlu — Istanbul',
  'Sónar',
]

const ARTISTS = [
  'Kenan Doğulu',
  'İpek İpekçioğlu',
  'Argy',
  'Brina Knauss',
  'Joyhauser',
  'Laolu',
  'Chris Avantgarde',
  'Massano',
  'Zara',
]

// Duplicate for seamless loop
const VENUES_LOOP  = [...VENUES,  ...VENUES]
const ARTISTS_LOOP = [...ARTISTS, ...ARTISTS]

function Strip({ items, dir = 1, speed = 40 }: { items: string[]; dir?: 1 | -1; speed?: number }) {
  const duration = items.length * speed / 2

  return (
    <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: dir === 1 ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ repeat: Infinity, duration, ease: 'linear' }}
        style={{ willChange: 'transform' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="text-xs uppercase tracking-widest shrink-0 flex items-center gap-8"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-border)', letterSpacing: '0.18em' }}
          >
            {item}
            <span style={{ color: 'color-mix(in srgb, var(--color-border) 50%, transparent)' }}>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function Venues() {
  const { t } = useLang()

  return (
    <section className="py-16 overflow-hidden">
      {/* Section label */}
      <div className="px-6 max-w-6xl mx-auto mb-8">
        <p
          className="text-xs uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-border)', letterSpacing: '0.2em' }}
        >
          {t('Venues & Performances', 'Mekanlar & Performanslar')}
        </p>
      </div>

      {/* Strips */}
      <div className="flex flex-col gap-4" style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '1.25rem 0' }}>
        <Strip items={VENUES_LOOP}  dir={1}  speed={38} />
        <Strip items={ARTISTS_LOOP} dir={-1} speed={32} />
      </div>
    </section>
  )
}
