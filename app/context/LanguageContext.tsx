'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'en' | 'tr'

interface LanguageContextValue {
  lang: Lang
  toggle: () => void
  t: (en: string, tr: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const toggle = () => setLang(l => (l === 'en' ? 'tr' : 'en'))
  const t = (en: string, tr: string) => (lang === 'en' ? en : tr)

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
