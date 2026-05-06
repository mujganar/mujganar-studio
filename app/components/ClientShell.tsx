'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'

const BARE_PATHS = ['/creative', '/clinical']

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = BARE_PATHS.includes(pathname)
  return (
    <>
      {!bare && <Navbar />}
      <main className={bare ? 'flex-1' : 'flex-1 pt-14'}>{children}</main>
    </>
  )
}
