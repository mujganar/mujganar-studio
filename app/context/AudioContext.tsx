'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { audio, type AmbientMode } from '@/lib/audio'
export type { AmbientMode } from '@/lib/audio'

interface AudioState {
  playing:     boolean
  mode:        AmbientMode
  initialized: boolean
  toggle:      () => void
  setMode:     (m: AmbientMode) => void
}

const Ctx = createContext<AudioState>({
  playing: false, mode: 'bio', initialized: false,
  toggle: () => {}, setMode: () => {},
})

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [playing,     setPlaying]     = useState(false)
  const [mode,        setModeState]   = useState<AmbientMode>('bio')
  const [initialized, setInitialized] = useState(false)

  const init = useCallback(() => {
    if (initialized) return
    audio.init()
    audio.startAmbient('bio')
    setPlaying(true)
    setInitialized(true)
  }, [initialized])

  useEffect(() => {
    window.addEventListener('click',    init, { once: true })
    window.addEventListener('touchend', init, { once: true })
    return () => {
      window.removeEventListener('click',    init)
      window.removeEventListener('touchend', init)
    }
  }, [init])

  const toggle = useCallback(() => {
    if (!initialized) { init(); return }
    audio.toggleAmbient()
    setPlaying(audio.isAmbientOn)
  }, [initialized, init])

  const setMode = useCallback((m: AmbientMode) => {
    setModeState(m)
    if (!initialized) {
      audio.init()
      setInitialized(true)
      audio.startAmbient(m)
      setPlaying(true)
      return
    }
    audio.switchMode(m)
    if (!audio.isAmbientOn) {
      audio.startAmbient(m)
      setPlaying(true)
    }
  }, [initialized])

  return (
    <Ctx.Provider value={{ playing, mode, initialized, toggle, setMode }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAudio = () => useContext(Ctx)
