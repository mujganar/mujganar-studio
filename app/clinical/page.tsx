import { Suspense } from 'react'
import ClinicalContent from './ClinicalContent'

export const metadata = {
  title: 'Clinical Research Professional — mujganar.studio',
  description: 'Clinical research timeline, skills and experience of Müjgan Armağan Türközü.',
}

export default function ClinicalPage() {
  return (
    <Suspense fallback={null}>
      <ClinicalContent />
    </Suspense>
  )
}
