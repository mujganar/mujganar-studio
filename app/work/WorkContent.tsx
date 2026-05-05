'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '@/app/context/LanguageContext'
import { audio } from '@/lib/audio'

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'creative' | 'clinical'

// ─── Clinical Data ────────────────────────────────────────────────────────────

const CLINICAL_ROLES = [
  {
    num: '01',
    period: 'Jan 2026',
    role: 'Clinical Research Consultant — Digital Health',
    company: 'Oculera',
    companyDetail: 'VR Ophthalmology Healthtech',
    bullets: [
      'Scoped and delivered full validation study framework for a VR-based CE-marked SaMD',
      'Coordinated scientific exchange with KOLs; patent reviews across USPTO, EPO, WIPO',
      'Competitive intelligence and Freedom-to-Operate assessments',
    ],
  },
  {
    num: '02',
    period: '2024–2026',
    role: 'Senior Site Manager',
    company: 'Parexel International',
    companyDetail: 'Sponsor: AstraZeneca',
    bullets: [
      'End-to-end site oversight for oncology studies, ICH-GCP compliance',
      'Remote and onsite monitoring (PSV, SIV, RMV, COV), SDR/SDV, RBQM',
    ],
  },
  {
    num: '03',
    period: '2023–2024',
    role: 'Lead Site Manager — Oncology (Multi-Sponsor)',
    company: 'Fortrea · MSD',
    companyDetail: '',
    bullets: [
      'Led multi-sponsor project operations; mentorship and quality oversight',
      'Risk mitigation plans across site and sponsor-facing workstreams',
    ],
  },
  {
    num: '04',
    period: '2022–2023',
    role: 'Clinical Operations Project Manager',
    company: 'littlefish foundation',
    companyDetail: 'USA · Remote',
    bullets: [
      'Led 15+ simultaneous global cross-functional clinical projects',
      'Agile-style action trackers, risk logs; 20+ operational risks mitigated',
    ],
  },
  {
    num: '05',
    period: '2021–2022',
    role: 'Project Associate — Hematology & Oncology',
    company: 'ICON · Johnson & Johnson',
    companyDetail: '',
    bullets: [
      'Site timelines, IMP supply tracking, vendor communication',
    ],
  },
  {
    num: '06',
    period: '2020–2021',
    role: 'Clinical Project Associate',
    company: 'IQVIA · Eli Lilly',
    companyDetail: '',
    bullets: [
      'GCP compliance, regulatory documentation, investigator communication',
    ],
  },
  {
    num: '07',
    period: '2018–2020',
    role: 'Senior Site Coordinator & Educator',
    company: 'IQVIA',
    companyDetail: 'Egypt & Türkiye',
    bullets: [
      'Oncology, gastroenterology, CNS studies',
      'Supervised and trained a team of 15 site coordinators',
      'Collaborated with MSLs and HCPs on recruitment strategy',
    ],
  },
]

const CERTIFICATIONS = [
  'ICH-GCP E6(R2) Certified',
  'IAOCR CRA Accreditation 2025',
  'PMP (In Progress)',
  'AI in Working Life 2024',
]

const AFFILIATIONS = [
  { org: 'Turkish Site Coordinators Association (TSCA)', role: 'Founding Member & Former VP' },
  { org: 'Association of Clinical Research Professionals (ACRP)', role: 'Member' },
]

const SKILLS = [
  { label: 'Project Tools',  values: ['MS Project', 'MS Office Suite', 'Confluence', 'Jira-style tracking'] },
  { label: 'Digital & AI',   values: ['n8n workflow automation', 'Claude API integration', 'AI-assisted data analysis'] },
  { label: 'Clinical Systems', values: ['Medidata', 'Veeva', 'Oracle', 'ALMAC', 'eTMF', 'CTMS'] },
  { label: 'Frameworks',     values: ['Agile/Scrum', 'ICH-GCP', 'GMP/GDP', 'Risk-Based Project Management', 'QA'] },
  { label: 'Languages',      values: ['English (Advanced)', 'Turkish (Native)', 'Spanish (Intermediate)'] },
]

// ─── Creative Data ────────────────────────────────────────────────────────────

const FEATURED_CREATIVE = [
  {
    id: 'kd',
    title: 'Kenan Doğulu',
    subtitle: 'Touring VJ · Stadium-Scale Live Performances',
    role: 'Live camera-reactive visual performances for stadium-scale shows',
    venues: [
      'Porsche Arena · Stuttgart',
      'Volkswagen Arena · Istanbul',
      'Indigo at The O2 · London',
      'Mitsubishi Electric Halle · Düsseldorf',
    ],
    tags: ['Touring VJ', 'Camera-Reactive', 'Stadium', 'TouchDesigner'],
  },
  {
    id: 'sonar',
    title: 'Sónar Festival 2023',
    subtitle: 'Visual Production & Live VJ',
    role: 'Visual Production · Live VJ Performance',
    artists: ['İpek İpekçioğlu', 'Argy'],
    tags: ['Festival VJ', 'Visual Production', 'Electronic'],
  },
  {
    id: 'yonca',
    title: "Yonca's 90s Express",
    subtitle: 'Live Theatre Production',
    role: 'Full LED Backdrop Content · Experience Design & Stage Design',
    tags: ['LED Design', 'Theatre', 'Experience Design', 'Stage Design', 'UE5'],
  },
]

const OTHER_PERFORMANCES = [
  { artist: 'Brina Knauss',       role: 'Live VJ Performance' },
  { artist: 'Joyhauser',          role: 'Live VJ Performance' },
  { artist: 'Laolu',              role: 'Jazz Gathering · Live VJ' },
  { artist: 'Chris Avantgarde',   role: 'Live VJ Performance' },
  { artist: 'Massano',            role: 'Live VJ Performance' },
  { artist: 'Zara',               role: 'Harbiye Cemil Topuzlu Open-Air Theatre + Zorlu PSM · Istanbul' },
  { artist: 'ZR Music Production', role: 'Touring VJ' },
  { artist: 'Bodrum Antique Theatre', role: 'Live VJ Performance' },
]

const OTHER_EVENTS = [
  { event: 'Sonance Festival 2021',               role: 'Visual Production & Live VJ' },
  { event: 'Magic Break Festival 2023',           role: 'Live VJ · Electronic Music Stage' },
  { event: 'Hope Alcazar',                        role: 'Exhibition Lighting Designer' },
  { event: 'Ankara Piyano Festivali 2019',        role: 'Artist Management' },
  { event: 'Ankara Dünya Müzikleri Festivali 2019', role: 'Backstage Management' },
]

const CAPABILITIES = [
  'VJ Performance',
  'Experience Design',
  'Stage Design',
  'LED Content Design',
  'Exhibition Lighting Design',
  'Event Organization',
  'Visual Production',
  'Artist Management',
  'Backstage Management',
  'TouchDesigner',
  'Unreal Engine 5',
  'p5.js',
  'GLSL / ISF',
  'Three.js',
  'MediaPipe',
]

// ─── Shared UI ────────────────────────────────────────────────────────────────

const TAG_STYLE = {
  fontFamily: 'var(--font-mono)',
  color: 'var(--color-muted)',
  border: '1px solid var(--color-border)',
  fontSize: '0.7rem',
  padding: '2px 8px',
  letterSpacing: '0.08em',
}

function Tag({ children }: { children: string }) {
  return <span style={TAG_STYLE}>{children}</span>
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="text-xs uppercase tracking-widest mb-8"
      style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', letterSpacing: '0.2em' }}
    >
      {children}
    </p>
  )
}

const vp   = { once: true, margin: '-50px' }
const ease  = 'easeOut' as const
const slide = (i = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: vp,
  transition: { duration: 0.6, delay: i * 0.07, ease },
})

// ─── Clinical Tab ─────────────────────────────────────────────────────────────

function ClinicalTab() {
  const { t } = useLang()

  return (
    <div className="flex flex-col gap-20">

      {/* Timeline */}
      <div>
        <SectionLabel>{t('Experience', 'Deneyim')}</SectionLabel>
        <div className="flex flex-col">
          {CLINICAL_ROLES.map((r, i) => (
            <motion.div
              key={r.num}
              {...slide(i)}
              className="flex gap-6 md:gap-10 py-8"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              {/* Number + period */}
              <div className="shrink-0 w-24 md:w-32 flex flex-col gap-1 pt-1">
                <span
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-border)', fontSize: '0.7rem', letterSpacing: '0.1em' }}
                >
                  {r.num}
                </span>
                <span
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.75rem', lineHeight: 1.4 }}
                >
                  {r.period}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
                    fontWeight: 300,
                    color: 'var(--color-white)',
                    lineHeight: 1.25,
                  }}
                >
                  {r.role}
                </h3>
                <p
                  className="mb-4"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-teal)', fontSize: '0.78rem', letterSpacing: '0.06em' }}
                >
                  {r.company}
                  {r.companyDetail && (
                    <span style={{ color: 'var(--color-muted)' }}>
                      {' '}· {r.companyDetail}
                    </span>
                  )}
                </p>
                <ul className="flex flex-col gap-2">
                  {r.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      className="flex gap-3 items-start"
                      style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.8125rem', lineHeight: 1.7 }}
                    >
                      <span style={{ color: 'var(--color-border)', flexShrink: 0, marginTop: '0.35em' }}>—</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)' }} />
        </div>
      </div>

      {/* Certifications */}
      <motion.div {...slide()}>
        <SectionLabel>{t('Certifications', 'Sertifikalar')}</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {CERTIFICATIONS.map(c => <Tag key={c}>{c}</Tag>)}
        </div>
      </motion.div>

      {/* Affiliations */}
      <motion.div {...slide()}>
        <SectionLabel>{t('Affiliations', 'Üyelikler')}</SectionLabel>
        <div className="flex flex-col gap-4">
          {AFFILIATIONS.map(a => (
            <div key={a.org}>
              <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-white)', fontWeight: 300, fontSize: '1.1rem' }}>
                {a.org}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                {a.role}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div {...slide()}>
        <SectionLabel>{t('Skills & Tools', 'Beceriler & Araçlar')}</SectionLabel>
        <div className="flex flex-col gap-6">
          {SKILLS.map(s => (
            <div key={s.label}>
              <p
                className="text-xs uppercase tracking-widest mb-2"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-border)', letterSpacing: '0.15em' }}
              >
                {s.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {s.values.map(v => <Tag key={v}>{v}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Education */}
      <motion.div {...slide()}>
        <SectionLabel>{t('Education', 'Eğitim')}</SectionLabel>
        <div className="flex flex-col gap-4">
          {[
            { deg: 'MSc Genetics', detail: 'Evolutionary Biology · 2016–2018' },
            { deg: 'BSc Biology',  detail: '2010–2016' },
          ].map(e => (
            <div key={e.deg} className="flex gap-4 items-start">
              <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-white)', fontWeight: 300, fontSize: '1.1rem' }}>
                {e.deg}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.78rem', paddingTop: '0.2em' }}>
                {e.detail}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

// ─── Creative Tab ─────────────────────────────────────────────────────────────

function CreativeTab() {
  const { t } = useLang()

  return (
    <div className="flex flex-col gap-20">

      {/* Featured */}
      <div>
        <SectionLabel>{t('Featured Productions', 'Öne Çıkan Prodüksiyonlar')}</SectionLabel>
        <div className="flex flex-col gap-px" style={{ background: 'var(--color-border)' }}>
          {FEATURED_CREATIVE.map((item, i) => (
            <motion.div
              key={item.id}
              {...slide(i)}
              className="p-8 flex flex-col gap-4"
              style={{ background: 'var(--color-space)' }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                    fontWeight: 300,
                    color: 'var(--color-white)',
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-1"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-green)', fontSize: '0.75rem', letterSpacing: '0.1em' }}
                >
                  {item.subtitle}
                </p>
              </div>

              <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.8125rem', lineHeight: 1.7 }}>
                {item.role}
              </p>

              {'venues' in item && item.venues && (
                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-border)', letterSpacing: '0.15em' }}
                  >
                    {t('Venues', 'Mekanlar')}
                  </p>
                  <div className="flex flex-col gap-1">
                    {item.venues.map(v => (
                      <p key={v} style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.8125rem' }}>
                        {v}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {'artists' in item && item.artists && (
                <div>
                  <p
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-border)', letterSpacing: '0.15em' }}
                  >
                    {t('Artists', 'Sanatçılar')}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.8125rem' }}>
                    {item.artists.join(' · ')}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Other performances */}
      <div>
        <SectionLabel>{t('Artist Performances', 'Sanatçı Performansları')}</SectionLabel>
        <div className="flex flex-col">
          {OTHER_PERFORMANCES.map((p, i) => (
            <motion.div
              key={p.artist}
              {...slide(i)}
              className="flex items-start gap-6 py-5"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-white)',
                    fontWeight: 300,
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                  }}
                >
                  {p.artist}
                </p>
                <p
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}
                >
                  {p.role}
                </p>
              </div>
            </motion.div>
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)' }} />
        </div>
      </div>

      {/* Other events */}
      <div>
        <SectionLabel>{t('Events & Other Roles', 'Etkinlikler & Diğer Roller')}</SectionLabel>
        <div className="flex flex-col">
          {OTHER_EVENTS.map((e, i) => (
            <motion.div
              key={e.event}
              {...slide(i)}
              className="flex items-start gap-6 py-5"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-white)',
                    fontWeight: 300,
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                  }}
                >
                  {e.event}
                </p>
                <p
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}
                >
                  {e.role}
                </p>
              </div>
            </motion.div>
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)' }} />
        </div>
      </div>

      {/* Capabilities */}
      <motion.div {...slide()}>
        <SectionLabel>{t('Capabilities', 'Uzmanlık Alanları')}</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {CAPABILITIES.map(c => <Tag key={c}>{c}</Tag>)}
        </div>
      </motion.div>

    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkContent() {
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>(() =>
    searchParams.get('tab') === 'clinical' ? 'clinical' : 'creative'
  )
  const { t } = useLang()

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="mb-14"
      >
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', letterSpacing: '0.2em' }}
        >
          {t('Portfolio', 'Portföy')}
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 300,
            color: 'var(--color-white)',
            lineHeight: 1.1,
          }}
        >
          {t('Work', 'Projeler')}
        </h1>
      </motion.div>

      {/* Tab switcher */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease }}
        className="flex gap-px mb-16"
        style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '0' }}
      >
        {(['creative', 'clinical'] as Tab[]).map(id => {
          const active = tab === id
          const label  = id === 'creative'
            ? t('Creative', 'Yaratıcı')
            : t('Clinical', 'Klinik')
          return (
            <button
              key={id}
              onClick={() => { setTab(id); audio.click(); audio.shiftAmbient(id === 'creative' ? 'warm' : 'cool') }}
              onMouseEnter={() => audio.hover()}
              className="relative px-6 py-3 text-xs uppercase tracking-widest transition-colors duration-200"
              style={{
                fontFamily: 'var(--font-mono)',
                color: active ? 'var(--color-white)' : 'var(--color-muted)',
                letterSpacing: '0.18em',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {label}
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: '1px', backgroundColor: 'var(--color-green)' }}
                  transition={{ duration: 0.3, ease }}
                />
              )}
            </button>
          )
        })}
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === 'creative' ? (
          <motion.div
            key="creative"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
          >
            <CreativeTab />
          </motion.div>
        ) : (
          <motion.div
            key="clinical"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease }}
          >
            <ClinicalTab />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
