'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/app/context/LanguageContext'

const vp = { once: true, margin: '-80px' }
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: vp,
  transition: { duration: 0.8, delay, ease: 'easeOut' as const },
})

interface CardProps {
  side: 'clinical' | 'creative'
  title: string
  subtitle: string
  accent: string
  items: { label: string; values: string[] }[]
}

function Card({ side, title, subtitle, accent, items }: CardProps) {
  const borderColor = side === 'clinical' ? 'var(--color-teal)' : 'var(--color-green-dim)'

  return (
    <motion.div
      {...reveal(side === 'clinical' ? 0.1 : 0.25)}
      className="flex-1 p-8 flex flex-col gap-6 transition-all duration-500"
      style={{
        border: '1px solid var(--color-border)',
        minWidth: 0,
      }}
      whileHover={{ borderColor, transition: { duration: 0.3 } }}
    >
      {/* Header */}
      <div>
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ fontFamily: 'var(--font-mono)', color: accent, letterSpacing: '0.18em' }}
        >
          {subtitle}
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 300,
            color: 'var(--color-white)',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

      {/* Data rows */}
      <div className="flex flex-col gap-4">
        {items.map(item => (
          <div key={item.label}>
            <p
              className="text-xs uppercase tracking-widest mb-1.5"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', letterSpacing: '0.15em' }}
            >
              {item.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.values.map(v => (
                <span
                  key={v}
                  className="text-xs px-2 py-0.5"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-muted)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function DualIdentity() {
  const { t } = useLang()

  const clinicalItems = [
    {
      label: t('Therapeutic Areas', 'Terapötik Alanlar'),
      values: [t('Oncology', 'Onkoloji'), t('Cardiovascular', 'Kardiyovasküler'), t('Ophthalmology', 'Oftalmoloji')],
    },
    {
      label: t('CROs & Sponsors', 'CRO\'lar & Sponsorlar'),
      values: ['Parexel', 'Fortrea', 'IQVIA', 'ICON', 'AstraZeneca', 'MSD', 'Eli Lilly', 'Janssen'],
    },
    {
      label: t('Education', 'Eğitim'),
      values: [t('BSc Biology', 'Lisans Biyoloji'), t('MSc Genetics', 'Yüksek Lisans Genetik')],
    },
    {
      label: t('Role', 'Görev'),
      values: [t('Senior CRA', 'Kıdemli KAU'), 'TSCA ' + t('Founding Member', 'Kurucu Üye')],
    },
  ]

  const creativeItems = [
    {
      label: t('Tools', 'Araçlar'),
      values: ['TouchDesigner', 'Unreal Engine 5', 'p5.js', 'GLSL / ISF', 'Three.js', 'MediaPipe'],
    },
    {
      label: t('Event Types', 'Etkinlik Türleri'),
      values: [
        t('Stadium Concerts', 'Stadyum Konserleri'),
        t('Electronic Festivals', 'Elektronik Festivaller'),
        t('Jazz Gatherings', 'Caz Etkinlikleri'),
        'Sónar',
      ],
    },
    {
      label: t('Capabilities', 'Uzmanlık'),
      values: [
        t('VJ Performance', 'VJ Performansı'),
        t('Stage Design', 'Sahne Tasarımı'),
        t('Experience Design', 'Deneyim Tasarımı'),
        t('Event Production', 'Etkinlik Prodüksiyonu'),
      ],
    },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section label */}
        <motion.p
          {...reveal()}
          className="text-xs uppercase tracking-widest mb-12"
          style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', letterSpacing: '0.2em' }}
        >
          {t('The Dual Practice', 'İkili Pratik')}
        </motion.p>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-px" style={{ background: 'var(--color-border)' }}>
          <Card
            side="clinical"
            title={t('Clinical Research Professional', 'Klinik Araştırma Uzmanı')}
            subtitle={t('8+ Years Experience', '8+ Yıl Deneyim')}
            accent="var(--color-teal)"
            items={clinicalItems}
          />
          <Card
            side="creative"
            title={t('Creative Technologist & VJ Artist', 'Yaratıcı Teknolog & VJ Sanatçısı')}
            subtitle={t('Generative · Real-time · Immersive', 'Üretken · Gerçek Zamanlı · Sürükleyici')}
            accent="var(--color-green)"
            items={creativeItems}
          />
        </div>
      </div>
    </section>
  )
}
