# Kepler: DevCosmos — Complete Technical & Architectural Dossier
**Generated for**: AI Analysis, Brainstorming & Prompt Iteration  
**Project**: Interactive 3D Technical Universe (Post-Interview Showcase)  
**Status**: Milestone 2 Complete (Production Build Verified)  
**Repository**: `/home/shreeram/Projects/PostInterviewTask`  

---

## 1. Project Mission & Core Requirements
The project fulfills the following post-interview engineering brief:
> *"Develop an interactive 3D universe where users can explore different planets, with each planet representing a technical domain. Each world should contain its own challenges, information, activities, and interactive elements. You have full creative freedom regarding the storyline, visual design, interactions, and progression mechanics."*

### Key Implementation Principles
1. **Local-First & Autonomous**: Runs 100% in-browser with zero external network asset dependencies (procedural canvas textures, procedural Web Audio sound synthesis).
2. **Dual-Mode Gameplay**:
   - **In-Universe Holographic HUD**: Inspect planets and run simulations inside a glassmorphic sliding panel.
   - **Dedicated Fullscreen Battle Station (`#/terminal/:domainId`)**: Opens in a separate browser tab, runs in native fullscreen with audio, historical transcripts, and large-format tactical game controls.
3. **Cross-Tab Real-Time Sync**: Uses `BroadcastChannel('kepler-cosmos-sync')` and `localStorage` storage events so completing a challenge in a separate tab immediately unlocks badges, plays victory chimes, and updates harmony scores in the main 3D universe tab.
4. **Humanized & Non-AI Aesthetic**: Stripped of generic clichés, emojis, and double slashes (`//`). Uses typography (`Space Grotesk`, `Rajdhani`, `Plus Jakarta Sans`), deep multi-layer glassmorphism, hardware compositing, and a grounded human narrative.

---

## 2. Complete File Hierarchy & Responsibilities

```
/home/shreeram/Projects/PostInterviewTask/
├── PRD.md                             # Comprehensive Product Requirements Document (v2.0)
├── README.md                            # Complete setup, architecture, and run guide
├── docker-compose.yml                   # Multi-container setup (Postgres 16 + FastAPI + Frontend)
├── .gitignore                           # Git ignore rules
│
├── backend/                             # Extensible Backend Stage (FastAPI + PostgreSQL)
│   ├── Dockerfile                       # Python 3.11-slim container definition
│   ├── requirements.txt                 # FastAPI, SQLAlchemy 2.0, Uvicorn, Pydantic v2, asyncpg, aiosqlite
│   ├── database.py                      # Async database engine with automatic local SQLite fallback
│   ├── models.py                        # SQLAlchemy ORM models (Pilot, ChallengeSubmission)
│   ├── schemas.py                       # Pydantic v2 schemas for verification and leaderboard
│   └── main.py                          # FastAPI application with CORS, challenge verification, and REST endpoints
│
└── frontend/                            # Modern 3D Frontend (React 19 + Three.js + R3F + Tailwind)
    ├── package.json                     # Dependencies & build scripts
    ├── vite.config.ts                   # Vite bundler config with manual chunk splitting (three, r3f, vendor)
    ├── tailwind.config.js               # Theme configuration, typography, and glassmorphism shadows
    ├── tsconfig.json                    # Strict TypeScript compiler options
    ├── index.html                       # HTML5 entry with Google Fonts (Space Grotesk, Rajdhani, Plus Jakarta Sans)
    ├── Dockerfile                       # Multi-stage production Nginx container build
    └── src/
        ├── App.tsx                      # App root with HashRouter ('/' and '/terminal/:domainId')
        ├── main.tsx                     # React 19 entry point
        ├── index.css                    # Tailwind directives, multi-layer glassmorphism, and anti-tearing compositing
        │
        ├── types/
        │   └── universe.ts              # Core TypeScript interfaces: PlanetConfig, ChallengeConfig, UniverseStore
        │
        ├── store/
        │   └── useUniverseStore.ts      # Zustand persistent store with BroadcastChannel cross-tab synchronization
        │
        ├── audio/
        │   └── soundEngine.ts           # Procedural Web Audio API sound synthesizer (0ms latency, zero mp3 downloads)
        │
        ├── data/
        │   ├── planets.ts               # Configuration for all 5 worlds (radii, speeds, colors, tilts, tech stacks)
        │   └── storylines.ts            # The Architect's Odyssey prologue and 5 human field logs
        │
        ├── utils/
        │   └── proceduralTextures.ts    # Mathematical HTML5 canvas procedural texture generator (gas bands, lava, neural, hex)
        │
        ├── services/
        │   └── api.ts                   # Decoupled REST client with silent offline fallback
        │
        ├── pages/
        │   └── FullscreenTerminal.tsx   # Dedicated fullscreen tab terminal view with Fullscreen API toggle
        │
        ├── components/
        │   ├── 3d/
        │   │   ├── UniverseCanvas.tsx   # Three.js canvas with post-processing (Bloom, ToneMapping, Vignette)
        │   │   ├── Sun.tsx              # Host star (The Kernel) with procedural convection surface & point light
        │   │   ├── Planet.tsx           # 3D planet with axial tilt, orbital inclination, atmosphere shell & moons
        │   │   ├── OrbitRing.tsx        # Keplerian orbital trajectory visual line
        │   │   ├── AsteroidBelt.tsx     # 360-body instanced asteroid belt mesh
        │   │   ├── Starfield.tsx        # 3,000-particle deep space starfield
        │   │   └── CameraController.tsx # OrbitControls with unconstrained 360-degree free orbit (car viewer mode)
        │   │
        │   ├── hud/
        │   │   ├── Header.tsx           # Anti-tearing hardware-composited top bar with Harmony meter & Logbook button
        │   │   ├── PlanetDossier.tsx    # Slide-out glassmorphism panel with Dossier, Simulation, and Story tabs
        │   │   ├── PlanetSelector.tsx   # Sleek bottom dock with quick planet targeting and completion badges
        │   │   ├── StoryLogModal.tsx    # Interactive Mission Logbook modal reading historical records
        │   │   └── VictoryOverlay.tsx   # Celebratory modal and confetti burst upon achieving 100% System Harmony
        │   │
        │   ├── visuals/
        │   │   └── DomainBackdrops.tsx  # Layered SVG/CSS thematic cosmic artwork for each domain
        │   │
        │   └── challenges/              # Tough, authentic interactive domain games
        │       ├── ChaosClusterGame.tsx      # Cloud/DevOps: Multi-AZ Kubernetes SLA defense against Chaos Monkey
        │       ├── GradientDescentGame.tsx   # AI/ML: 2D non-convex loss contour training with momentum & gradient clipping
        │       ├── RaftConsensusGame.tsx     # Backend: 5-node Raft consensus cluster with network partition recovery
        │       ├── RenderPipelineGame.tsx    # Frontend: 16.6ms 60 FPS frame budget optimization with live oscilloscope
        │       └── ZeroTrustDefenseGame.tsx  # Security: 3-tier cryptographic defense (cipher rings, HMAC TLS, Diffie-Hellman)
```

---

## 3. The 5 Celestial Domains & Playable Games

| Celestial World | Technical Domain | Real-World Concept & Challenge | Human Architect & Field Log |
| :--- | :--- | :--- | :--- |
| **The Kernel** (Sun) | **Core Computing Architecture** | The source operating system and central gravitational anchor. | **The Foundational Archive**: Dedicated to the millions of open-source contributors whose collective work created modern computing. |
| **Stratos-9** | **Cloud Architecture & DevOps** | **Chaos Cluster: 99.99% SLA Defense**: Manage a 3-AZ Kubernetes cluster. Survive 40s across 3 escalating chaos waves (ingress spike, Chaos Monkey node termination, DDoS flood). Tactical controls: Scale out replicas, cordon/drain, reboot nodes, and toggle WAF rate-limiting. Target: SLA $\ge 99.90\%$. | **Elena Vance** (*"The Night the Cable Broke"*): Recounting the night both transatlantic undersea cables snapped and watching self-healing infrastructure reroute 400 terabits to save critical medical services. |
| **Synthetix** | **Machine Learning & Neural Systems** | **Gradient Descent & Adversarial Defense**: Train a neural network over a 2D non-convex loss contour surface. Overcome a zero-gradient saddle point (Momentum $\beta=0.9$), gradient explosion (Gradient Clipping $\le 1.0$), and FGSM attack (Adversarial Dropout). Target: $\ge 96.0\%$ accuracy and loss $< 0.08$. | **Dr. Marcus Chen** (*"Whispers in the Latent Void"*): Personal reflections on watching high-dimensional linear algebra produce poetry, and the ethical responsibility of stewarding the loss landscape. |
| **Kronos Prime** | **Distributed Systems & Backend** | **Raft Consensus & Distributed Quorum**: Manage a 5-node distributed cluster implementing the Raft protocol. Handle network partition splits ({1, 2} isolated from {3, 4, 5}), step down minority leaders, avoid split-brain states, elect a majority leader, and commit 15 Write-Ahead Log (WAL) entries. | **Tariq Al-Mansoor** (*"The Unbroken Ledger"*): How strict quorum voting and distributed consensus preserved civilization's public ledger during planetary power grid collapses. |
| **Prisma** | **Interface Architecture & Web Graphics** | **16.6ms Render Pipeline: Zero-Jank**: An application is thrashing at 38ms (24 FPS). Fix 4 bottlenecks: batch DOM reads via `requestAnimationFrame`, promote layers to GPU compositing (`will-change`), apply CSS containment, and offload to Web Workers. Target: Hold solid 60 FPS ($\le 16.6$ms) across a 15s stress benchmark. | **Maya Lin** (*"The Human Canvas"*): Why user interfaces are an act of empathy, transforming cold machine instructions into accessible human experiences. |
| **Citadel** | **Cybersecurity & Cryptography** | **Zero-Trust Defense: 3-Tier Handshake**: 3-tier active defense under intrusion countdown: (1) Align 4 rotating hex cipher rings to match SHA-256 session hash; (2) Inspect live TLS 1.3 mTLS packet stream and drop tampered HMAC payloads; (3) Select coprime prime modulus pairs to derive Diffie-Hellman shared secret $K = g^{ab} \pmod p$. | **Sarah Connor-Cruz** (*"The Silent Watch"*): The creed of defending open digital societies and privacy through mathematical cryptography. |

---

## 4. Visuals, Shaders & 3D Engine Details

1. **360-Degree Free Car-View Camera**:
   - `OrbitControls` in `CameraController.tsx` configured with `minPolarAngle={0.05}` and `maxPolarAngle={Math.PI - 0.05}`, allowing complete continuous rotation around the celestial origin from above, below, or side.
   - When focusing a planet, camera glides smoothly via cubic ease-out (`1 - Math.pow(1 - t, 3)`), framing the planet while preserving full 360° orbital freedom around that planet.
2. **Procedural Surface Maps (`proceduralTextures.ts`)**:
   - Uses mathematical HTML5 2D canvas drawing converted into `THREE.CanvasTexture`:
     - *Stratos-9*: 28 atmospheric bands, storm eddies, giant storm vortex.
     - *Synthetix*: Indigo void, 32px synaptic grid lines, 90 interconnected neural tensor nodes.
     - *Kronos Prime*: Dark basalt rock with 20 branching molten magma fissures and impact craters.
     - *Prisma*: Geometric triangular crystalline facets with metallic roughness refraction.
     - *Citadel*: Hexagonal ballistic carbon-fiber armor grid.
     - *The Sun*: Granular solar convection cells with plasma hotspots.
3. **Spatial Physics**:
   - Real axial tilts (Stratos-9: 0.38 rad, Kronos: 0.44 rad, Synthetix: 0.18 rad, Prisma: 0.22 rad, Citadel: 0.12 rad).
   - Non-coplanar orbital inclinations for genuine 3D spatial depth.
   - Counter-rotating atmospheric cloud shells.
4. **Post-Processing**:
   - `@react-three/postprocessing` with Selective Unreal Bloom (`intensity={0.9}`, `luminanceThreshold={0.45}`, `mipmapBlur`), ACESFilmic ToneMapping, and Vignette.

---

## 5. UI/UX & Glassmorphic Design System

1. **Anti-Tearing Unified Top Bar**:
   - Unified fixed navigation bar (`h-16`, `fixed top-0 left-0 right-0 z-30`).
   - Hardware-composited (`transform: translateZ(0); will-change: transform;`) to prevent canvas buffer swap tearing.
   - Embedded System Harmony meter with animated pill progress bar.
   - "Mission Logbook" trigger button and compact orbit speed slider.
2. **Typography**:
   - Headings: `Space Grotesk` (`font-display`).
   - Metrics, Telemetry & Status: `Rajdhani` (`font-tech`).
   - Body Text: `Plus Jakarta Sans` (`font-sans`).
   - Monospace: `Space Grotesk` monospace variant.
3. **Multi-Layer Glassmorphism**:
   - `.glass-panel` & `.glass-panel-glow`: `backdrop-filter: blur(28px) saturate(180%)`, border highlights `rgba(255, 255, 255, 0.15)`, and inset ambient glow `inset 0 1px 1px 0 rgba(255, 255, 255, 0.22)`.
4. **Interactive Animations**:
   - Framer Motion spring physics on dossier slide-in (`type: 'spring', damping: 26, stiffness: 260`).
   - Tactile button feedback (`whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.96 }}`).
   - Modal opening scale transitions.

---

## 6. Procedural Audio Synthesizer (`soundEngine.ts`)
* Built directly on the native **Web Audio API** (zero external mp3/wav network requests):
  - `playClick()`: High-frequency logarithmic sine chirp (1400 Hz $\rightarrow$ 400 Hz in 40ms).
  - `playHover()`: Resonant triangle harmonic ping (D5 587 Hz $\rightarrow$ A5 880 Hz in 60ms).
  - `playWarp()`: Low-frequency filtered sawtooth frequency sweep (80 Hz $\rightarrow$ 240 Hz $\rightarrow$ 55 Hz) simulating warp drive.
  - `playSuccess()`: Four-note arpeggiated major chord chime (C5 523 Hz, E5 659 Hz, G5 783 Hz, C6 1046 Hz).
  - `startAmbient()`: Low-frequency dual-oscillator space drone (55 Hz + 110 Hz through 160 Hz lowpass filter).
* Mute toggle persists in `localStorage`.

---

## 7. Backend & Containerization Architecture
* **FastAPI Service (`backend/`)**:
  - `database.py`: SQLAlchemy async engine with automatic fallback: if PostgreSQL is not running, falls back to `sqlite+aiosqlite:///./devcosmos.db` with zero configuration.
  - `models.py`: `Pilot` (callsign, score, system_harmony, completed_domains) and `ChallengeSubmission` (telemetry payload, pass/fail status, timestamp).
  - `schemas.py`: Pydantic v2 schemas for pilot registration, challenge verification, and leaderboards.
  - `main.py`: CORS-enabled endpoints:
    - `POST /api/v1/pilots/register`
    - `POST /api/v1/challenges/verify`
    - `GET /api/v1/leaderboard`
    - `GET /` (health & database driver telemetry)
* **Docker Compose (`docker-compose.yml`)**:
  - `db`: PostgreSQL 16 Alpine with healthcheck.
  - `backend`: FastAPI with automatic migration table creation on startup.
  - `frontend`: Multi-stage build with Nginx serving optimized static bundle.

---

## 8. Git Commit Log
All work is committed cleanly on branch `master`:
* `efca8ad`: *feat: upgrade typography with Space Grotesk and Rajdhani, fix top bar tearing with hardware composited navbar, add domain backdrop artwork, and apply multi-layer glassmorphism*
* `2576cd8`: *feat: implement tough authentic domain arcade games, dedicated fullscreen tab terminal, humanized storyline logbook, and cross-tab sync*
* `0e544a6`: *feat: upgrade to 360-degree car-view orbit, procedural 3D surface textures, and 5 interactive arcade games*
* `aece295`: *feat: initial implementation of Kepler DevCosmos 3D universe and backend scaffold*
