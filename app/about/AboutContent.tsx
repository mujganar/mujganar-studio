'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useLang } from '@/app/context/LanguageContext'
import { useAudio } from '@/app/context/AudioContext'
import { audio } from '@/lib/audio'

const HeroParticles = dynamic(() => import('@/app/components/HeroParticles'), { ssr: false })

// ─── Data ────────────────────────────────────────────────────────────────────

const CREATIVE_FACTS = [
  { en: 'VJ · TouchDesigner · UE5 · p5.js', tr: 'VJ · TouchDesigner · UE5 · p5.js' },
  { en: 'Stadium-scale live visual production', tr: 'Stadyum ölçekli canlı görsel prodüksiyon' },
  { en: 'Sónar Festival · Kenan Doğulu tours', tr: 'Sónar Festivali · Kenan Doğulu turnaları' },
  { en: 'Generative art & interactive installations', tr: 'Üretken sanat & etkileşimli enstalasyonlar' },
  { en: 'Stage design · Experience design', tr: 'Sahne tasarımı · Deneyim tasarımı' },
]

const CLINICAL_FACTS = [
  { en: '8+ years · CRO & Sponsor side', tr: '8+ yıl · CRO & Sponsor tarafı' },
  { en: 'Oncology, Hematology, Digital Health', tr: 'Onkoloji, Hematoloji, Dijital Sağlık' },
  { en: 'Parexel · IQVIA · Fortrea · ICON', tr: 'Parexel · IQVIA · Fortrea · ICON' },
  { en: 'ICH-GCP · RBQM · SaMD validation', tr: 'ICH-GCP · RBQM · SaMD doğrulama' },
  { en: 'TSCA Vice President (2024–present)', tr: 'TSCA Başkan Yardımcısı (2024–günümüz)' },
]

const EDUCATION = [
  {
    degreeEn: 'M.Sc. Pharmaceutical Medicine',
    degreeTr: 'Y.L. Farmasötik Tıp',
    instEn:   'University of Basel · Switzerland',
    instTr:   'Basel Üniversitesi · İsviçre',
    year:     '2023–2025',
  },
  {
    degreeEn: 'B.Sc. Biology',
    degreeTr: 'L. Biyoloji',
    instEn:   'Hacettepe University · Ankara',
    instTr:   'Hacettepe Üniversitesi · Ankara',
    year:     '2009–2014',
  },
  {
    degreeEn: 'B.F.A. Interior Architecture & Environmental Design',
    degreeTr: 'G.S.L. İç Mimarlık & Çevre Tasarımı',
    instEn:   'Çankaya University · Ankara',
    instTr:   'Çankaya Üniversitesi · Ankara',
    year:     '2009–2016',
  },
]

const CERTIFICATIONS = [
  'ICH-GCP E6(R3)',
  'CITI Program',
  'Clinical Research Coordinator',
  'SaMD / MDR Foundations',
  'Transcelerate Risk-Based Monitoring',
]

const LANGUAGES = [
  { lang: 'Turkish', level: 'Native', langTr: 'Türkçe', levelTr: 'Anadil' },
  { lang: 'English', level: 'Fluent', langTr: 'İngilizce', levelTr: 'İleri' },
  { lang: 'German',  level: 'B1',     langTr: 'Almanca',   levelTr: 'B1' },
]

// ─── Styles ──────────────────────────────────────────────────────────────────

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }

const ease = 'easeOut' as const
const vp   = { once: true, margin: '-40px' }

const fade = (delay = 0) => ({
  initial:     { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    vp,
  transition:  { duration: 0.6, delay, ease },
})

function SectionLabel({ en, tr }: { en: string; tr: string }) {
  const { t } = useLang()
  return (
    <motion.p
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vp}
      transition={{ duration: 0.55 }}
      style={{ ...MONO, fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1.75rem' }}
    >
      {t(en, tr)}
    </motion.p>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function AboutContent() {
  const router = useRouter()
  const { t }  = useLang()
  const { switchMode, mode } = useAudio()

  useEffect(() => { switchMode('bio') }, [switchMode])

  const modeLabel = mode === 'bio' ? 'BIO' : mode === 'signal' ? 'SIGNAL' : 'DRIFT'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      {/* ─── Background ──────────────────────────────────────────────────── */}
      <HeroParticles />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'rgba(10,12,10,0.72)' }} />

      {/* ─── Top bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          right:          0,
          zIndex:         50,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0.9rem 1rem',
          borderBottom:   '1px solid var(--color-border)',
          background:     'rgba(10,12,10,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={() => { audio.navigate(); router.push('/') }}
          onMouseEnter={() => audio.hover()}
          style={{ ...MONO, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.4rem', minHeight: '44px' }}
        >
          ← {t('back', 'geri')}
        </button>
        <p style={{ ...MONO, color: 'rgba(122,182,72,0.6)', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
          {t('ABOUT', 'HAKKINDA')}
        </p>
        <p style={{ ...MONO, color: 'var(--color-border)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
          ⬤ MODE_{modeLabel}
        </p>
      </div>

      {/* ─── Page content ────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10, paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* ── Name + location ── */}
          <motion.div {...fade(0)} style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 400, color: 'var(--color-white)', lineHeight: 1.1, marginBottom: '0.6rem' }}>
              Müjgan Armağan Türközü
            </h1>
            <p style={{ ...MONO, fontSize: '0.75rem', color: 'var(--color-muted)', letterSpacing: '0.14em', opacity: 0.85 }}>
              Istanbul · mujganar.studio
            </p>
          </motion.div>

          {/* ── Editorial intro ── */}
          <motion.div {...fade(0.1)} style={{ marginBottom: '5rem', maxWidth: '640px' }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize:   'clamp(1.15rem, 2.5vw, 1.55rem)',
              fontWeight: 300,
              color:      'rgba(200,221,184,0.92)',
              lineHeight: 1.75,
            }}>
              {t(
                'A dual practice across two disciplines that rarely share a room — live visual performance and oncology clinical research. Eight years in each world, fully present in both.',
                'Aynı odada nadiren bir araya gelen iki disiplin arasında çift yönlü bir pratik — canlı görsel performans ve onkoloji klinik araştırması. Her iki dünyada sekizer yıl, ikisinde de tam anlamıyla var.',
              )}
            </p>
          </motion.div>

          {/* ── Dual identity columns ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">

            {/* Creative column */}
            <motion.div {...fade(0.05)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '2px', height: '1.1rem', background: 'rgba(122,182,72,0.6)', flexShrink: 0 }} />
                <p style={{ ...MONO, fontSize: '0.7rem', color: 'rgba(122,182,72,0.85)', letterSpacing: '0.14em' }}>
                  {t('CREATIVE TECHNOLOGIST', 'YARATICI TEKNOLOG')}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {CREATIVE_FACTS.map((f, i) => (
                  <motion.p
                    key={f.en}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={vp}
                    transition={{ duration: 0.45, delay: i * 0.07, ease }}
                    style={{ ...MONO, fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.6, borderLeft: '1px solid var(--color-border)', paddingLeft: '0.9rem' }}
                    onMouseEnter={e => { audio.hover(440); (e.currentTarget as HTMLElement).style.color = 'var(--color-white)'; (e.currentTarget as HTMLElement).style.borderLeftColor = 'rgba(122,182,72,0.5)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)'; (e.currentTarget as HTMLElement).style.borderLeftColor = 'var(--color-border)' }}
                  >
                    {t(f.en, f.tr)}
                  </motion.p>
                ))}
              </div>
            </motion.div>

            {/* Clinical column */}
            <motion.div {...fade(0.1)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '2px', height: '1.1rem', background: 'rgba(74,154,184,0.6)', flexShrink: 0 }} />
                <p style={{ ...MONO, fontSize: '0.7rem', color: 'rgba(74,154,184,0.85)', letterSpacing: '0.14em' }}>
                  {t('CLINICAL RESEARCH PROFESSIONAL', 'KLİNİK ARAŞTIRMA UZMANI')}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {CLINICAL_FACTS.map((f, i) => (
                  <motion.p
                    key={f.en}
                    initial={{ opacity: 0, x: 8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={vp}
                    transition={{ duration: 0.45, delay: i * 0.07, ease }}
                    style={{ ...MONO, fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.6, borderLeft: '1px solid var(--color-border)', paddingLeft: '0.9rem' }}
                    onMouseEnter={e => { audio.hover(550); (e.currentTarget as HTMLElement).style.color = 'var(--color-white)'; (e.currentTarget as HTMLElement).style.borderLeftColor = 'rgba(74,154,184,0.5)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)'; (e.currentTarget as HTMLElement).style.borderLeftColor = 'var(--color-border)' }}
                  >
                    {t(f.en, f.tr)}
                  </motion.p>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── Connecting thread ── */}
          <motion.div
            {...fade(0.05)}
            style={{
              borderTop:    '1px solid var(--color-border)',
              borderBottom: '1px solid var(--color-border)',
              padding:      '2rem 0',
              marginBottom: '5rem',
            }}
          >
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 300, color: 'rgba(200,221,184,0.7)', lineHeight: 1.8 }}>
              {t(
                'Both practices share the same core: systems thinking, human attention, and the question of what happens when rigorous structure meets live, unpredictable conditions.',
                'Her iki pratik aynı özü paylaşır: sistem düşüncesi, insan dikkati ve titiz bir yapının canlı, öngörülemeyen koşullarla buluştuğunda ne olduğu sorusu.',
              )}
            </p>
          </motion.div>

          {/* ── Education ── */}
          <div style={{ marginBottom: '5rem' }}>
            <SectionLabel en="Education" tr="Eğitim" />
            {EDUCATION.map((e, i) => (
              <motion.div
                key={e.degreeEn}
                {...fade(i * 0.06)}
                style={{ borderTop: i === 0 ? '1px solid var(--color-border)' : 'none', padding: '1.4rem 0', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}
              >
                <div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 300, color: 'var(--color-white)', lineHeight: 1.3, marginBottom: '0.3rem' }}>
                    {t(e.degreeEn, e.degreeTr)}
                  </p>
                  <p style={{ ...MONO, fontSize: '0.72rem', color: 'var(--color-muted)', letterSpacing: '0.04em' }}>
                    {t(e.instEn, e.instTr)}
                  </p>
                </div>
                <p style={{ ...MONO, fontSize: '0.7rem', color: 'var(--color-border)', letterSpacing: '0.06em', whiteSpace: 'nowrap', paddingTop: '0.2em' }}>
                  {e.year}
                </p>
              </motion.div>
            ))}
            <div style={{ borderTop: '1px solid var(--color-border)' }} />
          </div>

          {/* ── Certifications + Languages ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

            {/* Certifications */}
            <div>
              <SectionLabel en="Certifications" tr="Sertifikalar" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {CERTIFICATIONS.map((cert, i) => (
                  <motion.p
                    key={cert}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vp}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    style={{ ...MONO, fontSize: '0.75rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
                  >
                    <span style={{ color: 'rgba(74,154,184,0.5)', fontSize: '0.7rem' }}>◆</span>
                    {cert}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <SectionLabel en="Languages" tr="Diller" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {LANGUAGES.map((l, i) => (
                  <motion.div
                    key={l.lang}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vp}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
                  >
                    <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 300, color: 'var(--color-white)' }}>
                      {t(l.lang, l.langTr)}
                    </p>
                    <p style={{ ...MONO, fontSize: '0.7rem', color: 'var(--color-border)', letterSpacing: '0.1em' }}>
                      {t(l.level, l.levelTr)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* ── CTA row ── */}
          <motion.div
            {...fade(0)}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}
          >
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => { audio.navigate(); router.push('/creative') }}
                onMouseEnter={e => { audio.hover(440); (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-green)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(122,182,72,0.7)' }}
                style={{ ...MONO, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'rgba(122,182,72,0.7)', letterSpacing: '0.1em', transition: 'color 0.2s', padding: 0 }}
              >
                {t('creative work →', 'yaratıcı çalışmalar →')}
              </button>
              <button
                onClick={() => { audio.navigate(); router.push('/clinical') }}
                onMouseEnter={e => { audio.hover(550); (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-teal)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(74,154,184,0.7)' }}
                style={{ ...MONO, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'rgba(74,154,184,0.7)', letterSpacing: '0.1em', transition: 'color 0.2s', padding: 0 }}
              >
                {t('clinical work →', 'klinik çalışmalar →')}
              </button>
            </div>
            <a
              href="mailto:mjgntrkz@gmail.com"
              onClick={() => audio.click()}
              onMouseEnter={e => { audio.hover(660); (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-white)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-muted)' }}
              style={{ ...MONO, fontSize: '0.72rem', color: 'var(--color-muted)', letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s' }}
            >
              mjgntrkz@gmail.com
            </a>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}
