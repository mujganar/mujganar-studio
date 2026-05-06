import { Suspense } from 'react'
import CreativeContent from './CreativeContent'

export const metadata = {
  title: 'Creative Technologist — mujganar.studio',
  description: 'VJ performances, stage design, experience design and visual production by Müjgan Armağan Türközü.',
}

export default function CreativePage() {
  return (
    <Suspense fallback={null}>
      <CreativeContent />
    </Suspense>
  )
}
