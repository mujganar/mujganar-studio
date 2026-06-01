'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/app/context/LanguageContext'
import { audio } from '@/lib/audio'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const vp = { once: true, margin: '-60px' }

const FIELD_STYLE = {
  fontFamily: 'var(--font-mono)',
  fontSize: '1rem',
  background: 'transparent',
  color: 'var(--color-white)',
  border: '1px solid var(--color-border)',
  outline: 'none',
  width: '100%',
  padding: '0.75rem 0.875rem',
  resize: 'none' as const,
  minHeight: '44px',
}

const FOCUS_BORDER = 'var(--color-green-dim)'
const BLUR_BORDER  = 'var(--color-border)'

function Field({ as = 'input', ...props }: { as?: 'input' | 'textarea' } & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false)
  const style = { ...FIELD_STYLE, borderColor: focused ? FOCUS_BORDER : BLUR_BORDER, transition: 'border-color 0.2s' }
  const handleFocus = () => { setFocused(true); audio.hover() }
  return as === 'textarea'
    ? <textarea {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>} style={style} onFocus={handleFocus} onBlur={() => setFocused(false)} />
    : <input    {...props as React.InputHTMLAttributes<HTMLInputElement>}       style={style} onFocus={handleFocus} onBlur={() => setFocused(false)} />
}

export default function ContactStrip() {
  const { t } = useLang()
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setStatus('sent'); audio.success() }
      else         { setStatus('error'); audio.error() }
    } catch {
      setStatus('error')
      audio.error()
    }
  }

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 md:gap-24">

          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.7, ease: 'easeOut' as const }}
            className="md:w-64 shrink-0"
          >
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', letterSpacing: '0.2em' }}
            >
              {t('Get In Touch', 'İletişim')}
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 300,
                color: 'var(--color-white)',
                lineHeight: 1.15,
              }}
            >
              {t("Let's work\ntogether.", 'Birlikte\nçalışalım.')}
            </h2>

            {/* Direct email CTA */}
            <a
              href="mailto:contact@mujganar.studio"
              onClick={() => { audio.click(); audio.navigate() }}
              onMouseEnter={e => { audio.hover(660); (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-green)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-white)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-green-dim)'; (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-green)' }}
              className="flex items-center gap-3 mt-6 transition-all duration-200"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--color-green)',
                border: '1px solid var(--color-green-dim)',
                padding: '0.75rem 1rem',
                letterSpacing: '0.06em',
                textDecoration: 'none',
                display: 'inline-flex',
              }}
            >
              <span style={{ fontSize: '1rem' }}>✉</span>
              contact@mujganar.studio
            </a>

            {/* Social links */}
            <div className="flex flex-col gap-0 mt-6">
              {[
                { label: 'LinkedIn',  href: 'https://linkedin.com',  freq: 440 },
                { label: 'Instagram', href: 'https://instagram.com', freq: 550 },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest transition-colors duration-200 flex items-center"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', letterSpacing: '0.15em', minHeight: '44px' }}
                  onMouseEnter={e => { audio.hover(link.freq); e.currentTarget.style.color = 'var(--color-green)' }}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
                  onClick={() => audio.click()}
                >
                  {link.label} →
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={vp}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' as const }}
            className="flex-1"
          >
            {status === 'sent' ? (
              <div className="flex flex-col gap-3 py-8">
                <span style={{ color: 'var(--color-green)', fontFamily: 'var(--font-mono)', fontSize: '1.5rem' }}>✓</span>
                <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                  {t("Message received. I'll be in touch.", 'Mesaj alındı. Yakında yazacağım.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Field
                    as="input"
                    type="text"
                    placeholder={t('Name', 'İsim')}
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  <Field
                    as="input"
                    type="email"
                    placeholder={t('Email', 'E-posta')}
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <Field
                  as="textarea"
                  rows={5}
                  placeholder={t('Message', 'Mesaj')}
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />

                <div className="flex items-center justify-between gap-4">
                  {status === 'error' && (
                    <p style={{ fontFamily: 'var(--font-mono)', color: '#c0392b', fontSize: '0.75rem' }}>
                      {t('Something went wrong. Try again.', 'Bir hata oluştu. Tekrar deneyin.')}
                    </p>
                  )}
                  <div className="ml-auto">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="text-xs uppercase tracking-widest px-6 transition-all duration-300"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: status === 'sending' ? 'var(--color-border)' : 'var(--color-muted)',
                        border: '1px solid var(--color-border)',
                        letterSpacing: '0.18em',
                        cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                        minHeight: '44px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onMouseEnter={e => {
                        if (status !== 'sending') {
                          (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-white)'
                          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-green-dim)'
                        }
                      }}
                      onMouseLeave={e => {
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)'
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'
                      }}
                    >
                      {status === 'sending'
                        ? t('Sending…', 'Gönderiliyor…')
                        : t('Send Message →', 'Gönder →')}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
