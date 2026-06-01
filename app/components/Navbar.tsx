'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLang } from '@/app/context/LanguageContext'
import { useAudio } from '@/app/context/AudioContext'
import { audio } from '@/lib/audio'
import { motion } from 'framer-motion'

const links = [
  { href: '/work',    en: 'Work',    tr: 'Projeler' },
  { href: '/about',   en: 'About',   tr: 'Hakkımda' },
  { href: '/contact', en: 'Contact', tr: 'İletişim' },
]

function NavSoundIcon({ on }: { on: boolean }) {
  const bars = [
    { x: 3,  baseH: 4,  animH: 10, delay: 0 },
    { x: 8,  baseH: 8,  animH: 14, delay: 0.15 },
    { x: 13, baseH: 5,  animH: 9,  delay: 0.3 },
  ]
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

export default function Navbar() {
  const { lang, toggle } = useLang()
  const { playing, toggle: audioToggle } = useAudio()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'color-mix(in srgb, var(--color-space) 90%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="tracking-widest text-xs uppercase"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', letterSpacing: '0.2em' }}
          onMouseEnter={() => audio.hover()}
        >
          mujganar<span style={{ color: 'var(--color-green)' }}>.</span>studio
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs uppercase tracking-widest transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: active ? 'var(--color-green)' : 'var(--color-muted)',
                  letterSpacing: '0.15em',
                }}
                onMouseEnter={e => {
                  audio.hover()
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-white)'
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-muted)'
                }}
                onClick={() => audio.navigate()}
              >
                {lang === 'en' ? l.en : l.tr}
              </Link>
            )
          })}

          {/* Sound toggle */}
          <button
            onClick={() => { audio.click(); audioToggle() }}
            aria-label="Toggle ambient sound"
            className="flex items-center justify-center transition-colors duration-200"
            style={{
              color:      playing ? 'var(--color-green)' : 'var(--color-border)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
            }}
            onMouseEnter={e => {
              audio.hover()
              ;(e.currentTarget as HTMLButtonElement).style.color = playing ? 'var(--color-green)' : 'var(--color-muted)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLButtonElement).style.color = playing ? 'var(--color-green)' : 'var(--color-border)'
            }}
          >
            <NavSoundIcon on={playing} />
          </button>

          {/* Language toggle */}
          <button
            onClick={() => { audio.click(); toggle() }}
            aria-label="Toggle language"
            className="text-xs tracking-widest uppercase transition-colors duration-200 px-2 py-1 rounded"
            style={{
              fontFamily: 'var(--font-mono)',
              color:  'var(--color-muted)',
              border: '1px solid var(--color-border)',
            }}
            onMouseEnter={e => {
              audio.hover()
              ;(e.currentTarget as HTMLButtonElement).style.color       = 'var(--color-green)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-green-dim)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLButtonElement).style.color       = 'var(--color-muted)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
            }}
          >
            {lang === 'en' ? 'TR' : 'EN'}
          </button>
        </div>

        {/* Mobile: sound + lang toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => { audio.click(); audioToggle() }}
            aria-label="Toggle ambient sound"
            style={{ color: playing ? 'var(--color-green)' : 'var(--color-border)', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 6px', margin: '-12px -6px' }}
          >
            <NavSoundIcon on={playing} />
          </button>

          <button
            onClick={() => { audio.click(); toggle() }}
            aria-label="Toggle language"
            className="text-xs tracking-widest uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              color:  'var(--color-muted)',
              border: '1px solid var(--color-border)',
              padding: '10px 10px',
              minHeight: '44px',
              minWidth: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {lang === 'en' ? 'TR' : 'EN'}
          </button>

          <button
            onClick={() => { audio.click(); setMenuOpen(o => !o) }}
            aria-label="Toggle menu"
            className="flex items-center justify-center"
            style={{ width: '44px', height: '44px', marginRight: '-10px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <div className="flex flex-col justify-center gap-1.5" style={{ width: '22px' }}>
              {[
                menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
                null,
                menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
              ].map((transform, i) => (
                <span
                  key={i}
                  className="block h-px w-full transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-muted)',
                    ...(transform !== null ? { transform } : { opacity: menuOpen ? 0 : 1 }),
                  }}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden flex flex-col px-6 pb-4 gap-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => { audio.navigate(); setMenuOpen(false) }}
              className="text-xs uppercase tracking-widest flex items-center"
              style={{
                fontFamily: 'var(--font-mono)',
                color: pathname === l.href ? 'var(--color-green)' : 'var(--color-muted)',
                letterSpacing: '0.15em',
                minHeight: '44px',
              }}
            >
              {lang === 'en' ? l.en : l.tr}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
