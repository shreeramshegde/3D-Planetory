# Project Requirements Document (PRD): Kepler DevCosmos
**Target**: Post-Interview Technical Showcase  
**Status**: Complete  
**Version**: 2.0  
**Repository**: `/home/shreeram/Projects/PostInterviewTask`

---

## 1. Executive Summary & Narrative
**Storyline: The Architect's Odyssey**  
Fifty years ago, humanity built the **DevCosmos**—a living celestial repository designed to preserve civilization's collective engineering intelligence across computing. It was not built by automated algorithms, but by millions of human hands: engineers debugging kernel panics by candlelight, researchers scribbling vector equations on cold whiteboard walls, sysadmins waking up to pager alerts at 3:00 AM, and interface designers who believed that computers should feel like an extension of human empathy.

Then came **The Great Cascade**. Systems grew so vast and labyrinthine that no single human mind could hold the entire architecture. Technical silos formed. Teams stopped talking across domain boundaries. Documentation aged, dependencies rotted, and technical entropy crept into the celestial foundations.

One by one, the planetary domains drifted out of alignment. The bridges between infrastructure, machine learning, distributed systems, user interfaces, and security fractured.

You arrive aboard the exploration vessel as a **Systems Cartographer and Restorer**. Your charge is to visit each planetary society, listen to the human field records left by their architects, master their domain disciplines, and restore the DevCosmos to **100% System Harmony**.

---

## 2. Technical Architecture & System Design

### 2.1 Dual-Mode Frontend Architecture
* **3D Solar System View**:
  * Unconstrained 360-degree free orbit camera (like an interactive 3D vehicle configurator).
  * High-detail mathematical procedural canvas textures for all planets and the host star.
  * Planetary axial tilts and non-coplanar orbital inclinations for spatial depth.
  * Real-time omni-directional point lighting, Fresnel atmosphere scattering, and selective bloom.
* **Dedicated Fullscreen Arcade Terminal (`#/terminal/:domainId`)**:
  * Can be launched directly in a separate browser tab or viewed in the slide-out holographic HUD.
  * Fullscreen API toggle (`requestFullscreen()`).
  * Field Log transcript from the domain's chief engineer.
  * Real-time cross-tab state synchronization via `BroadcastChannel` and `localStorage` storage events.

### 2.2 Backend Architecture (FastAPI + PostgreSQL)
* **Framework**: FastAPI (Async Python 3.11+)
* **Database**: PostgreSQL with async SQLAlchemy and automatic SQLite local fallback.
* **Containerization**: `docker-compose.yml` for unified spin-up.
* **Endpoints**:
  * `POST /api/v1/pilots/register`: Register or retrieve pilot profile
  * `POST /api/v1/challenges/verify`: Server-side puzzle validation and telemetry logging
  * `GET /api/v1/leaderboard`: Global leaderboards and time-attack metrics
  * `GET /`: Healthcheck and database driver status

---

## 3. Celestial Domains & Deeply-Aligned Engineering Games

### 3.1 The Kernel (Host Star)
* **Domain**: Core Architecture & Operating Principles
* **Visuals**: Dynamic glowing plasma sun with convection texture, rotating corona halo, and point light casting realistic shadows.
* **Features**: Macro system overview, free orbit controls, and celestial speed controller.

### 3.2 Stratos-9
* **Domain**: Cloud Architecture & DevOps
* **Engineer**: Elena Vance (Principal Site Reliability Architect)
* **Field Log**: *"The Night the Cable Broke"* — How declarative Kubernetes controllers and self-healing meshes rerouted 400 terabits of civilization's traffic when an undersea optic line was severed.
* **Interactive Game**: **Chaos Cluster: 99.99% SLA Defense**
  * Manage a 3-Availability-Zone Kubernetes cluster (AZ-East, AZ-West, AZ-Central).
  * Survive 3 escalating incident waves:
    - Wave 1: Ingress traffic spike (1,200 RPS).
    - Wave 2: Chaos Monkey strike crashes AZ-Central worker node and evicts pods.
    - Wave 3: DDoS surge (1,800 RPS).
  * SRE Tactical Controls: Scale out replicas, cordon & drain degraded nodes, reboot crashed instances, and toggle WAF rate-limiting.
  * Win Condition: Maintain cluster uptime SLA strictly &ge; 99.90% over a 40-second survival drill.

### 3.3 Synthetix
* **Domain**: Machine Learning & Neural Systems
* **Engineer**: Dr. Marcus Chen (Director of Neural Representation)
* **Field Log**: *"Whispers in the Latent Void"* — Reflections on training the first foundation models, watching linear algebra produce poetry, and the ethical responsibility of navigating the loss landscape.
* **Interactive Game**: **Gradient Descent & Adversarial Defense**
  * Real-time training loop over a 2D non-convex loss contour canvas.
  * Overcome 3 tough machine learning hazards across 3 training epochs:
    - Epoch 1: Saddle Point Trap (Gradient norm stalls at zero). Player must deploy Momentum Boost ($\beta = 0.9$).
    - Epoch 2: Exploding Gradient (Loss spikes toward infinity). Player must engage Gradient Clipping ($\le 1.0$) and Cosine Decay.
    - Epoch 3: Adversarial Noise (FGSM perturbation attack). Player must toggle Adversarial Dropout.
  * Win Condition: Reach &ge; 96.0% test accuracy and loss < 0.08 across all 3 epochs.

### 3.4 Kronos Prime
* **Domain**: Distributed Systems & High-Throughput Backend
* **Engineer**: Tariq Al-Mansoor (Keeper of Distributed Quorums)
* **Field Log**: *"The Unbroken Ledger"* — How Raft consensus preserved humanity's public ledger during planetary power grid collapses through strict quorum voting.
* **Interactive Game**: **Raft Consensus & Distributed Quorum**
  * Control a 5-node distributed cluster implementing the Raft consensus protocol.
  * Handle real-time network partition events where Nodes {1, 2} are cut off from Nodes {3, 4, 5}.
  * Avoid split-brain divergence by stepping down minority leaders who cannot achieve majority quorum ($3 > 2$).
  * Trigger election on the majority partition, elect a new leader, and replicate 15 Write-Ahead Log (WAL) commits.
  * Win Condition: Commit 15 WAL log entries with zero split-brain inconsistencies.

### 3.5 Prisma
* **Domain**: Interface Architecture & Creative Web Graphics
* **Engineer**: Maya Lin (Lead Interface & Creative Technologist)
* **Field Log**: *"The Human Canvas"* — Why the frontend is the only part of computing that touches human emotion, and why respecting the 16.6ms frame budget is an act of empathy.
* **Interactive Game**: **16.6ms Render Pipeline: Zero-Jank**
  * Diagnose and fix an interactive application thrashing at 38ms (24 FPS) using a live frame oscilloscope.
  * Deploy 4 architectural optimizations:
    1. Batch DOM Reads via `requestAnimationFrame` (eliminating layout thrashing).
    2. GPU Hardware Compositing via `will-change: transform`.
    3. CSS Containment (`contain: layout paint`).
    4. Offload heavy computation to Web Worker threads.
  * Win Condition: Maintain a steady 60 FPS (&le; 16.6ms frame time) across a 15-second benchmark stress test.

### 3.6 Citadel
* **Domain**: Cybersecurity, Cryptography & Defense
* **Engineer**: Sarah Connor-Cruz (Commander of Cryptographic Defense)
* **Field Log**: *"The Silent Watch"* — Defending the open digital commons through pure mathematics and Zero Trust architecture.
* **Interactive Game**: **Zero-Trust Defense: 3-Tier Handshake**
  * 3-tier active cryptographic defense against an advancing intrusion countdown:
    - Tier 1: Asymmetric Key Alignment. Rotate 4 concentric hexadecimal cipher rings to match the SHA-256 session hash.
    - Tier 2: Real-Time HMAC Inspection. Verify TLS 1.3 mTLS packet payloads and drop tampered packets.
    - Tier 3: Diffie-Hellman Key Derivation. Select coprime prime modulus pairs to compute shared secret $K = g^{ab} \pmod p$.
  * Win Condition: Authenticate all 3 tiers before intrusion reaches 100%.

---

## 4. UI/UX & Navigation Features
* **Mission Logbook**: Interactive modal accessible from the top navigation bar containing the Prologue and all 5 field logs.
* **Dual Play Options**:
  1. Quick simulation inside the slide-out holographic HUD.
  2. Dedicated fullscreen terminal in a new tab (`#/terminal/:domainId`) with true browser fullscreen support.
* **Cross-Tab Synchronization**: Real-time broadcast channel synchronizes challenge completions and system harmony across tabs instantly.
* **Non-AI Aesthetic**: Clean typography, aerospace dark theme, zero emojis, and zero robotic double slashes.
