'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useLang } from '@/app/context/LanguageContext'
import { audio } from '@/lib/audio'

const links = [
  { href: '/work',    en: 'Work',    tr: 'Projeler' },
  { href: '/about',   en: 'About',   tr: 'Hakkımda' },
  { href: '/contact', en: 'Contact', tr: 'İletişim' },
]

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <style>{`
        @keyframes bar1 { 0%,100%{height:4px;y:8px} 50%{height:10px;y:5px} }
        @keyframes bar2 { 0%,100%{height:8px;y:6px} 50%{height:14px;y:3px} }
        @keyframes bar3 { 0%,100%{height:5px;y:7px} 50%{height:9px;y:5px} }
        .b1{animation:${on ? 'bar1 1.1s ease-in-out infinite' : 'none'}}
        .b2{animation:${on ? 'bar2 0.9s ease-in-out infinite 0.15s' : 'none'}}
        .b3{animation:${on ? 'bar3 1.3s ease-in-out infinite 0.3s' : 'none'}}
      `}</style>
      <rect className="b1" x="3" y="8" width="3" height="4" rx="1" fill="currentColor" />
      <rect className="b2" x="8" y="6" width="3" height="8" rx="1" fill="currentColor" />
      <rect className="b3" x="13" y="7" width="3" height="5" rx="1" fill="currentColor" />
    </svg>
  )
}

export default function Navbar() {
  const { lang, toggle } = useLang()
  const pathname = usePathname()
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [ambientOn,  setAmbientOn]  = useState(false)
  const [initialized, setInitialized] = useState(false)

  // First-click anywhere starts ambient
  useEffect(() => {
    const onFirstClick = () => {
      if (!initialized) {
        audio.init()
        audio.startAmbient()
        setAmbientOn(true)
        setInitialized(true)
      }
    }
    window.addEventListener('click', onFirstClick, { once: true })
    window.addEventListener('touchend', onFirstClick, { once: true })
    return () => {
      window.removeEventListener('click', onFirstClick)
      window.removeEventListener('touchend', onFirstClick)
    }
  }, [initialized])

  const handleAmbientToggle = (e: React.MouseEvent) => {
    e.stopPropagation() // don't fire the first-click handler
    if (!initialized) {
      audio.init()
      setInitialized(true)
    }
    audio.toggleAmbient()
    setAmbientOn(audio.isAmbientOn)
    audio.click()
  }

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
            onClick={handleAmbientToggle}
            aria-label="Toggle ambient sound"
            className="flex items-center justify-center transition-colors duration-200"
            style={{
              color: ambientOn ? 'var(--color-green)' : 'var(--color-border)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = ambientOn ? 'var(--color-green)' : 'var(--color-muted)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = ambientOn ? 'var(--color-green)' : 'var(--color-border)'
            }}
          >
            <SoundIcon on={ambientOn} />
          </button>

          {/* Language toggle */}
          <button
            onClick={() => { audio.click(); toggle() }}
            aria-label="Toggle language"
            className="text-xs tracking-widest uppercase transition-colors duration-200 px-2 py-1 rounded"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
            }}
            onMouseEnter={e => {
              audio.hover()
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-green)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-green-dim)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
            }}
          >
            {lang === 'en' ? 'TR' : 'EN'}
          </button>
        </div>

        {/* Mobile: sound + lang toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={handleAmbientToggle}
            aria-label="Toggle ambient sound"
            style={{ color: ambientOn ? 'var(--color-green)' : 'var(--color-border)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
          >
            <SoundIcon on={ambientOn} />
          </button>

          <button
            onClick={() => { audio.click(); toggle() }}
            aria-label="Toggle language"
            className="text-xs tracking-widest uppercase px-2 py-1 rounded"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            {lang === 'en' ? 'TR' : 'EN'}
          </button>

          <button
            onClick={() => { audio.click(); setMenuOpen(o => !o) }}
            aria-label="Toggle menu"
            className="flex flex-col justify-center gap-1.5 w-6 h-6"
          >
            <span
              className="block h-px w-full transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-muted)',
                transform: menuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
              }}
            />
            <span
              className="block h-px w-full transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-muted)',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-px w-full transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-muted)',
                transform: menuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
              }}
            />
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
              className="text-xs uppercase tracking-widest py-2"
              style={{
                fontFamily: 'var(--font-mono)',
                color: pathname === l.href ? 'var(--color-green)' : 'var(--color-muted)',
                letterSpacing: '0.15em',
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
