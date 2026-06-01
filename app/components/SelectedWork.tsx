'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLang } from '@/app/context/LanguageContext'

const vp = { once: true, margin: '-60px' }

interface Project {
  num: string
  titleEn: string
  titleTr: string
  descEn: string
  descTr: string
  tags: string[]
  href: string
}

const PROJECTS: Project[] = [
  {
    num: '01',
    titleEn: 'Kenan Doğulu Live',
    titleTr: 'Kenan Doğulu Canlı',
    descEn: 'Camera-reactive VJ performances for large-scale stadium shows. Real-time generative visuals driven by live camera input — Volkswagen Arena and Harbiye Cemil Topuzlu open-air stage.',
    descTr: 'Büyük ölçekli stadyum gösterileri için kamera reaktif VJ performansları. Canlı kamera girdisiyle yönlendirilen gerçek zamanlı üretken görseller — Volkswagen Arena ve Harbiye Cemil Topuzlu Açık Hava Sahnesi.',
    tags: ['VJ', 'Stadium', 'Real-time', 'TouchDesigner'],
    href: '/work',
  },
  {
    num: '02',
    titleEn: 'Genomic Gap',
    titleTr: 'Genomik Uçurum',
    descEn: 'UNESCO AI ethics residency. An audiovisual installation visualizing the systematic underrepresentation of non-Western populations in global clinical trial genomic data.',
    descTr: 'UNESCO Yapay Zeka etiği rezidansı. Global klinik araştırma genomik verilerinde Batı dışı popülasyonların sistematik eksik temsilini görselleştiren bir görsel-işitsel enstalasyon.',
    tags: ['Installation', 'Data Art', 'AI Ethics', 'p5.js'],
    href: '/work',
  },
  {
    num: '03',
    titleEn: "Yonca's 90s Express",
    titleTr: '90\'lar Ekspresi',
    descEn: 'Full LED backdrop content design for a live theatrical production — concept to execution, cohesive visual narrative across the complete show lifecycle.',
    descTr: 'Canlı tiyatro prodüksiyonu için tam LED arka plan içerik tasarımı — konseptten uygulamaya, tüm gösteri yaşam döngüsü boyunca bütünlüklü görsel anlatı.',
    tags: ['LED Design', 'Theatre', 'Content Design', 'UE5'],
    href: '/work',
  },
]

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)
  const { t } = useLang()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={vp}
      transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' as const }}
    >
      <Link
        href={project.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group block py-8 transition-colors duration-300"
        style={{ borderTop: '1px solid var(--color-border)' }}
      >
        <div className="flex items-start gap-6 md:gap-10">
          {/* Number */}
          <span
            className="text-xs pt-1 transition-colors duration-300 shrink-0"
            style={{
              fontFamily: 'var(--font-mono)',
              color: hovered ? 'var(--color-green)' : 'var(--color-border)',
              letterSpacing: '0.1em',
              ...(hovered ? { textShadow: '0 0 14px color-mix(in srgb, var(--color-green) 50%, transparent)' } : {}),
            }}
          >
            {project.num}
          </span>

          {/* Body */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontWeight: 300,
                  color: 'var(--color-white)',
                  lineHeight: 1.2,
                }}
              >
                {t(project.titleEn, project.titleTr)}
              </h3>

              {/* Arrow */}
              <span
                className="text-base transition-all duration-300 shrink-0"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: hovered ? 'var(--color-green)' : 'var(--color-border)',
                  transform: hovered ? 'translateX(6px)' : 'translateX(0)',
                  display: 'inline-block',
                }}
              >
                →
              </span>
            </div>

            <p
              className="text-sm mb-4 max-w-2xl"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', lineHeight: 1.75 }}
            >
              {t(project.descEn, project.descTr)}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: hovered ? 'var(--color-muted)' : 'var(--color-border)',
                    border: `1px solid ${hovered ? 'var(--color-border)' : 'color-mix(in srgb, var(--color-border) 50%, transparent)'}`,
                    letterSpacing: '0.08em',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function SelectedWork() {
  const { t } = useLang()

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.7, ease: 'easeOut' as const }}
          className="flex items-center justify-between mb-12"
        >
          <p
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)', letterSpacing: '0.2em' }}
          >
            {t('Selected Work', 'Seçili Projeler')}
          </p>
          <Link
            href="/work"
            className="text-xs uppercase tracking-widest transition-colors duration-200"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-border)', letterSpacing: '0.15em' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-muted)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-border)')}
          >
            {t('All Work →', 'Tüm Projeler →')}
          </Link>
        </motion.div>

        <div>
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.num} project={p} index={i} />
          ))}
          <div style={{ borderTop: '1px solid var(--color-border)' }} />
        </div>
      </div>
    </section>
  )
}
