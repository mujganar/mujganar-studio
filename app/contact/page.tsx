import { Suspense } from 'react'
import ContactStrip from '@/app/components/ContactStrip'

export const metadata = {
  title: 'Contact — mujganar.studio',
  description: 'Get in touch with Müjgan Armağan Türközü.',
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactStrip />
    </Suspense>
  )
}
