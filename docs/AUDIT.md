# Technical & Visual Audit: Kepler DevCosmos

This audit identifies visual patterns, architectural couplings, and aesthetic tells in the codebase that signal templated AI generation rather than human-directed art direction and senior systems engineering.

---

## 1. Visual & Aesthetic Tells

| Issue | File Location | Root Cause & Tell | Planned Remediation |
| :--- | :--- | :--- | :--- |
| **Pervasive Glassmorphism** | `frontend/src/index.css`, `frontend/src/components/hud/Header.tsx`, `PlanetDossier.tsx` | Excessive blur (`backdrop-blur-28px`), uniform translucency, and frosted pill containers typical of standard UI templates. | Transition to "The Observatory Archive": solid near-opaque ink panels (`#0A0B0F`), warm bone hairlines (`rgba(232, 227, 214, 0.14)`), corner registration marks, and 0-4px corner radii. |
| **Cyber / Neon Color Palette** | `frontend/tailwind.config.js`, `frontend/src/index.css` | Multiple conflicting neon accent glows (`neon-cyan`, `neon-purple`, `neon-amber`) and rainbow gradient bars. | Restrict to near-black ink (`#0A0B0F`), warm bone (`#E8E3D6`), and a single interactive signal color (vermilion `#FF5A36`). Planetary accents strictly localized to world shaders. |
| **Typographic Blandness** | `frontend/index.html`, `frontend/tailwind.config.js` | Generic pairing of `Space Grotesk` and `Rajdhani` produces a generic sci-fi game look rather than an authentic celestial instrument. | Adopt `Instrument Serif` for editorial titles (tight tracking), `Hanken Grotesk` for body copy, and `JetBrains Mono` for tabular telemetry data. |
| **CRT Scanline Overlay** | `frontend/src/App.tsx`, `frontend/src/index.css` | Global `div.scanlines` with linear gradient scanlines is a common trope to fake retro aesthetics. | Remove scanlines completely. Replace with a subtle 4% CSS SVG film grain and clean archival draughtsman markings. |
| **Modal Wall of Lore** | `frontend/src/components/hud/StoryLogModal.tsx` | Long modal essays detached from gameplay; users skip text walls. | Replace modal with concise field notebook fragments ($\le 80$ words) revealed contextually upon solving domain challenges. |
| **Clichéd Metrics & Pulsing Dots** | `frontend/src/components/hud/Header.tsx`, `VictoryOverlay.tsx` | "System Harmony" gauge with animated ping/pulse dots and gradient sliders. | Ground into a celestial cartographer's metric: "Star chart: 0 of 6 plotted", using tabular monospace numerals. |

---

## 2. Rendering & WebGL Tells

| Issue | File Location | Root Cause & Tell | Planned Remediation |
| :--- | :--- | :--- | :--- |
| **Canvas 2D Textures on 3D Meshes** | `frontend/src/utils/proceduralTextures.ts`, `Planet.tsx` | Spheres textured by drawing 2D HTML5 Canvas circles and stripes (`fillRect`, `Math.random()`), yielding low-fidelity seams and flat lighting. | Replace with custom GLSL `ShaderMaterial`s: domain-warped fractional Brownian motion (fbm), dynamic Fresnel atmospheric rim scattering, and procedural noise shaders. |
| **Crude Sun Rendering** | `frontend/src/components/3d/Sun.tsx` | Layered overlapping basic mesh spheres with pulse animation rather than physical blackbody limb darkening. | Implement a true solar GLSL shader with limb darkening, convection noise, and corona prominences. |
| **Un-metaphorical World Meshes** | `frontend/src/components/3d/Planet.tsx` | Worlds are simple spheres with colored skins rather than physical representations of their computing disciplines. | Implement domain-specific 3D metaphors: Stratos-9 flowing jet stream decks, Synthetix neural filaments, Kronos Prime Raft node cluster, Prisma refractive crystal, Citadel lattice shield, and The Kernel process ring. |

---

## 3. Engineering & Simulation Tells

| Issue | File Location | Root Cause & Tell | Planned Remediation |
| :--- | :--- | :--- | :--- |
| **Non-Deterministic React Interval Sims** | `frontend/src/challenges/*.tsx` | Games run on `setInterval` inside React `useEffect` hooks with `Math.random()`, coupling frame rates and re-renders to state updates. | Extract game logic into pure TypeScript simulation engines (`src/engine/`): `init(seed)`, `step(state, input, dt)`, `getScore(state)` with `mulberry32` PRNG and fixed 60Hz accumulator. |
| **Missing Kernel World Challenge** | `frontend/src/types/universe.ts`, `data/planets.ts` | The central host star ("The Kernel") is an inert decorative body with only 5 outer worlds playable. | Introduce the 6th challenge: **CPU Process Scheduler** for The Kernel, modeling preemptive scheduling, I/O waits, and priority inversion. |
| **Lack of Automated Test Harness** | `frontend/` (No tests present) | No unit tests verifying game physics, state transitions, or determinism. | Add Vitest test suites verifying determinism (identical seed + inputs = identical state), win conditions, and failure limits. |
