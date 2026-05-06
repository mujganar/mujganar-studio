# SESSION 02 — Claude Code Log
**Project:** mujganar.studio (Next.js 15, TypeScript, Tailwind, Framer Motion, Three.js)  
**Session file:** `01697ce8-adb5-45f5-81ea-b8e40fdce4a7.jsonl`  
**Repo:** https://github.com/mujganar/mujganar-studio  
**Commits this session:** 10 (b33f28b → 5a2ad9e)

---

## Context recovered from compaction

This session resumed mid-conversation after context was exhausted. The JSONL transcript was read directly to recover:
1. The last incomplete task (Web Audio system)
2. All prior prompts and decisions

---

## Prompt 1 — Project brief (from Session 01, carried into this session)

> "You are building a personal website for Müjgan Armağan Türközü (mujganar.studio) — a Senior Clinical Research Associate and creative technologist / VJ artist based in Istanbul. Dual identity: clinical precision (8+ years across oncology, cardiovascular, and ophthalmology trials) + creative technologist (VJ, TouchDesigner, UE5, p5.js, GLSL/ISF shaders, generative art, MediaPipe)."

**Decisions from Session 01 (inherited):**
- Next.js 15 App Router, TypeScript, Tailwind CSS
- Fonts: Cormorant Garamond (serif, `--font-serif`) + JetBrains Mono (mono, `--font-mono`)
- Design system: dark green/teal palette on near-black (`#0a0c0a`) surface
- CSS variables: `--color-space`, `--color-surface`, `--color-border`, `--color-white`, `--color-muted`, `--color-green-dim`, `--color-green`, `--color-teal`
- Bilingual TR/EN via `LanguageContext` with `t(en, tr)` helper
- `LanguageProvider` wraps entire app in `layout.tsx`

---

## Prompt 2 — "go ahead and build the hero section"

**Commit:** `2c16aa3` — feat: hero section with Three.js cellular particle system

**Built:**
- `app/components/Hero.tsx` — initial hero with name, subtitle, CTA
- `app/components/HeroParticles.tsx` — Three.js WebGL particle system
  - 220 particles with physics: Brownian drift, mouse repulsion (REPEL_R=0.45), spring-to-home, damping
  - GLSL shader: side-reactive palette tint (`uSide` uniform 0→1), proximity glow near cursor (quadratic falloff, 1.8-unit radius), pulse animation
  - 5-color palette (greens + teals)
  - Dynamic import (`ssr: false`) to avoid SSR issues with Three.js

**Architecture decision:** `HeroParticles` loaded via `next/dynamic` because Three.js uses browser APIs (`WebGLRenderer`, etc.) unavailable during SSR.

---

## Prompt 3 — Label text change

> "change Istanbul · Clinical Research · VJ Artist to Creative Technologist - Clinical Research Professional and go with the rest."

Minor copy update to Hero subtitle. No new components.

---

## Prompt 4 — /work page data correction

> "The /work page content needs to be corrected. Replace all creative and clinical content with the following accurate data..."

**Commit:** `60a1d7f` — feat: /work page — accurate clinical timeline and creative event data

**Built/rewrote:** `app/work/WorkContent.tsx`

Data entered:
- 7 clinical roles (Oculera, Parexel/AstraZeneca, Fortrea/MSD, littlefish, ICON/J&J, IQVIA/Lilly, IQVIA Egypt)
- 3 featured creative productions (Kenan Doğulu, Sónar 2023, Yonca's 90s Express)
- 8 other artist performances (Brina Knauss, Joyhauser, Laolu, Chris Avantgarde, Massano, Zara, ZR Music, Bodrum)
- 5 other events (Sonance, Magic Break, Hope Alcazar, Ankara Piano Festival, Ankara World Music Festival)
- 15 capabilities
- Two-tab layout: Creative / Clinical, tab indicator via Framer Motion `layoutId`
- URL tab persistence: `searchParams.get('tab')`

**Also built in same session:** `app/page.tsx`, `app/components/SelectedWork.tsx`, `app/components/DualIdentity.tsx`, `app/components/Venues.tsx`, `app/components/ContactStrip.tsx`, `app/api/contact/route.ts`

---

## Prompt 5 — Split-screen Hero redesign

> "Redesign the Hero section with a split-screen layout based on this exact design: Full viewport height, split 50/50 vertically (left | right). A thin divider line at center (vertical) and center (horizontal) — forming a cross. Name box sits exactly at the intersection..."

**Commit:** `14ab404` — feat: split-screen hero redesign with side-reactive particle system

**Complete rewrite of `app/components/Hero.tsx`:**

Layout:
- `flex-row` container, `minHeight: calc(100vh - 3.5rem)`
- Left panel → `/creative`, right panel → `/clinical` (later updated to `/creative` and `/clinical`)
- Cross overlay: vertical line (`left: 50%`), horizontal line (`top: 50%`), dot that follows mouse Y position
- Name box: `position: absolute`, centered on intersection, `z-index: 30`, `pointer-events: auto`, stops click propagation

State:
- `hovered: 'left' | 'right' | null` — drives all conditional styles
- `dotY` — mouse Y percentage for the moving dot on the divider
- `glowL`, `glowR` — mouse position within each panel for radial glow

Style helpers:
- `labelStyle(active)` — dark text when active, green when idle
- `tagStyle(side, active)` — tag pill styles per side
- `capStyle(side, active)` — caption text
- `ctaStyle(side, active, hovered)` — CTA text, opacity 0.5 → 1 on hover

**Particle system update (`HeroParticles.tsx`):**
- Added `SIDE_DRIFT` constant — clusters particles toward active side
- `uSide` uniform lerped 0↔1 on mouse cross (0.04 lerp rate)
- Dot on divider line changes color: green (left) / teal (right) / border (neutral) with box-shadow glow

**Tags:** `LEFT_TAGS = ['VJ', 'TouchDesigner', 'UE5', 'p5.js', 'Sónar', 'Kenan Doğulu']` / `RIGHT_TAGS = ['Oncology', 'Parexel', 'ICH-GCP', 'IQVIA', '8+ yrs', 'TSCA VP']`

---

## Prompt 6 — Hero readability fixes

> "Fix the following issues on the Hero split-screen: NAME BOX — bigger and bolder (48px, weight 400, padding 28px 48px, minWidth 520px). TAGS — fully readable (12px, opacity 1, border opacity 0.7). SECTION LABELS — bigger. CTAs always visible (opacity 0.5 base). PARTICLES — more visible..."

**Commit:** `64d030f` — fix: hero readability

Changes:
- Name font: 48px, weight 400
- `minWidth: 'min(520px, 90vw)'`
- Particle brightness boost: `b = 0.52 + Math.random() * 1.05`
- Particle size: large particles 4–10px, regular 1.2–4px
- GLSL: `col += sideTint * proxSharp * 0.5` (stronger glow contribution)
- Tag opacity and border opacity raised

---

## Prompt 7 — Hero text contrast fix

> "Fix text contrast on hero split-screen when cursor moves to a side. When cursor is on LEFT side: label switches to #0a0c0a (dark), tags get dark background rgba(10,12,10,0.6)..."

**Commit:** `c9e8080` — fix: hero text contrast

**Decision:** All text becomes dark (`#0a0c0a`) when the glowing background brightens on hover. Styles are driven by `active` boolean passed to each style helper.

- `labelStyle(active)`: `color: active ? '#0a0c0a' : '#c8ddb8'`
- `tagStyle(side, active)`: `color: active ? '#0a0c0a' : ...`, `background: active ? 'rgba(10,12,10,0.6)' : 'transparent'`
- `capStyle(side, active)`: darker text when active
- `ctaStyle(side, active, hovered)`: green-dark when active

---

## Prompt 8 — Web Audio sound system

> "Add a sound system to the entire site using Web Audio API (no external files needed — all sounds generated procedurally). Create /lib/audio.ts — a singleton AudioEngine class..."

**This was the task in progress when Session 01 context was exhausted. Recovered from JSONL and completed in this session.**

**Commit:** `cfb20a9` — feat: procedural Web Audio sound system

### `lib/audio.ts` (singleton, initial version)

```
AudioEngine {
  init()              // creates AudioContext after user gesture
  startAmbient()      // 4-layer drone
  stopAmbient()       // 1.5s fade out
  toggleAmbient()
  hover(freq=440)     // 80ms sine blip
  click()             // 660Hz (20ms) → 880Hz (30ms)
  navigate()          // 440→220Hz sweep, 200ms
  success()           // 440/550/660Hz staggered triad
  error()             // 220Hz + 233Hz dissonant
}
```

Ambient layers:
1. 55Hz sine, gain 0.5 (sub-bass breath)
2. 110Hz sine, detune +2 cents, LFO on gain (0.3–0.7, 8s period)
3. 880Hz shimmer, gain 0.03, random freq drift via setTimeout
4. White noise → bandpass 200Hz Q=0.8, gain 0.015

Fade in: 2s ramp on masterGain (0 → 0.3). Fade out: 1.5s ramp.

### Navbar updates (`app/components/Navbar.tsx`)
- Added `SoundIcon` component: 3-bar SVG with CSS keyframe animation (bars animate when playing)
- `useEffect` adds `window.addEventListener('click', ..., { once: true })` — first click anywhere starts ambient
- `handleAmbientToggle` with `e.stopPropagation()` to avoid double-triggering
- `ambientOn` state drives icon animation and border color
- Sound icon placed between nav links and language toggle (desktop + mobile)

### Wired to components:
- **Hero:** left panel hover → `audio.hover(440)`, right → `audio.hover(550)`, name box → `audio.hover(880)`, panel clicks → `audio.navigate()`
- **ContactStrip:** input focus → `audio.hover()`, success → `audio.success()`, error → `audio.error()`, social links → 440/550/660Hz hover
- **WorkContent:** tab switch → `audio.click()` + `audio.shiftAmbient(warm|cool)`
- **Navbar:** link hover → `audio.hover()`, link click → `audio.navigate()`, lang toggle → `audio.click()`

---

## Prompt 9 — Audio control panel with 3 modes

> "Add a visible audio control panel to the site. A small floating panel, bottom-right corner, always visible. [≋ SOUND · OFF/ON] pill that expands upward into a card with // AUDIO ENGINE header, 3 mode selectors, master toggle..."

**Commit:** `dca0230` — feat: audio control panel with 3 procedural modes + toast notification

### `lib/audio.ts` — complete rewrite

Added 3-mode system. Key architectural change:

```typescript
type AmbientMode = 'bio' | 'signal' | 'drift'

interface AmbientLayer {
  stopFns: (() => void)[]
  gain: GainNode   // per-layer GainNode for crossfading
}
```

Each mode creates a `layerGain` node. Mode switching crossfades via:
```
newLayer.gain: 0 → 1 over 2s
oldLayer.gain: value → 0 over 2s
oldLayer stops after 2.1s
```

**Alive-flag pattern** — all scheduled callbacks (setTimeout, setInterval) check `alive.v` before executing, preventing ghost sounds after layer stops:
```typescript
const alive = { v: true }
stopFns.push(() => { alive.v = false })
```

**MODE_01 BIO** (previous ambient, unchanged):
- 55Hz + 110Hz + LFO + 880Hz shimmer + bandpass noise

**MODE_02 SIGNAL** (clinical, clean):
- 220Hz sine, gain 0.3
- 880Hz overtone, gain 0.01
- 1320Hz ping every 4.5s (30ms duration, through layerGain)

**MODE_03 DRIFT** (VJ/experimental):
- 110Hz + 113Hz beating oscillators (3Hz beat frequency)
- LFO on 110Hz with variable rate (recursive setTimeout, 3–7s intervals)
- Random 440Hz ghost tones (2s duration, gain 0.02, 3–11s random intervals)

**`shiftAmbient(warm|cool)`** retained as legacy — shifts BIO mode's `_bioFilter` bandpass (200→300Hz warm, 200→150Hz cool). Uses `_bioFilter` private ref stored during BIO layer creation.

### New `app/context/AudioContext.tsx`

React context wrapping the audio singleton so state (playing, mode) is shared between Navbar and AudioPanel without prop drilling.

```typescript
interface AudioState {
  playing, mode, initialized,
  toggle,    // user-gesture: starts audio if needed
  setMode,   // user-gesture: starts ambient if not playing
  switchMode // safe for useEffect: crossfades if playing, no-op if not initialized
}
```

First-click behavior moved from Navbar into AudioProvider:
```typescript
window.addEventListener('click', init, { once: true })
window.addEventListener('touchend', init, { once: true })
```

### New `app/components/AudioPanel.tsx`

- **Pill** (always visible, bottom-right): `[≋ SOUND · ON/OFF]`
  - ≋ icon has `motion.span` opacity pulse when playing (2.5s, `[1, 0.5, 1]`)
  - `WaveIcon` component: 3 `motion.rect` elements with height/y animation
- **Expanded card** (AnimatePresence, slides up):
  - `// AUDIO ENGINE` header + "Procedural sound — generated in real time. No files, no tracking."
  - 3 mode buttons: label + tagline + freq description
  - Active mode: green border + bg `rgba(122,182,72,0.06)`, text `var(--color-green)`
  - `[● PLAYING] / [○ PAUSED]` toggle — ● has `opacity: [1, 0.4, 1]` pulse
- **Toast** (AnimatePresence, bottom-center):
  - Appears once on `initialized` → true
  - `// AUDIO ENGINE ACTIVE — procedural sound initialized`
  - Auto-dismisses after 4s via `setTimeout`
  - Enter: `y: 16 → 0`, Exit: `y: 0 → -12`
- Collapse on outside click via `document.addEventListener('mousedown', ...)`

### Navbar refactor
- Removed own `ambientOn` / `initialized` / first-click handler state
- Now uses `const { playing, toggle: audioToggle } = useAudio()`
- `SoundIcon` rewritten to use Framer Motion `motion.rect` (fixes SSR issue where inline `<style>` keyframes rendered empty)

### `app/layout.tsx` update
Added `AudioProvider` wrapping, `AudioPanel` rendered inside it.

---

## Prompt 10 — /creative and /clinical pages

> "Build two new full pages: /creative and /clinical. These replace the old /work page as the main destination pages..."

**Commit:** `5a2ad9e` — feat: /creative and /clinical full pages with 3D backgrounds

### Infrastructure changes

**`app/components/ClientShell.tsx`** (new):
```typescript
const BARE_PATHS = ['/creative', '/clinical']
// hides Navbar and removes pt-14 padding on these paths
```
Replaces direct `<Navbar />` + `<main className="pt-14">` in layout.

**`app/layout.tsx`** — now uses `<ClientShell>` instead of Navbar + main directly.

**`app/context/AudioContext.tsx`** — added `switchMode` (safe for `useEffect`):
- Does NOT call `audio.init()` — safe to call on page mount without triggering AudioContext creation
- Calls `audio.switchMode(m)` only if `initialized` (crossfades if playing, sets `_mode` if paused)

**`app/components/Hero.tsx`** — panel clicks updated:
- Left: `router.push('/creative')` (was `/work?tab=creative`)
- Right: `router.push('/clinical')` (was `/work?tab=clinical`)

### `app/components/CameraBackground.tsx` (new)

Three.js orthographic camera (no perspective) rendering a full-screen quad with a GLSL shader applied to the webcam feed.

**Shader effects:**
1. **Cover-fit aspect ratio correction** — adjusts UVs so video fills screen without distortion
2. **Horizontal mirror** — `uv.x = 1.0 - uv.x` (selfie cam convention)
3. **3×3 box blur** — `vec2(8.0) / uResolution` texel step size, 9 samples
4. **Chromatic aberration** — R channel at `uv.x - 0.006`, B channel at `uv.x + 0.006`
5. **Green tint** — `mix(color, vec3(0, 0.08, 0), 0.4)`
6. **CRT scanlines** — `step(1.0, mod(gl_FragCoord.y, 2.0))`: dark rows get factor 0.85
7. **Breathing pulse** — `color.g *= 1.0 + 0.04 * sin(uTime * 0.7)`
8. **Vignette** — radial `pow(max(vignette, 0), 0.65)` darkening at edges

Uses `THREE.VideoTexture` which auto-updates from the `<video>` element each frame. Uniform `uVideoAspect` updated after `video.videoWidth` becomes available.

Props: `stream: MediaStream` (passed from parent after getUserMedia).

### `app/components/MatrixRain.tsx` (new)

Canvas-based matrix rain overlay (z-index 1, opacity 0.18, pointer-events none).

Algorithm:
- `cols = Math.floor(canvas.width / 13)` columns
- Each column: `drops[i]` tracks how far down the rain has fallen (in character units)
- Each frame: `ctx.fillStyle = 'rgba(10,12,10,0.075)'` overlay creates fade trail
- Head char: `#39ff14` (neon green) with `shadowBlur: 4`
- Trail char (one above head): `#0d3d00` (dim green)
- Column reset: `if (y > canvas.height && Math.random() > 0.975) drops[i] = 0`
- Speed: `drops[i] += 0.4 + Math.random() * 0.3` (varied per frame)

### `app/components/LabScene.tsx` (new)

Three.js 3D scene for `/clinical` background.

**Scene contents:**
- `group` (auto-rotates): contains all 3D objects
  - 4× wireframe `IcosahedronGeometry` at varied positions, teal `MeshBasicMaterial` wireframe
  - `PointLight` (teal) co-located with each icosahedron
  - `GridHelper(30, 30)` floor at y=-2.5
  - 3× glass spheres: `SphereGeometry(r, 32, 32)`, `MeshPhongMaterial` with `opacity: 0.12`, `shininess: 160`, `specular: 0x88ddff`, `DoubleSide`
- `particles` (added to scene, not group): 250 points, `PointsMaterial` teal, size 0.025
- `AmbientLight(0x0a2030, 1.2)` + `DirectionalLight(0xe8f4f8, 1.8)` top-right

**Auto-rotation:** `group.rotation.y = t * 0.04` (very slow). Each icosahedron also rotates individually on x and y axes.

**Particle drift upward:** each frame `pos[i*3+1] += vel[i]`, wraps at y=5 → reset to y=-4.

**Mouse parallax:** 
```
camTarget.x += (mx * 0.35 - camTarget.x) * 0.04
camera.position.x = camBase.x + camTarget.x
camera.lookAt(0, 0, 0)
```
Max ±0.35 units horizontal, ±0.35 units vertical.

**Type fix:** `import type * as ThreeNS from 'three'` at top level for type annotation `icosahedra: ThreeNS.Mesh[]` inside async IIFE (THREE is a runtime value, not available as namespace for types).

### `app/creative/page.tsx` + `app/creative/CreativeContent.tsx`

**Permission flow:**
- State: `'prompt' | 'active' | 'denied'`
- Prompt: custom dark card with camera SVG icon, "// VISUAL FEED REQUESTED", two buttons
- `getUserMedia({ video: { facingMode: 'user' }, audio: false })`
- On grant: pass `stream` to `CameraBackground`, show `MatrixRain`
- On deny/error: show `HeroParticles` (particle fallback)

**Audio:** `useEffect(() => { switchMode('drift') }, [switchMode])` on mount.

**Page transition:** `initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}` (slides from left).

**Custom cursor:** `cursor: none` on page wrapper, `+` character follows `mousemove` event (position: fixed, z-index 9999, green text-shadow glow).

**Content sections:**
1. Live Performances — 8 cards in 2-col grid
   - `PerformanceCard` component: dark glass surface, green left-border accent, hover → border brightens, tag text brightens, `audio.hover(440 + index * 40)` (different pitch per card)
2. Capabilities — 3 large Cormorant serif headings with mono subtitles
3. Early Career — 2 entries, border-top list style
4. CTA — "Get in touch about a project →" → `/contact`

**Top bar** (fixed, dark blur):
- ← back button → `router.push('/')`
- "CREATIVE TECHNOLOGIST" (green)
- Mode indicator: `⬤ MODE_DRIFT`

### `app/clinical/page.tsx` + `app/clinical/ClinicalContent.tsx`

**Audio:** `useEffect(() => { switchMode('signal') }, [switchMode])` on mount.

**Page transition:** `initial={{ x: 60, opacity: 0 }}` (slides from right).

**Layout:** CSS Grid `grid-cols-1 lg:grid-cols-[2fr_320px]` — timeline left, skills/meta right.

**Timeline:**
- Vertical teal line (`position: absolute, left: 0.6rem, width: 1px, rgba(74,154,184,0.25)`)
- Per-entry dot (`width: 7px, height: 7px, borderRadius: 50%`) that glows on hover
- 7 entries with period badge, role (serif), company (teal mono), bullet list
- Hover: dot brightens + `boxShadow: '0 0 8px var(--color-teal)'`, `audio.hover(550 + i * 20)`

**Right panel sections:** Skills (4 tag-cloud groups), Certifications (4 items), Education (2 degrees), Affiliations (TSCA + ACRP).

**Featured project:** Genomic Gap — UNESCO AI Ethics Residency, teal-bordered card.

**`Tag` component:** individual hover state, teal border brightens, `audio.hover(550)`.

**Top bar:** ← back, "CLINICAL RESEARCH PROFESSIONAL" (teal), mode indicator.

---

## Errors encountered and fixed

### Error 1: TypeScript — duplicate `onMouseEnter` props
**Where:** `CreativeContent.tsx:389`, `ClinicalContent.tsx:293`  
**Cause:** I accidentally wrote two `onMouseEnter` attributes on the same `<a>` element (once with just `audio.hover()`, once with color change logic).  
**Fix:** Merged both into the second (combined) handler, deleted the first duplicate.

### Error 2: TypeScript — `Cannot find namespace 'THREE'`
**Where:** `LabScene.tsx:62`  
**Cause:** Inside an async IIFE, `THREE` is a runtime value (`const THREE = await import('three')`). TypeScript can't use it as a namespace for type annotations at compile time.  
**Fix:** Added `import type * as ThreeNS from 'three'` at the top of the file and used `ThreeNS.Mesh[]` for the type annotation.

### Error 3: AudioContext SSR — `<style>` in SVG renders empty
**Where:** Navbar `SoundIcon` component (initial implementation)  
**Cause:** React strips `<style>` tag content inside SVGs during SSR. The CSS keyframe animations for the sound bars were defined via a template literal in a `<style>` element, producing an empty style tag in the server render.  
**Fix:** Replaced with Framer Motion `motion.rect` elements with `animate={{ height: [...], y: [...] }}` — client-only animation, no SSR flash.

### Error 4: Git push — no remote configured
**Symptom:** `git push` had nothing to push to; `gh` CLI not found; `brew` not found.  
**Resolution:** User manually created repo at github.com/mujganar/mujganar-studio, then ran:
```bash
git remote add origin https://github.com/mujganar/mujganar-studio.git
git push -u origin main
```

---

## Final file inventory

```
lib/
  audio.ts                    — AudioEngine singleton (275 lines, 3-mode procedural system)

app/
  layout.tsx                  — Root layout: LanguageProvider > AudioProvider > ClientShell > AudioPanel
  page.tsx                    — Home: Hero + DualIdentity + SelectedWork + Venues + ContactStrip

  context/
    LanguageContext.tsx        — TR/EN toggle, t(en, tr) helper
    AudioContext.tsx           — React state bridge for audio singleton (playing, mode, initialized)

  components/
    Navbar.tsx                 — Fixed nav, conditional on path via ClientShell
    ClientShell.tsx            — Hides Navbar + removes pt-14 on /creative and /clinical
    Hero.tsx                   — Split-screen hero, links to /creative and /clinical
    HeroParticles.tsx          — Three.js WebGL particles (also reused as creative fallback bg)
    AudioPanel.tsx             — Floating pill + expandable 3-mode control card + toast
    CameraBackground.tsx       — Three.js orthographic + GLSL shader on webcam feed
    MatrixRain.tsx             — Canvas matrix rain (opacity 0.18 overlay)
    LabScene.tsx               — Three.js 3D lab (icosahedra, spheres, grid, particles)
    DualIdentity.tsx           — Homepage dual identity section
    SelectedWork.tsx           — Homepage project list (links to /work)
    Venues.tsx                 — Marquee of venue names
    ContactStrip.tsx           — Homepage contact form + social links

  creative/
    page.tsx                   — Suspense wrapper, metadata
    CreativeContent.tsx        — Camera permission flow, 8 performance cards, capabilities (422 lines)

  clinical/
    page.tsx                   — Suspense wrapper, metadata
    ClinicalContent.tsx        — 3D lab bg, 7-entry timeline, skills, certs, education (385 lines)

  work/
    page.tsx                   — Suspense wrapper (legacy, still accessible)
    WorkContent.tsx            — Two-tab creative/clinical layout (legacy)

  api/
    contact/route.ts           — POST /api/contact handler
```

---

## Design decisions log

| Decision | Rationale |
|---|---|
| Three.js dynamically imported (`next/dynamic`, `ssr: false`) | Three.js uses `window`, `WebGLRenderingContext` — unavailable in Node.js SSR |
| Singleton `audio` exported from `lib/audio.ts` | Web Audio state must survive page navigation in SPA; re-creating AudioContext on each route causes browser warnings and loses ambient continuity |
| `AudioContext` React wrapper around singleton | Share `playing`/`mode` state between Navbar icon and AudioPanel without prop drilling or global stores |
| `switchMode` vs `setMode` split | `switchMode` safe for `useEffect` (no AudioContext creation, respects autoplay policy). `setMode` in panel mode buttons (user gesture, can start audio). |
| Alive-flag pattern for async audio nodes | `setInterval`/`setTimeout` callbacks outlive their layer unless explicitly stopped. Closure over `{ v: true }` object avoids stale closure issues with a boolean ref. |
| CRT scanlines via `step(1.0, mod(gl_FragCoord.y, 2.0))` | Fragment shader operates per-pixel; `gl_FragCoord.y` gives screen-space y. `step` gives binary 0/1 for alternating rows — zero cost, no texture lookup. |
| Framer Motion `motion.rect` for sound bars | Eliminates SSR-empty `<style>` bug in SVG; Framer Motion animations are client-only by design. |
| `ClientShell` client component wrapping server children | Standard Next.js App Router pattern — client components can receive server component output as `children` props. This avoids making the entire layout a client component. |
| `import type * as ThreeNS from 'three'` for type annotations | Dynamic imports return runtime values, not types. Top-level type-only import gives TypeScript the namespace for annotations without a runtime bundle. |
| Hero panels link to `/creative` and `/clinical` (not `/work?tab=`) | Deprecated the query-param approach in favour of dedicated pages with proper backgrounds, audio modes, and transitions. `/work` remains accessible but is no longer the primary destination. |

---

## Commit history

```
b33f28b  Initial commit from Create Next App
95a7cc2  feat: scaffold project with design system, language context, and Navbar
2c16aa3  feat: hero section with Three.js cellular particle system
dae2166  feat: complete homepage — DualIdentity, SelectedWork, Venues, ContactStrip, contact API
60a1d7f  feat: /work page — accurate clinical timeline and creative event data, two-tab layout
14ab404  feat: split-screen hero redesign with side-reactive particle system and /work deep-link tabs
64d030f  fix: hero readability — larger name box, readable tags/labels, always-visible CTAs
c9e8080  fix: hero text contrast — dark text on active side when glow brightens background
cfb20a9  feat: procedural Web Audio sound system wired to all interactions
dca0230  feat: audio control panel with 3 procedural modes + toast notification
5a2ad9e  feat: /creative and /clinical full pages with 3D backgrounds
```

---

## Known gaps / next session

- `/about` page — linked in Navbar but returns 404
- `/contact` page — linked in Navbar but returns 404 (contact form only available on homepage via ContactStrip)
- Social links in ContactStrip are placeholders (`https://linkedin.com`, `https://instagram.com`) — need real URLs
- `/cv.pdf` linked on /clinical does not exist
- No exit animations on page transitions (Framer Motion exit requires AnimatePresence at a higher level in App Router — non-trivial)
- Camera shader blur is a 3×3 box blur, not true 8px Gaussian (acceptable visually, performance win)
- LabScene uses no OrbitControls — auto-rotation is manual `group.rotation.y += dt`; mouse parallax shifts camera position only
- `shiftAmbient(warm|cool)` in WorkContent still calls the legacy method (it correctly affects BIO mode's bandpass filter or is a no-op in other modes)
- No Lighthouse audit or performance testing done
- `brew` and `gh` CLI not available on this machine — install via https://brew.sh or direct binary download
