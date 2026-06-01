import { Suspense } from 'react'
import AboutContent from './AboutContent'

export const metadata = {
  title: 'About — mujganar.studio',
  description: 'Müjgan Armağan Türközü — Creative Technologist and Clinical Research Professional based in Istanbul.',
}

export default function AboutPage() {
  return (
    <Suspense fallback={null}>
      <AboutContent />
    </Suspense>
  )
}
