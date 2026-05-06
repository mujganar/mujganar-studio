'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useLang } from '@/app/context/LanguageContext'
import { useAudio } from '@/app/context/AudioContext'
import { audio } from '@/lib/audio'

const LabScene = dynamic(() => import('@/app/components/LabScene').then(m => ({ default: m.LabScene })), { ssr: false })

// ─── Data ────────────────────────────────────────────────────────────────────

const TIMELINE = [
  {
    num: '01', period: 'Jan 2026',
    roleEn: 'Clinical Research Consultant — Digital Health',
    roleTr: 'Klinik Araştırma Danışmanı — Dijital Sağlık',
    companyEn: 'Oculera', companyTr: 'Oculera',
    detailEn: 'VR Ophthalmology Healthtech', detailTr: 'VR Oftalmoloji Sağlık Teknolojisi',
    bullets: [
      { en: 'VR-based CE-marked SaMD validation framework scoped and delivered', tr: 'VR tabanlı CE işaretli SaMD doğrulama çerçevesi kapsamlandırıldı ve teslim edildi' },
      { en: 'KOL coordination · Patent reviews: USPTO, EPO, WIPO', tr: 'KOL koordinasyonu · Patent incelemeleri: USPTO, EPO, WIPO' },
      { en: 'Freedom-to-Operate assessments · Competitive intelligence', tr: 'Kullanım Özgürlüğü değerlendirmeleri · Rekabetçi istihbarat' },
    ],
  },
  {
    num: '02', period: '2024–2026',
    roleEn: 'Senior Site Manager',
    roleTr: 'Kıdemli Merkez Yöneticisi',
    companyEn: 'Parexel International', companyTr: 'Parexel International',
    detailEn: 'Sponsor: AstraZeneca', detailTr: 'Sponsor: AstraZeneca',
    bullets: [
      { en: 'End-to-end oncology site oversight — ICH-GCP compliance', tr: 'Uçtan uca onkoloji merkez denetimi — ICH-GCP uyumu' },
      { en: 'Remote & onsite monitoring: PSV, SIV, RMV, COV, SDR/SDV', tr: 'Uzak & yerinde izleme: PSV, SIV, RMV, COV, SDR/SDV' },
      { en: 'RBQM-driven risk assessments', tr: 'RBQM odaklı risk değerlendirmeleri' },
    ],
  },
  {
    num: '03', period: '2023–2024',
    roleEn: 'Lead Site Manager — Oncology (Multi-Sponsor)',
    roleTr: 'Baş Merkez Yöneticisi — Onkoloji (Çok Sponsorlu)',
    companyEn: 'Fortrea · MSD', companyTr: 'Fortrea · MSD',
    detailEn: '', detailTr: '',
    bullets: [
      { en: 'Multi-sponsor project operations leadership', tr: 'Çok sponsorlu proje operasyonları liderliği' },
      { en: 'Risk mitigation · Quality oversight & mentorship', tr: 'Risk azaltma · Kalite denetimi & mentorluk' },
    ],
  },
  {
    num: '04', period: '2022–2023',
    roleEn: 'Clinical Operations Project Manager',
    roleTr: 'Klinik Operasyonlar Proje Müdürü',
    companyEn: 'littlefish foundation', companyTr: 'littlefish foundation',
    detailEn: 'USA · Remote', detailTr: 'ABD · Uzaktan',
    bullets: [
      { en: '15+ simultaneous global cross-functional projects', tr: '15+ eş zamanlı küresel çapraz fonksiyonlu proje' },
      { en: 'Agile-style tracking · 20+ operational risks mitigated', tr: 'Agile tarzı takip · 20+ operasyonel risk azaltıldı' },
    ],
  },
  {
    num: '05', period: '2021–2022',
    roleEn: 'Project Associate — Hematology & Oncology',
    roleTr: 'Proje Asistanı — Hematoloji & Onkoloji',
    companyEn: 'ICON · Johnson & Johnson', companyTr: 'ICON · Johnson & Johnson',
    detailEn: '', detailTr: '',
    bullets: [
      { en: 'Site timelines · IMP supply tracking · Vendor coordination', tr: 'Merkez takvimleri · IMP tedarik takibi · Satıcı koordinasyonu' },
    ],
  },
  {
    num: '06', period: '2020–2021',
    roleEn: 'Clinical Project Associate',
    roleTr: 'Klinik Proje Asistanı',
    companyEn: 'IQVIA · Eli Lilly', companyTr: 'IQVIA · Eli Lilly',
    detailEn: '', detailTr: '',
    bullets: [
      { en: 'GCP compliance · Regulatory documentation · Investigator communication', tr: 'GCP uyumu · Düzenleyici belgeleme · Araştırmacı iletişimi' },
    ],
  },
  {
    num: '07', period: '2018–2020',
    roleEn: 'Senior Site Coordinator & Educator',
    roleTr: 'Kıdemli Merkez Koordinatörü & Eğitici',
    companyEn: 'IQVIA', companyTr: 'IQVIA',
    detailEn: 'Egypt & Türkiye', detailTr: 'Mısır & Türkiye',
    bullets: [
      { en: 'Oncology, gastroenterology, CNS studies', tr: 'Onkoloji, gastroenteroloji, MSS çalışmaları' },
      { en: 'Team of 15 site coordinators supervised & trained', tr: '15 merkez koordinatörü ekibi denetlendi ve eğitildi' },
    ],
  },
]

const SKILLS = [
  { labelEn: 'Clinical Systems', labelTr: 'Klinik Sistemler', values: ['Medidata', 'Veeva', 'Oracle', 'ALMAC', 'eTMF', 'CTMS'] },
  { labelEn: 'Frameworks',       labelTr: 'Metodolojiler',   values: ['Agile/Scrum', 'ICH-GCP', 'GMP/GDP', 'RBQM', 'QA'] },
  { labelEn: 'Project Tools',    labelTr: 'Proje Araçları',  values: ['MS Project', 'MS Office Suite', 'Confluence', 'Jira'] },
  { labelEn: 'Digital & AI',     labelTr: 'Dijital & YZ',    values: ['n8n', 'Claude API', 'AI-assisted analysis'] },
]

const CERTS = [
  { en: 'ICH-GCP E6(R2) Certified',         tr: 'ICH-GCP E6(R2) Sertifikalı' },
  { en: 'IAOCR CRA Accreditation — 2025',   tr: 'IAOCR KAU Akreditasyonu — 2025' },
  { en: 'PMP Certification — In Progress',  tr: 'PMP Sertifikası — Devam Ediyor' },
  { en: 'AI in Working Life — 2024',        tr: 'İş Yaşamında Yapay Zeka — 2024' },
]

// ─── Styles ──────────────────────────────────────────────────────────────────

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)' }
const ease = 'easeOut' as const
const vp   = { once: true, margin: '-40px' }
const slide = (i = 0) => ({
  initial:     { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    vp,
  transition:  { duration: 0.55, delay: i * 0.07, ease },
})

function Tag({ children }: { children: string }) {
  const [h, setH] = useState(false)
  return (
    <span
      onMouseEnter={() => { setH(true); audio.hover(550) }}
      onMouseLeave={() => setH(false)}
      style={{
        ...MONO, fontSize: '0.62rem', padding: '2px 9px',
        color:   h ? 'var(--color-teal)'   : 'var(--color-muted)',
        border:  `1px solid ${h ? 'rgba(74,154,184,0.5)' : 'rgba(74,154,184,0.15)'}`,
        letterSpacing: '0.08em', transition: 'color 0.2s, border-color 0.2s', cursor: 'default',
      }}
    >
      {children}
    </span>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function ClinicalContent() {
  const router = useRouter()
  const { t }  = useLang()
  const { switchMode, mode } = useAudio()

  useEffect(() => { switchMode('signal') }, [switchMode])

  const modeLabel = mode === 'bio' ? 'BIO' : mode === 'signal' ? 'SIGNAL' : 'DRIFT'

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      {/* 3D lab background */}
      <LabScene />

      {/* ─── Top bar ───────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 40,
        height: '3.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.5rem',
        background: 'rgba(10,12,10,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(74,154,184,0.12)',
      }}>
        <button
          onClick={() => { audio.navigate(); router.push('/') }}
          onMouseEnter={() => audio.hover()}
          style={{ ...MONO, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '0.72rem', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          ← {t('back', 'geri')}
        </button>
        <p style={{ ...MONO, color: 'rgba(74,154,184,0.8)', fontSize: '0.62rem', letterSpacing: '0.2em' }}>
          {t('CLINICAL RESEARCH PROFESSIONAL', 'KLİNİK ARAŞTIRMA UZMANI')}
        </p>
        <p style={{ ...MONO, color: 'var(--color-border)', fontSize: '0.58rem', letterSpacing: '0.12em' }}>
          ⬤ MODE_{modeLabel}
        </p>
      </div>

      {/* ─── Content ───────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10, paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_320px] gap-12 lg:gap-16">

            {/* ── Left: Timeline ────────────────────────────────────────── */}
            <div>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                style={{ ...MONO, fontSize: '0.65rem', color: 'var(--color-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2.5rem' }}
              >
                {t('Experience', 'Deneyim')}
              </motion.p>

              {/* Timeline */}
              <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
                {/* Vertical line */}
                <div style={{ position: 'absolute', left: '0.6rem', top: 0, bottom: 0, width: '1px', background: 'rgba(74,154,184,0.25)' }} />

                {TIMELINE.map((entry, i) => {
                  const [hov, setHov] = useState(false)
                  return (
                    <motion.div
                      key={entry.num}
                      {...slide(i)}
                      onMouseEnter={() => { setHov(true); audio.hover(550 + i * 20) }}
                      onMouseLeave={() => setHov(false)}
                      style={{ position: 'relative', marginBottom: '2.25rem', paddingBottom: '0.25rem' }}
                    >
                      {/* Dot on timeline */}
                      <div style={{
                        position: 'absolute', left: '-2.15rem', top: '0.55rem',
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: hov ? 'var(--color-teal)' : 'rgba(74,154,184,0.4)',
                        transition: 'background 0.2s',
                        boxShadow:  hov ? '0 0 8px var(--color-teal)' : 'none',
                      }} />

                      {/* Period badge */}
                      <p style={{ ...MONO, fontSize: '0.62rem', color: 'var(--color-border)', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
                        {entry.period}
                      </p>

                      <h3 style={{
                        fontFamily: 'var(--font-serif)', fontWeight: 300,
                        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                        color: hov ? 'var(--color-white)' : 'rgba(240,242,238,0.85)',
                        lineHeight: 1.25, marginBottom: '0.3rem',
                        transition: 'color 0.2s',
                      }}>
                        {t(entry.roleEn, entry.roleTr)}
                      </h3>

                      <p style={{ ...MONO, fontSize: '0.72rem', color: hov ? 'var(--color-teal)' : 'rgba(74,154,184,0.6)', letterSpacing: '0.06em', marginBottom: '0.65rem', transition: 'color 0.2s' }}>
                        {t(entry.companyEn, entry.companyTr)}
                        {(t(entry.detailEn, entry.detailTr)) && (
                          <span style={{ color: 'var(--color-muted)', marginLeft: '0.4rem' }}>
                            · {t(entry.detailEn, entry.detailTr)}
                          </span>
                        )}
                      </p>

                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {entry.bullets.map((b, bi) => (
                          <li key={bi} style={{ display: 'flex', gap: '0.6rem', alignItems: 'start', ...MONO, fontSize: '0.75rem', color: 'var(--color-muted)', lineHeight: 1.65 }}>
                            <span style={{ color: 'rgba(74,154,184,0.4)', flexShrink: 0, marginTop: '0.35em' }}>—</span>
                            {t(b.en, b.tr)}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )
                })}
              </div>

              {/* Featured project */}
              <motion.div
                {...slide()}
                style={{
                  marginTop: '3rem', padding: '1.25rem',
                  background: 'rgba(10,12,10,0.8)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(74,154,184,0.2)',
                }}
              >
                <p style={{ ...MONO, fontSize: '0.6rem', color: 'rgba(74,154,184,0.7)', letterSpacing: '0.18em', marginBottom: '0.6rem' }}>
                  // FEATURED PROJECT
                </p>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--color-white)', marginBottom: '0.4rem' }}>
                  Genomic Gap
                </h3>
                <p style={{ ...MONO, fontSize: '0.68rem', color: 'rgba(74,154,184,0.7)', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                  UNESCO AI Ethics Residency
                </p>
                <p style={{ ...MONO, fontSize: '0.75rem', color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
                  {t(
                    'Visualizing the systematic underrepresentation of non-Western populations in global clinical trial genomic data.',
                    'Küresel klinik araştırma genomik verilerinde Batı dışı popülasyonların sistematik eksik temsilini görselleştirme.',
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['AI ETHICS', 'DATA VISUALIZATION', 'UNESCO', 'p5.js'].map(tag => <Tag key={tag}>{tag}</Tag>)}
                </div>
              </motion.div>

              {/* Bottom CTAs */}
              <motion.div {...slide()} style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <a
                  href="/cv.pdf"
                  style={{ ...MONO, fontSize: '0.75rem', color: 'var(--color-muted)', letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => { audio.hover(660); e.currentTarget.style.color = 'var(--color-teal)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)' }}
                >
                  {t('Download CV →', 'CV İndir →')}
                </a>
                <a
                  href="/contact"
                  onClick={() => audio.navigate()}
                  style={{ ...MONO, fontSize: '0.75rem', color: 'var(--color-muted)', letterSpacing: '0.1em', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => { audio.hover(550); e.currentTarget.style.color = 'var(--color-teal)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)' }}
                >
                  {t('Get in touch →', 'İletişime geç →')}
                </a>
              </motion.div>
            </div>

            {/* ── Right: Skills + meta ────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

              {/* Skills */}
              <motion.div {...slide()}>
                <p style={{ ...MONO, fontSize: '0.65rem', color: 'var(--color-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  {t('Skills & Tools', 'Beceriler & Araçlar')}
                </p>
                {SKILLS.map(s => (
                  <div key={s.labelEn} style={{ marginBottom: '1.1rem' }}>
                    <p style={{ ...MONO, fontSize: '0.6rem', color: 'var(--color-border)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {t(s.labelEn, s.labelTr)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.values.map(v => <Tag key={v}>{v}</Tag>)}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Certifications */}
              <motion.div {...slide()}>
                <p style={{ ...MONO, fontSize: '0.65rem', color: 'var(--color-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  {t('Certifications', 'Sertifikalar')}
                </p>
                <div className="flex flex-col gap-2">
                  {CERTS.map(c => (
                    <p key={c.en} style={{ ...MONO, fontSize: '0.72rem', color: 'var(--color-muted)', lineHeight: 1.5 }}>
                      {t(c.en, c.tr)}
                    </p>
                  ))}
                </div>
              </motion.div>

              {/* Education */}
              <motion.div {...slide()}>
                <p style={{ ...MONO, fontSize: '0.65rem', color: 'var(--color-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  {t('Education', 'Eğitim')}
                </p>
                {[
                  { deg: 'MSc Genetics', detail_en: 'Evolutionary Biology · 2016–2018', detail_tr: 'Evrimsel Biyoloji · 2016–2018' },
                  { deg: 'BSc Biology',  detail_en: '2010–2016',                       detail_tr: '2010–2016' },
                ].map(e => (
                  <div key={e.deg} style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-white)', fontWeight: 300, fontSize: '1rem' }}>
                      {e.deg}
                    </span>
                    <span style={{ ...MONO, color: 'var(--color-muted)', fontSize: '0.7rem', marginLeft: '0.75rem' }}>
                      {t(e.detail_en, e.detail_tr)}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Affiliations */}
              <motion.div {...slide()}>
                <p style={{ ...MONO, fontSize: '0.65rem', color: 'var(--color-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                  {t('Affiliations', 'Üyelikler')}
                </p>
                {[
                  { org: 'TSCA', role_en: 'Founding Member & Former VP', role_tr: 'Kurucu Üye & Eski Başkan Yardımcısı' },
                  { org: 'ACRP', role_en: 'Member',                      role_tr: 'Üye' },
                ].map(a => (
                  <div key={a.org} style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-white)', fontWeight: 300, fontSize: '1rem' }}>{a.org}</p>
                    <p style={{ ...MONO, color: 'var(--color-muted)', fontSize: '0.7rem' }}>{t(a.role_en, a.role_tr)}</p>
                  </div>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
