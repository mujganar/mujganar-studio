class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private ambientPlaying = false
  private ambientNodes: AudioNode[] = []
  private ambientFilter: BiquadFilterNode | null = null

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

  startAmbient() {
    if (!this.ctx || !this.masterGain || this.ambientPlaying) return
    this.resume()
    this.ambientPlaying = true

    const ctx = this.ctx
    const now = ctx.currentTime

    // Layer 1: sub-bass breath 55Hz
    const osc1 = ctx.createOscillator()
    const g1   = ctx.createGain()
    osc1.type      = 'sine'
    osc1.frequency.value = 55
    g1.gain.value  = 0.5
    osc1.connect(g1)
    g1.connect(this.masterGain)
    osc1.start(now)

    // Layer 2: 110Hz with detune + LFO on gain
    const osc2 = ctx.createOscillator()
    const g2   = ctx.createGain()
    osc2.type      = 'sine'
    osc2.frequency.value = 110
    osc2.detune.value    = 2
    g2.gain.value  = 0.5
    const lfo = ctx.createOscillator()
    const lfoG = ctx.createGain()
    lfo.frequency.value = 1 / 8  // 8s period
    lfoG.gain.value = 0.2        // swings gain ±0.2 around 0.5
    lfo.connect(lfoG)
    lfoG.connect(g2.gain)
    osc2.connect(g2)
    g2.connect(this.masterGain)
    lfo.start(now)
    osc2.start(now)

    // Layer 3: high shimmer 880Hz with slow frequency drift
    const osc3 = ctx.createOscillator()
    const g3   = ctx.createGain()
    osc3.type      = 'sine'
    osc3.frequency.value = 880
    g3.gain.value  = 0.03
    osc3.connect(g3)
    g3.connect(this.masterGain)
    osc3.start(now)
    // Drift: schedule small frequency changes
    const driftInterval = setInterval(() => {
      if (!this.ambientPlaying || !this.ctx) { clearInterval(driftInterval); return }
      const drift = 880 + (Math.random() - 0.5) * 40
      osc3.frequency.linearRampToValueAtTime(drift, this.ctx.currentTime + 4)
    }, 4000)

    // Layer 4: white noise through bandpass at 200Hz
    const bufLen = ctx.sampleRate * 2
    const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate)
    const data   = buf.getChannelData(0)
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1
    const noise  = ctx.createBufferSource()
    noise.buffer = buf
    noise.loop   = true
    const bp     = ctx.createBiquadFilter()
    bp.type      = 'bandpass'
    bp.frequency.value = 200
    bp.Q.value   = 0.8
    const g4     = ctx.createGain()
    g4.gain.value = 0.015
    noise.connect(bp)
    bp.connect(g4)
    g4.connect(this.masterGain)
    noise.start(now)

    this.ambientFilter = bp
    this.ambientNodes  = [osc1, osc2, osc3, lfo, noise, g1, g2, g3, g4, lfoG]

    // Fade in gently
    this.masterGain.gain.setValueAtTime(0, now)
    this.masterGain.gain.linearRampToValueAtTime(0.3, now + 2)
  }

  stopAmbient() {
    if (!this.ctx || !this.masterGain || !this.ambientPlaying) return
    const now = this.ctx.currentTime
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
    this.masterGain.gain.linearRampToValueAtTime(0, now + 1.5)
    const nodes = this.ambientNodes.slice()
    setTimeout(() => {
      nodes.forEach(n => { try { (n as OscillatorNode | AudioBufferSourceNode).stop?.() } catch {} })
      if (this.masterGain) this.masterGain.gain.value = 0.3
    }, 1600)
    this.ambientPlaying = false
    this.ambientNodes   = []
    this.ambientFilter  = null
  }

  toggleAmbient() {
    this.ambientPlaying ? this.stopAmbient() : this.startAmbient()
  }

  get isAmbientOn() { return this.ambientPlaying }

  // Shift ambient filter to feel warmer (creative) or cooler (clinical)
  shiftAmbient(mode: 'warm' | 'cool') {
    if (!this.ambientFilter || !this.ctx) return
    const target = mode === 'warm' ? 300 : 150
    this.ambientFilter.frequency.linearRampToValueAtTime(target, this.ctx.currentTime + 1.5)
  }

  // Subtle pitch shift of ambient layer for hero cross-divider
  pitchShift(side: 'left' | 'right') {
    // No-op for ambient: the side-reactive particle shader handles visuals;
    // keeping audio engine clean — hero wires this to hover() pitch variation instead
    void side
  }

  private tone(freq: number, duration: number, gain: number, type: OscillatorType = 'sine', delay = 0) {
    if (!this.ctx || !this.masterGain) return
    this.resume()
    const ctx = this.ctx
    const now = ctx.currentTime + delay
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.type           = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(gain, now + 0.005)
    g.gain.setValueAtTime(gain, now + duration - 0.01)
    g.gain.linearRampToValueAtTime(0, now + duration)
    osc.connect(g)
    g.connect(this.masterGain)
    osc.start(now)
    osc.stop(now + duration + 0.01)
  }

  hover(freq = 440) {
    this.tone(freq, 0.08, 0.04)
  }

  click() {
    this.tone(660, 0.02, 0.08)
    this.tone(880, 0.03, 0.08, 'sine', 0.02)
  }

  navigate() {
    if (!this.ctx || !this.masterGain) return
    this.resume()
    const ctx = this.ctx
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.type           = 'sine'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.linearRampToValueAtTime(220, now + 0.2)
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.06, now + 0.005)
    g.gain.linearRampToValueAtTime(0, now + 0.2)
    osc.connect(g)
    g.connect(this.masterGain)
    osc.start(now)
    osc.stop(now + 0.21)
  }

  success() {
    [440, 550, 660].forEach((freq, i) => this.tone(freq, 0.12, 0.05, 'sine', i * 0.08))
  }

  error() {
    this.tone(220, 0.15, 0.05)
    this.tone(233, 0.15, 0.05)
  }
}

export const audio = new AudioEngine()
