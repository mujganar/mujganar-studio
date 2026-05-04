import Hero          from '@/app/components/Hero'
import DualIdentity  from '@/app/components/DualIdentity'
import SelectedWork  from '@/app/components/SelectedWork'
import Venues        from '@/app/components/Venues'
import ContactStrip  from '@/app/components/ContactStrip'

export default function Home() {
  return (
    <>
      <Hero />
      <DualIdentity />
      <SelectedWork />
      <Venues />
      <ContactStrip />
    </>
  )
}
