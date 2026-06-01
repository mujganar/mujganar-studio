'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useLang } from '@/app/context/LanguageContext'
import { useAudio } from '@/app/context/AudioContext'
import { audio } from '@/lib/audio'

const CameraBackground = dynamic(() => import('@/app/components/CameraBackground').then(m => ({ default: m.CameraBackground })), { ssr: false })
const MatrixRain        = dynamic(() => import('@/app/components/MatrixRain').then(m => ({ default: m.MatrixRain })), { ssr: false })
const HeroParticles     = dynamic(() => import('@/app/components/HeroParticles'), { ssr: false })

type CamState = 'prompt' | 'active' | 'denied'

// ─── Data ────────────────────────────────────────────────────────────────────

const PERFORMANCES = [
  {
    id: 'kd',
    titleEn: 'Kenan Doğulu',
    titleTr: 'Kenan Doğulu',
    roleEn:  'Touring VJ — Stadium-Scale Live Performances',
    roleTr:  'Turne VJ — Stadyum Ölçekli Canlı Performanslar',
    detailEn: 'Porsche Arena · Stuttgart · Volkswagen Arena · Istanbul · Indigo at The O2 · London · Mitsubishi Electric Halle · Düsseldorf · Zorlu PSM · Harbiye Cemil Topuzlu · Bodrum Antique Theatre',
    detailTr: 'Porsche Arena · Stuttgart · Volkswagen Arena · İstanbul · Indigo at The O2 · Londra · Mitsubishi Electric Halle · Düsseldorf · Zorlu PSM · Harbiye Cemil Topuzlu · Bodrum Antik Tiyatro',
    tags: ['STADIUM', 'TOURING', 'TOUCHDESIGNER'],
  },
  {
    id: 'sonar',
    titleEn: 'Sónar Festival 2023',
    titleTr: 'Sónar Festivali 2023',
    roleEn:  'Visual Production & Live VJ',
    roleTr:  'Görsel Prodüksiyon & Canlı VJ',
    detailEn: 'Artists: İpek İpekçioğlu · Argy',
    detailTr: 'Sanatçılar: İpek İpekçioğlu · Argy',
    tags: ['FESTIVAL', 'VISUAL PRODUCTION'],
  },
  {
    id: 'magic',
    titleEn: 'Magic Break Festival 2023',
    titleTr: 'Magic Break Festivali 2023',
    roleEn:  'Live VJ — Electronic Music Stage',
    roleTr:  'Canlı VJ — Elektronik Müzik Sahnesi',
    detailEn: '',
    detailTr: '',
    tags: ['FESTIVAL', 'ELECTRONIC'],
  },
  {
    id: 'sonance',
    titleEn: 'Sonance Festival 2021',
    titleTr: 'Sonance Festivali 2021',
    roleEn:  'Visual Production & Live VJ',
    roleTr:  'Görsel Prodüksiyon & Canlı VJ',
    detailEn: '',
    detailTr: '',
    tags: ['FESTIVAL'],
  },
  {
    id: 'various',
    titleEn: 'Artist Performances',
    titleTr: 'Sanatçı Performansları',
    roleEn:  'Live VJ',
    roleTr:  'Canlı VJ',
    detailEn: 'Brina Knauss · Joyhauser · Laolu · Chris Avantgarde · Massano · Zara',
    detailTr: 'Brina Knauss · Joyhauser · Laolu · Chris Avantgarde · Massano · Zara',
    tags: ['VARIOUS FESTIVALS'],
  },
  {
    id: 'yonca',
    titleEn: "Yonca's 90s Express",
    titleTr: '90\'lar Ekspresi',
    roleEn:  'Full LED Backdrop Content · Experience Design & Stage Design',
    roleTr:  'Tam LED Arka Plan İçeriği · Deneyim Tasarımı & Sahne Tasarımı',
    detailEn: 'Live theatrical production',
    detailTr: 'Canlı tiyatro prodüksiyonu',
    tags: ['THEATRE', 'LED PRODUCTION', 'UE5'],
  },
  {
    id: 'hope',
    titleEn: 'Hope Alcazar',
    titleTr: 'Hope Alcazar',
    roleEn:  'Exhibition Lighting Designer',
    roleTr:  'Sergi Işık Tasarımcısı',
    detailEn: '',
    detailTr: '',
    tags: ['EXHIBITION'],
  },
  {
    id: 'zr',
    titleEn: 'ZR Music Production',
    titleTr: 'ZR Müzik Prodüksiyon',
    roleEn:  'Touring VJ',
    roleTr:  'Turne VJ',
    detailEn: '',
    detailTr: '',
    tags: ['TOURING'],
  },
]

const CAPABILITIES = [
  { en: 'Experience Design', tr: 'Deneyim Tasarımı',     sub_en: 'Spatial + audience narrative',     sub_tr: 'Mekan + izleyici anlatısı' },
  { en: 'Stage Design',      tr: 'Sahne Tasarımı',       sub_en: 'LED systems · scenic integration',  sub_tr: 'LED sistemleri · sahne entegrasyonu' },
  { en: 'Event Organization',tr: 'Etkinlik Organizasyonu',sub_en: 'Logistics · artist management',     sub_tr: 'Lojistik · sanatçı yönetimi' },
]

const EARLY_CAREER = [
  { en: 'Ankara Piyano Festivali 2019', tr: 'Ankara Piyano Festivali 2019', roleEn: 'Artist Management', roleTr: 'Sanatçı Yönetimi' },
  { en: 'Ankara Dünya Müzikleri Festivali 2019', tr: 'Ankara Dünya Müzikleri Festivali 2019', roleEn: 'Backstage Management', roleTr: 'Sahne Arkası Yönetimi' },
]

// ─── Styles ──────────────────────────────────────────────────────────────────

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }
const CARD: React.CSSProperties = {
  background:     'rgba(10,12,10,0.82)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderLeft:     '2px solid rgba(122,182,72,0.35)',
  padding:        '1rem 1.25rem',
  transition:     'border-color 0.25s, box-shadow 0.25s',
}

const ease = 'easeOut' as const
const vp   = { once: true, margin: '-40px' }
const slide = (i = 0) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    vp,
  transition:  { duration: 0.55, delay: i * 0.06, ease },
})

// ─── Sub-components ──────────────────────────────────────────────────────────

function PerformanceCard({ p, index }: { p: typeof PERFORMANCES[0]; index: number }) {
  const { t } = useLang()
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      {...slide(index)}
      onMouseEnter={() => { setHovered(true); audio.hover(440 + index * 40) }}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...CARD,
        borderLeftColor: hovered ? 'rgba(122,182,72,0.8)' : 'rgba(122,182,72,0.35)',
        boxShadow: hovered ? '0 0 18px rgba(122,182,72,0.08)' : 'none',
        cursor: 'default',
      }}
    >
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 300, color: 'var(--color-white)', lineHeight: 1.2, marginBottom: '0.3rem' }}>
        {t(p.titleEn, p.titleTr)}
      </h3>
      <p style={{ ...MONO, fontSize: '0.72rem', color: hovered ? 'var(--color-green)' : 'var(--color-muted)', letterSpacing: '0.06em', transition: 'color 0.2s', marginBottom: p.detailEn ? '0.5rem' : '0.75rem' }}>
        {t(p.roleEn, p.roleTr)}
      </p>
      {(t(p.detailEn, p.detailTr)) && (
        <p style={{ ...MONO, fontSize: '0.72rem', color: 'var(--color-border)', lineHeight: 1.65, marginBottom: '0.75rem' }}>
          {t(p.detailEn, p.detailTr)}
        </p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {p.tags.map(tag => (
          <span key={tag} style={{ ...MONO, fontSize: '0.7rem', padding: '2px 8px', color: hovered ? 'var(--color-muted)' : 'var(--color-border)', border: `1px solid ${hovered ? 'rgba(122,182,72,0.3)' : 'rgba(30,35,30,0.8)'}`, letterSpacing: '0.08em', transition: 'color 0.2s, border-color 0.2s' }}>
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function CreativeContent() {
  const router = useRouter()
  const { t }  = useLang()
  const { switchMode, mode } = useAudio()

  const [camState, setCamState]   = useState<CamState>('prompt')
  const [stream,   setStream]     = useState<MediaStream | null>(null)
  const [cursor,   setCursor]     = useState({ x: -200, y: -200 })

  // Switch to DRIFT on enter
  useEffect(() => { switchMode('drift') }, [switchMode])

  // Custom cursor
  useEffect(() => {
    const onMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const enableCamera = async () => {
    audio.click()
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      setStream(s)
      setCamState('active')
    } catch {
      setCamState('denied')
    }
  }

  const denyCamera = () => { audio.click(); setCamState('denied') }

  const modeLabel = mode === 'bio' ? 'BIO' : mode === 'signal' ? 'SIGNAL' : 'DRIFT'

  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="md:cursor-none"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      {/* ─── Backgrounds ─────────────────────────────────────────────────── */}
      {camState === 'active' && stream && <CameraBackground stream={stream} />}
      {camState === 'active' && <MatrixRain />}
      {camState === 'denied' && <HeroParticles />}

      {/* Dark base for prompt state */}
      {camState === 'prompt' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#0a0c0a' }} />
      )}

      {/* ─── Camera permission prompt ────────────────────────────────────── */}
      <AnimatePresence>
        {camState === 'prompt' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          >
            <div style={{ ...MONO, background: '#111411', border: '1px solid rgba(122,182,72,0.2)', padding: '2.5rem 2rem', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
              {/* Camera icon */}
              <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'center' }}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                  <rect x="4" y="12" width="32" height="22" rx="3" stroke="rgba(122,182,72,0.6)" strokeWidth="1.5" />
                  <circle cx="20" cy="23" r="6" stroke="rgba(122,182,72,0.6)" strokeWidth="1.5" />
                  <path d="M14 12V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="rgba(122,182,72,0.6)" strokeWidth="1.5" />
                  <circle cx="32" cy="17" r="1.5" fill="rgba(122,182,72,0.6)" />
                </svg>
              </div>

              <p style={{ color: 'rgba(122,182,72,0.8)', fontSize: '0.75rem', letterSpacing: '0.14em', marginBottom: '0.75rem' }}>
                // VISUAL FEED REQUESTED
              </p>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.78rem', lineHeight: 1.7, marginBottom: '2rem', opacity: 0.85 }}>
                {t(
                  'Enable your camera to experience an augmented reality layer. Your feed is processed locally — never stored or transmitted.',
                  'Kameranı etkinleştir ve artırılmış gerçeklik katmanını deneyimle. Görüntün yerel olarak işlenir — asla depolanmaz veya iletilmez.',
                )}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={enableCamera}
                  style={{ ...MONO, padding: '0.75rem', background: 'rgba(122,182,72,0.1)', border: '1px solid rgba(122,182,72,0.4)', color: 'var(--color-green)', fontSize: '0.75rem', letterSpacing: '0.14em', cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s', minHeight: '44px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(122,182,72,0.18)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(122,182,72,0.1)' }}
                >
                  {t('ENABLE FEED', 'BESLEME ETKİNLEŞTİR')}
                </button>
                <button
                  onClick={denyCamera}
                  style={{ ...MONO, padding: '0.75rem', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-muted)', fontSize: '0.75rem', letterSpacing: '0.12em', cursor: 'pointer', minHeight: '44px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-muted)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)' }}
                >
                  {t('CONTINUE WITHOUT', 'KAMERASIZ DEVAM ET')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Top bar ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position:       'fixed',
          top:            0,
          left:           0,
          right:          0,
          zIndex:         40,
          height:         '3.25rem',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 1rem',
          background:     'rgba(10,12,10,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom:   '1px solid rgba(122,182,72,0.1)',
        }}
      >
        <button
          onClick={() => { audio.navigate(); router.push('/') }}
          onMouseEnter={() => audio.hover()}
          style={{ ...MONO, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.4rem', minHeight: '44px' }}
        >
          ← {t('back', 'geri')}
        </button>
        <p style={{ ...MONO, color: 'rgba(122,182,72,0.8)', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
          {t('CREATIVE TECHNOLOGIST', 'YARATICI TEKNOLOG')}
        </p>
        <p style={{ ...MONO, color: 'var(--color-border)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
          ⬤ MODE_{modeLabel}
        </p>
      </div>

      {/* ─── Page content ────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10, paddingTop: '5rem', paddingBottom: '5rem', minHeight: '100vh' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Section: Live Performances */}
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vp}
            transition={{ duration: 0.6 }}
            style={{ ...MONO, fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.5rem' }}
          >
            {t('Live Performances', 'Canlı Performanslar')}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-20">
            {PERFORMANCES.map((p, i) => (
              <PerformanceCard key={p.id} p={p} index={i} />
            ))}
          </div>

          {/* Section: Capabilities */}
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vp}
            transition={{ duration: 0.6 }}
            style={{ ...MONO, fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '2.5rem' }}
          >
            {t('Capabilities', 'Uzmanlık Alanları')}
          </motion.p>

          <div style={{ marginBottom: '5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {CAPABILITIES.map((cap, i) => (
              <motion.div key={cap.en} {...slide(i)}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--color-white)', lineHeight: 1.1, opacity: 0.9 }}>
                  {t(cap.en, cap.tr)}
                </h2>
                <p style={{ ...MONO, fontSize: '0.72rem', color: 'var(--color-border)', marginTop: '0.4rem', letterSpacing: '0.06em' }}>
                  {t(cap.sub_en, cap.sub_tr)}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Section: Early Career */}
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vp}
            transition={{ duration: 0.6 }}
            style={{ ...MONO, fontSize: '0.7rem', color: 'var(--color-muted)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '1.5rem' }}
          >
            {t('Early Career', 'Erken Kariyer')}
          </motion.p>

          <div style={{ marginBottom: '5rem' }}>
            {EARLY_CAREER.map((e, i) => (
              <motion.div
                key={e.en}
                {...slide(i)}
                style={{ borderTop: '1px solid var(--color-border)', padding: '1.1rem 0', display: 'flex', gap: '1.5rem', alignItems: 'start' }}
              >
                <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-white)', fontWeight: 300, fontSize: '1.05rem' }}>
                  {t(e.en, e.tr)}
                </span>
                <span style={{ ...MONO, color: 'var(--color-muted)', fontSize: '0.72rem', paddingTop: '0.2em' }}>
                  {t(e.roleEn, e.roleTr)}
                </span>
              </motion.div>
            ))}
            <div style={{ borderTop: '1px solid var(--color-border)' }} />
          </div>

          {/* CTA */}
          <motion.div {...slide()} style={{ textAlign: 'center' }}>
            <a
              href="/contact"
              onClick={() => audio.navigate()}
              style={{ ...MONO, color: 'var(--color-muted)', fontSize: '0.8rem', letterSpacing: '0.12em', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => { audio.hover(660); e.currentTarget.style.color = 'var(--color-green)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)' }}
            >
              {t('Get in touch about a project →', 'Proje için iletişime geç →')}
            </a>
          </motion.div>

        </div>
      </div>

      {/* ─── Custom crosshair cursor (desktop only) ─────────────────────── */}
      <div
        aria-hidden="true"
        className="hidden md:block"
        style={{
          position:      'fixed',
          left:          cursor.x,
          top:           cursor.y,
          transform:     'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex:        9999,
          color:         'var(--color-green)',
          fontFamily:    'monospace',
          fontSize:      '22px',
          fontWeight:    300,
          lineHeight:    1,
          userSelect:    'none',
          opacity:       0.85,
          textShadow:    '0 0 6px var(--color-green)',
        }}
      >
        +
      </div>
    </motion.div>
  )
}
