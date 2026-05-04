'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useLang } from '@/app/context/LanguageContext'

const links = [
  { href: '/work',    en: 'Work',    tr: 'Projeler' },
  { href: '/about',   en: 'About',   tr: 'Hakkımda' },
  { href: '/contact', en: 'Contact', tr: 'İletişim' },
]

export default function Navbar() {
  const { lang, toggle } = useLang()
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
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-white)'
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-muted)'
                }}
              >
                {lang === 'en' ? l.en : l.tr}
              </Link>
            )
          })}

          {/* Language toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="text-xs tracking-widest uppercase transition-colors duration-200 px-2 py-1 rounded"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-muted)',
              border: '1px solid var(--color-border)',
            }}
            onMouseEnter={e => {
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

        {/* Mobile: lang toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggle}
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
            onClick={() => setMenuOpen(o => !o)}
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
              onClick={() => setMenuOpen(false)}
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
