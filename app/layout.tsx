import type { Metadata } from 'next'
import { Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/app/context/LanguageContext'
import { AudioProvider } from '@/app/context/AudioContext'
import { AudioPanel } from '@/app/components/AudioPanel'
import { ClientShell } from '@/app/components/ClientShell'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Müjgan Armağan Türközü — mujganar.studio',
  description: 'Senior Clinical Research Associate · VJ Artist · Creative Technologist based in Istanbul.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${cormorant.variable} ${jetbrains.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <AudioProvider>
            <ClientShell>{children}</ClientShell>
            <AudioPanel />
          </AudioProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
