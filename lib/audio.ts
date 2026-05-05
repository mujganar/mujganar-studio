export type AmbientMode = 'bio' | 'signal' | 'drift'

interface AmbientLayer {
  stopFns: (() => void)[]
  gain: GainNode
}

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private _playing = false
  private _mode: AmbientMode = 'bio'
  private activeLayer: AmbientLayer | null = null
  private _bioFilter: BiquadFilterNode | null = null

  init() {
    if (this.ctx) return
    this.ctx = new AudioContext()
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.3
    this.masterGain.connect(this.ctx.destination)
  }

  private resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume()
  }

  private osc(freq: number, type: OscillatorType = 'sine', detune = 0): OscillatorNode {
    const o = this.ctx!.createOscillator()
    o.type = type
    o.frequency.value = freq
    o.detune.value = detune
    return o
  }

  private createLayer(mode: AmbientMode): AmbientLayer {
    const ctx = this.ctx!
    const now = ctx.currentTime
    const layerGain = ctx.createGain()
    layerGain.gain.value = 0
    layerGain.connect(this.masterGain!)

    const alive = { v: true }
    const stopFns: (() => void)[] = [() => { alive.v = false }]

    const stopO = (o: OscillatorNode | AudioBufferSourceNode) => {
      try { (o as OscillatorNode).stop() } catch {}
    }

    if (mode === 'bio') {
      // 55Hz sub-bass breath
      const o1 = this.osc(55)
      const g1 = ctx.createGain(); g1.gain.value = 0.5
      o1.connect(g1); g1.connect(layerGain); o1.start(now)
      stopFns.push(() => stopO(o1))

      // 110Hz + LFO gain swing (0.3–0.7, 8s)
      const o2 = this.osc(110, 'sine', 2)
      const g2 = ctx.createGain(); g2.gain.value = 0.5
      const lfo = ctx.createOscillator(); lfo.frequency.value = 1 / 8
      const lfoG = ctx.createGain(); lfoG.gain.value = 0.2
      lfo.connect(lfoG); lfoG.connect(g2.gain)
      o2.connect(g2); g2.connect(layerGain)
      lfo.start(now); o2.start(now)
      stopFns.push(() => { stopO(o2); stopO(lfo) })

      // 880Hz shimmer with slow freq drift
      const o3 = this.osc(880)
      const g3 = ctx.createGain(); g3.gain.value = 0.03
      o3.connect(g3); g3.connect(layerGain); o3.start(now)
      const scheduleDrift = () => setTimeout(() => {
        if (!alive.v || !this.ctx) return
        o3.frequency.linearRampToValueAtTime(880 + (Math.random() - 0.5) * 40, this.ctx.currentTime + 4)
        scheduleDrift()
      }, 4000)
      scheduleDrift()
      stopFns.push(() => stopO(o3))

      // White noise → bandpass 200Hz
      const bufLen = ctx.sampleRate * 2
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1
      const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'; bp.frequency.value = 200; bp.Q.value = 0.8
      const g4 = ctx.createGain(); g4.gain.value = 0.015
      noise.connect(bp); bp.connect(g4); g4.connect(layerGain); noise.start(now)
      this._bioFilter = bp
      stopFns.push(() => { stopO(noise); this._bioFilter = null })

    } else if (mode === 'signal') {
      // 220Hz clean sine
      const o1 = this.osc(220)
      const g1 = ctx.createGain(); g1.gain.value = 0.3
      o1.connect(g1); g1.connect(layerGain); o1.start(now)
      stopFns.push(() => stopO(o1))

      // 880Hz overtone shimmer
      const o2 = this.osc(880)
      const g2 = ctx.createGain(); g2.gain.value = 0.01
      o2.connect(g2); g2.connect(layerGain); o2.start(now)
      stopFns.push(() => stopO(o2))

      // Clinical ping every 4.5s
      const schedulePing = () => setTimeout(() => {
        if (!alive.v || !this.ctx) return
        const t = this.ctx.currentTime
        const po = this.ctx.createOscillator()
        const pg = this.ctx.createGain()
        po.frequency.value = 1320; po.type = 'sine'
        pg.gain.setValueAtTime(0, t)
        pg.gain.linearRampToValueAtTime(0.08, t + 0.005)
        pg.gain.linearRampToValueAtTime(0, t + 0.03)
        po.connect(pg); pg.connect(layerGain)
        po.start(t); po.stop(t + 0.04)
        schedulePing()
      }, 4500)
      schedulePing()

    } else if (mode === 'drift') {
      // Two detuned oscs — 110Hz + 113Hz beating
      const o1 = this.osc(110)
      const g1 = ctx.createGain(); g1.gain.value = 0.35
      o1.connect(g1); g1.connect(layerGain); o1.start(now)
      stopFns.push(() => stopO(o1))

      const o2 = this.osc(113)
      const g2 = ctx.createGain(); g2.gain.value = 0.35
      o2.connect(g2); g2.connect(layerGain); o2.start(now)
      stopFns.push(() => stopO(o2))

      // LFO on o1 with variable rate changes
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.1 + Math.random() * 0.3
      const lfoG = ctx.createGain(); lfoG.gain.value = 0.15
      lfo.connect(lfoG); lfoG.connect(g1.gain); lfo.start(now)
      stopFns.push(() => stopO(lfo))
      const scheduleLFO = () => setTimeout(() => {
        if (!alive.v || !this.ctx) return
        lfo.frequency.setValueAtTime(0.05 + Math.random() * 0.5, this.ctx.currentTime)
        scheduleLFO()
      }, 3000 + Math.random() * 4000)
      scheduleLFO()

      // Occasional 440Hz ghost tone
      const scheduleGhost = () => setTimeout(() => {
        if (!alive.v || !this.ctx) return
        const t = this.ctx.currentTime
        const go = this.ctx.createOscillator()
        const gg = this.ctx.createGain()
        go.frequency.value = 440
        gg.gain.setValueAtTime(0, t)
        gg.gain.linearRampToValueAtTime(0.02, t + 0.5)
        gg.gain.linearRampToValueAtTime(0, t + 2)
        go.connect(gg); gg.connect(layerGain)
        go.start(t); go.stop(t + 2.1)
        scheduleGhost()
      }, 3000 + Math.random() * 8000)
      scheduleGhost()
    }

    return { stopFns, gain: layerGain }
  }

  startAmbient(mode: AmbientMode = 'bio') {
    if (!this.ctx || !this.masterGain) return
    if (this._playing) { this.switchMode(mode); return }
    this.resume()
    this._playing = true
    this._mode = mode
    const layer = this.createLayer(mode)
    this.activeLayer = layer
    layer.gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 2)
  }

  stopAmbient() {
    if (!this.ctx || !this._playing) return
    this._playing = false
    const layer = this.activeLayer
    this.activeLayer = null
    if (!layer) return
    const now = this.ctx.currentTime
    layer.gain.gain.setValueAtTime(layer.gain.gain.value, now)
    layer.gain.gain.linearRampToValueAtTime(0, now + 1.5)
    setTimeout(() => layer.stopFns.forEach(fn => fn()), 1600)
  }

  toggleAmbient() {
    this._playing ? this.stopAmbient() : this.startAmbient(this._mode)
  }

  switchMode(mode: AmbientMode) {
    if (!this.ctx) return
    this._mode = mode
    if (!this._playing) return
    const oldLayer = this.activeLayer
    const newLayer = this.createLayer(mode)
    this.activeLayer = newLayer
    const now = this.ctx.currentTime
    newLayer.gain.gain.linearRampToValueAtTime(1, now + 2)
    if (oldLayer) {
      oldLayer.gain.gain.setValueAtTime(oldLayer.gain.gain.value, now)
      oldLayer.gain.gain.linearRampToValueAtTime(0, now + 2)
      setTimeout(() => oldLayer.stopFns.forEach(fn => fn()), 2100)
    }
  }

  get isAmbientOn() { return this._playing }
  get currentMode()  { return this._mode }

  // Legacy: shift BIO mode bandpass (called by WorkContent tab switch)
  shiftAmbient(variant: 'warm' | 'cool') {
    if (!this._bioFilter || !this.ctx) return
    const target = variant === 'warm' ? 300 : 150
    this._bioFilter.frequency.linearRampToValueAtTime(target, this.ctx.currentTime + 1.5)
  }

  // ─── UI sounds ───────────────────────────────────────────────────────────────

  private resume_() {
    if (this.ctx?.state === 'suspended') this.ctx.resume()
  }

  private tone(freq: number, dur: number, gain: number, type: OscillatorType = 'sine', delay = 0) {
    if (!this.ctx || !this.masterGain) return
    this.resume_()
    const ctx = this.ctx
    const t = ctx.currentTime + delay
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(gain, t + 0.005)
    g.gain.setValueAtTime(gain, t + dur - 0.01)
    g.gain.linearRampToValueAtTime(0, t + dur)
    o.connect(g); g.connect(this.masterGain)
    o.start(t); o.stop(t + dur + 0.01)
  }

  hover(freq = 440)  { this.tone(freq, 0.08, 0.04) }

  click() {
    this.tone(660, 0.02, 0.08)
    this.tone(880, 0.03, 0.08, 'sine', 0.02)
  }

  navigate() {
    if (!this.ctx || !this.masterGain) return
    this.resume_()
    const ctx = this.ctx
    const t = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(440, t)
    o.frequency.linearRampToValueAtTime(220, t + 0.2)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.06, t + 0.005)
    g.gain.linearRampToValueAtTime(0, t + 0.2)
    o.connect(g); g.connect(this.masterGain)
    o.start(t); o.stop(t + 0.21)
  }

  success() {
    [440, 550, 660].forEach((f, i) => this.tone(f, 0.12, 0.05, 'sine', i * 0.08))
  }

  error() {
    this.tone(220, 0.15, 0.05)
    this.tone(233, 0.15, 0.05)
  }
}

export const audio = new AudioEngine()
