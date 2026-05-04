import { Suspense } from 'react'
import WorkContent from './WorkContent'

export const metadata = {
  title: 'Work — mujganar.studio',
  description: 'Clinical research experience and creative VJ performances by Müjgan Armağan Türközü.',
}

export default function WorkPage() {
  return (
    <Suspense fallback={null}>
      <WorkContent />
    </Suspense>
  )
}
