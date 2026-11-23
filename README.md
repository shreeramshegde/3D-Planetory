# The Observatory Archive (Kepler: DevCosmos)
## An Art-Directed 3D Universe of Six Core Computational Systems

> **Principal Creative Technologist Showcase**  
> Built with **React 19, TypeScript, Three.js, React Three Fiber, Custom GLSL Shaders, Vitest, Zustand, Tailwind CSS, and FastAPI**.

---

## 1. Concept & Art Direction: "The Observatory Archive"

The universe is presented not as a generic sci-fi HUD with neon glows and centered layouts, but as a precision **surveyor's instrument and printed star atlas**.

### Visual Rules & Palette
- **Palette**: Deep near-black ink (`#0A0B0F`), warm bone body text (`#E8E3D6`), 1px hairlines at ~14% bone opacity (`rgba(232, 227, 214, 0.14)`), and a single signal vermilion (`#FF5A36`) reserved strictly for active interactive states. Domain accent colors are isolated to their own planetary world and panel header.
- **Typography**: 
  - **Instrument Serif** for large titles (tight tracking, large scale contrast).
  - **Hanken Grotesk** for clean, readable body text.
  - **JetBrains Mono** with tabular numerals (`tabular-nums`) for telemetry and scientific readouts.
- **Layout & Craft**: Asymmetric, left-aligned layout, oversized numerals, margin annotations, hairline rules, small corner registration marks (`+`), solid near-opaque panels with radii 0 to 4px.
- **Atmospheric Finish**: 4% CSS-only SVG film grain overlay, custom cursor, smooth curved cinematics (`cubic-bezier(0.2, 0.8, 0.2, 1)`), and strict adherence to `prefers-reduced-motion`.

---

## 2. World Rendering & Custom GLSL Shaders

Canvas 2D textures have been replaced with **procedural GLSL ShaderMaterials** and specialized domain metaphors:

| Celestial Body | Catalog ID | Domain | GLSL Shader & Domain Metaphor |
| :--- | :--- | :--- | :--- |
| **The Kernel** | `OBS-00` | Operating Systems & Process Scheduling | Fusing star with physical limb darkening ($I(\mu) = 1 - u(1-\mu) - v(1-\mu)^2$), convection cell noise, and an instanced ring of orbiting CPU process-dots. |
| **Stratos-9** | `OBS-01` | Cloud Architecture & DevOps | Layered cloud decks rendered via domain-warped FBM ($q = \text{fbm}(p + t), r = \text{fbm}(p + 4q)$) with differential latitudinal jet streams and counter-rotating wispy cloud deck. |
| **Synthetix** | `OBS-02` | Machine Learning & Neural Systems | Dark synaptic core surrounded by instanced 3D neural lattice filaments with action potential pulses propagating along graph edges. |
| **Kronos Prime** | `OBS-03` | Distributed Systems & Consensus | Emissive-noise tectonic lava crust fissures orbiting 5 satellite nodes linked by faint consensus lines (the Raft cluster). |
| **Prisma** | `OBS-04` | Interface Architecture & Web Graphics | Refractive faceted crystal utilizing `@react-three/drei`'s `MeshTransmissionMaterial` with chromatic dispersion and thickness. |
| **Citadel** | `OBS-05` | Cybersecurity & Cryptography | Dark obsidian core surrounded by dual rotating hexagonal/geodesic cryptographic lattice shields. |

### Performance & Cinematics
- **Adaptive DPR**: Uses `@react-three/drei`'s `PerformanceMonitor` to scale DPR dynamically between 1.0 and 1.5, holding 60 FPS on integrated GPUs.
- **Selective Emissive Bloom**: Bloom threshold set to `0.82` with low smoothing so only luminous stellar cores, consensus links, and neural action potentials glow without washing out the deep space ink background.
- **Cinematics**:
  - Skippable 6-second deep space push-in intro with surveyor coordinates.
  - Curved arc camera trajectories for planetary focus flybys.
  - Atmospheric "dive" transition when entering a simulation.

---

## 3. Pure TypeScript Simulation Engine (`src/engine/`)

The six challenges are built on pure, deterministic simulations decoupled from React and Three.js:

```ts
export interface Simulation<TState, TInput> {
  init: (seed: number) => TState;
  step: (state: TState, input: TInput | null, dt: number) => TState;
  getScore: (state: TState) => number;
  isTerminal: (state: TState) => boolean;
  isWon: (state: TState) => boolean;
}
```

### Architectural Principles
- **Zero Non-Determinism**: No `Math.random()`, `Date.now()`, or React state inside the simulation step. All pseudo-randomness is driven by a seeded 32-bit `mulberry32` PRNG.
- **Fixed 60Hz Physics Accumulator**: Sub-frame accumulator (`dt = 1/60`s) ensures identical simulation steps regardless of display refresh rate (60Hz, 120Hz, 144Hz) or frame drops.
- **Input Log Recording**: Every user action is recorded as `{ tick, timeMs, input }`.
- **Unit Test Coverage**: Comprehensive Vitest test suite (`frontend/src/engine/__tests__/simulations.test.ts`) verifying bit-for-bit determinism, fail states, and win conditions across all six games.

---

## 4. The Six Skill-Based CS Games

Each game has a skill ceiling, a fail state, a par score, and is playable in 60 seconds:

1. **SCHEDULER (The Kernel, OBS-00)**:
   - Processes arrive with burst time, priority, and I/O waits.
   - Player assigns processes across 4 CPU execution cores and switches scheduling policy live (`ROUND_ROBIN`, `PRIORITY`, `SJF`).
   - Starvation and priority inversion emerge naturally: processes waiting $>12$s trigger starvation penalties. If 3 processes starve, the system halts.

2. **PACKET RAIN (Stratos-9, OBS-01)**:
   - Requests arrive in escalating waves.
   - Player places and wires grid topology under budget: Load Balancers, Caches (60% hit rate, 8ms), Queues (buffer burst traffic), and Replicas.
   - At $t=18$s, a Chaos Monkey strike takes down a replica node. Player must reboot or route traffic to avoid cascading queue drops $>35\%$.

3. **LOSS LANDSCAPE (Synthetix, OBS-02)**:
   - True 3D non-convex loss surface with steep ravines, saddle points, and decoy local minima.
   - Player selects optimizer (`SGD`, `MOMENTUM`, `ADAM`) and tunes learning rate ($\eta$) and momentum ($\beta$) live.
   - True update equations: excessive learning rate causes genuine numerical divergence (exploding gradients); momentum allows navigating ravines.

4. **SPLIT BRAIN (Kronos Prime, OBS-03)**:
   - Real 5-node Raft implementation with roles (`FOLLOWER`, `CANDIDATE`, `LEADER`), election timers, and heartbeat messages (`AppendEntries`, `RequestVote`).
   - Player partitions the network (e.g. isolate nodes `{0, 1}` from `{2, 3, 4}`) and heals links.
   - Live linearizability invariant checker verifies no split-brain (at most one leader per term with quorum, monotonic log matching).

5. **PIXEL PIPELINE (Prisma, OBS-04)**:
   - Browser rendering pipeline (`JS -> Style -> Layout -> Paint -> Composite`) with a 16.6ms frame budget.
   - Arriving DOM mutations include cheap composite transforms and expensive forced synchronous reflows.
   - Player routes items to fast-path compositor lanes and purchases performance upgrades (`will-change`, `Batch Reads`, `Web Worker`).

6. **TIMING ORACLE (Citadel, OBS-05)**:
   - A vulnerable comparator leaks character-by-character timing through early return on first mismatched byte.
   - Player issues latency probes, inspects real-time statistical histograms, and recovers the secret key byte by byte.
   - Once recovered, player applies a constant-time bitwise patch (`diff |= a ^ b`) and verifies that the timing side-channel closes.

---

## 5. Progression & Star Atlas Certification

- **Field Log Chronicles**: Each planet unlocks a concise, authentic engineer field log ($\le 80$ words) capturing what was built, what broke, and what was learned.
- **Constellation Lines**: As worlds are completed, luminous star atlas constellation lines draw between them in the 3D scene, enclosing the full celestial system upon completion.
- **2D Canvas Certification Card**: When all six are plotted, a native HTML5 2D canvas generates a downloadable high-resolution survey certification card (`.png`) containing callsign, date, time taken, par deltas, and vector constellation graphic without any external libraries.

---

## 6. Accessibility & Resilience

- **Keyboard Navigation**:
  - `1` through `6`: Direct navigation to any celestial domain.
  - `Space`: Pause/resume simulation or toggle ambient sound.
  - `Esc`: Return to solar system overview.
  - `focus-visible`: All interactive elements display a 2px vermilion outline with 2px offset.
- **2D Accessible Star Chart**: Full WCAG 2.1 compliant tabular view (`AccessibleTableView.tsx`) allowing users with screen readers or low-end hardware to review all architectures and run all simulations without requiring WebGL.
- **WebGL Context Loss Recovery**: Handles `webglcontextlost` and provides a graceful reload recovery overlay.
- **Screen Reader Announcements**: `aria-live="polite"` region announces world focus changes, telemetry updates, and game achievements.

---

## 7. Verification Architecture Note

The backend verification endpoint `/api/v1/challenges/verify` validates the **plausibility** of submitted challenge telemetry:
- Validates that duration $\ge$ minimum plausible playthrough time.
- Validates that claimed score $\le$ game score ceiling defined in `game_specs.json`.
- Validates that input frequency ($\text{inputs} / \text{duration}$) does not exceed human physiological reflex limits ($\le 30$ inputs/sec).

> **Honest Engineering Note**: This server-side check is **plausibility verification**, not full server-side headless physics replay verification. The pure TypeScript simulations in `src/engine/` are fully capable of deterministic headless replay given identical seeds and inputs (as verified by the Vitest suite).

---

## 8. Development & Setup

### Requirements
- Node.js 18+ (tested on Node v20+)
- Python 3.10+ (for backend)

### Frontend
```bash
cd frontend
npm install
npm run test     # Run all 18 deterministic engine unit tests
npm run build    # Compile TypeScript and Vite production bundle
npm run dev      # Start development server on http://localhost:3000
```

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
