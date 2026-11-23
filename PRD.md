# Project Requirements Document (PRD): Kepler-DevCosmos
**Target**: Post-Interview Technical Showcase  
**Status**: In Progress  
**Version**: 1.0 (MVP)  
**Repository**: `/home/shreeram/Projects/PostInterviewTask`

---

## 1. Executive Summary & Narrative
**Storyline**: The user assumes the role of a *Deep Space Cartographer* aboard an exploration vessel entering the **DevCosmos**—an uncharted planetary system where each celestial body embodies a foundational domain of modern computing and software engineering.

The mission is to explore the planetary system, analyze orbital telemetry, decrypt domain-specific architectural dossiers, and complete micro-challenges to calibrate the system toward **100% Cosmic System Harmony**.

---

## 2. System Architecture & Tech Stack

### 2.1 Frontend Architecture (Primary Focus)
* **Framework**: React 18/19 with TypeScript & Vite
* **3D Canvas & Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), and `@react-three/drei`
* **Post-Processing & FX**: `@react-three/postprocessing` (Unreal Bloom, Chromatic Aberration, Tone Mapping, Vignette)
* **State Management**: `zustand` with persistence (`localStorage`) for standalone offline-ready gameplay
* **2D UI & Sci-Fi HUD**: Tailwind CSS + Lucide React icons + Framer Motion
* **Camera Tweening & Choreography**: `@react-three/drei` `CameraControls` + custom lerp/spline transitions
* **Audio FX**: Web Audio API / Synthesized procedural sound effects for clicks, thrusters, and planetary frequencies

### 2.2 Backend Architecture (Extensible Stage - FastAPI + PostgreSQL)
* **Framework**: FastAPI (Python 3.11+)
* **Database**: PostgreSQL with SQLAlchemy (Async) & Alembic migrations
* **Containerization**: `docker-compose.yml` for unified local spin-up
* **Responsibilities**:
  * Persistent pilot leaderboard & time-attack scoring
  * Server-side challenge validation & telemetry verification
  * Global telemetry aggregation (e.g. system completion statistics)
* *Design Principle*: **Local-First & Resilient**. The frontend operates 100% client-side by default with zero blockers if the backend is not yet started, and seamlessly connects to FastAPI when active.

---

## 3. Celestial Domains (Planets & Activities)

### 3.1 Central Star: "The Kernel"
* **Domain**: Core Architecture & Operating Principles
* **Visuals**: Dynamic glowing plasma sun with emissive Fresnel bloom, rotating corona particles, casting dynamic light across all planetary bodies.
* **Telemetry**: System status, global progress percentage, audio toggle, and free-camera reset.

### 3.2 Planet 1: Stratos-9
* **Domain**: Cloud Infrastructure & DevOps
* **Visual Aesthetic**: Cyan gas giant with atmospheric storm belts, glowing orbital rings, and satellite container pods orbiting like moons.
* **Dossier**: Kubernetes orchestration, IaC (Terraform), CI/CD pipelines, autoscaling, and microservices resilience.
* **Interactive Challenge**: *"Pipeline Orchestrator"*
  * Players must re-order and link broken CI/CD pipeline stage nodes (Lint -> Test -> Build Container -> Security Scan -> Deploy) with dependency logic before the deployment timeout occurs.

### 3.3 Planet 2: Synthetix
* **Domain**: Artificial Intelligence & Machine Learning
* **Visual Aesthetic**: Deep violet/bioluminescent planet etched with pulsing neural synaptic networks and glowing tensor grid poles.
* **Dossier**: Transformers, LLMs, neural networks, loss functions, vector embeddings, and training telemetry.
* **Interactive Challenge**: *"Neural Weight Tuner"*
  * An interactive visual 2D loss curve and decision boundary. The player adjusts learning rate and regularization sliders to balance underfitting vs overfitting and reach target accuracy (>90%).

### 3.4 Planet 3: Kronos Prime
* **Domain**: Distributed Systems & High-Throughput Backend
* **Visual Aesthetic**: Obsidian volcanic planet with glowing molten data trenches (representing low-latency data pipelines) and rotating clockwork magnetic rings.
* **Dossier**: CAP theorem, consensus (Raft/Paxos), distributed caching (Redis), message queues (Kafka), and database sharding.
* **Interactive Challenge**: *"Load Balancer Matrix"*
  * Incoming concurrent traffic streams must be routed dynamically across three backend worker nodes using round-robin and least-connections strategies to avoid buffer overflows and 504 gateway timeouts.

### 3.5 Planet 4: Prisma
* **Domain**: Frontend, Creative Web Tech & UX Engineering
* **Visual Aesthetic**: Iridescent geometric crystalline world featuring real-time light refraction, chromatic dispersion, and floating glass UI prisms.
* **Dossier**: React reconciliation, DOM rendering pipelines, WebGL/WebGPU shaders, typography, responsive design, and accessibility.
* **Interactive Challenge**: *"Shader & CSS Resonance"*
  * Players tune live visual parameters (chromatic frequency, blur radius, animation oscillation) to match a holographic resonance preview signature.

### 3.6 Planet 5: Citadel
* **Domain**: Cybersecurity, Cryptography & Defense
* **Visual Aesthetic**: Monolithic geometric dark-alloy sphere enclosed in a rotating translucent hexagonal energy shield with cryptographic data streams.
* **Dossier**: Zero Trust architecture, public key cryptography (RSA/ECC), OAuth2/JWT, penetration testing, and defense-in-depth.
* **Interactive Challenge**: *"Cipher Protocol"*
  * Players align rotating cryptographic cipher rings to decode an encrypted transmission packet before the intrusion countdown expires.

---

## 4. UI/UX & Interaction Model

### 4.1 Navigation & Camera States
1. **Solar System Overview (Macro View)**:
   * Keplerian orbits of all 5 planets around the Kernel.
   * Orbit lines, speed controller, system radar HUD, domain navigation dock.
   * Mouse hover: Planet targeting reticle with quick telemetry preview.
2. **Fly-To Transition**:
   * Clicking a planet initiates a smooth cinematic camera glide that swoops inward, eases into planetary orbit, and focuses on the planet's surface features.
3. **Planetary Orbit View (Micro View)**:
   * The focused planet continues rotating in the background.
   * Holographic dossier slides in (Left): Lore, tech stack, key architectural pillars.
   * Challenge terminal slides in (Right): Interactive puzzle to complete.
   * "Orbit Controls" & "Return to System" action buttons.

### 4.2 Sci-Fi Diegetic HUD Elements
* **Top Bar**: Mission Clock, System Harmony Meter (0% -> 100%), Audio Synthesizer Toggle.
* **Bottom Bar**: Planetary Quick-Selector (Jump to Stratos-9, Synthetix, Kronos, Prisma, Citadel).
* **Right/Floating**: Holographic Dossier & Interactive Mini-Game Overlay.
* **Audio System**: Procedural web-audio synthesizer generating futuristic atmospheric tones, click feedback, and completion chimes.

---

## 5. Development Milestones & Checklist

- [x] **Milestone 0: Project Initiation & PRD Definition**
- [ ] **Milestone 1: Project Scaffolding & Dependencies**
  - [ ] Vite + React + TypeScript + Tailwind CSS setup
  - [ ] Three.js, R3F, Drei, Postprocessing, Framer Motion, Zustand, Lucide icons
- [ ] **Milestone 2: 3D Solar System Foundation**
  - [ ] Starfield / Cosmic Nebula skybox
  - [ ] Central Star (The Kernel) with glowing shaders & point lighting
  - [ ] Orbital paths, planetary meshes, custom procedural textures & materials
  - [ ] CameraControls with smooth fly-to targeting and system reset
- [ ] **Milestone 3: Holographic Sci-Fi HUD & Audio**
  - [ ] System header with Harmony meter & telemetry
  - [ ] Planetary quick-nav dock
  - [ ] Responsive glassmorphism dossier modal
  - [ ] Procedural audio soundscape (Web Audio API)
- [ ] **Milestone 4: Interactive Domain Challenges**
  - [ ] Stratos-9: CI/CD Pipeline Drag & Connect
  - [ ] Synthetix: Neural Weight & Loss Tuner
  - [ ] Kronos Prime: Distributed Load Balancer
  - [ ] Prisma: Real-time Visual Resonance Tuner
  - [ ] Citadel: Cryptographic Ring Cipher
- [ ] **Milestone 5: Progression Mechanics & Polish**
  - [ ] Zustand store for completed challenges, unlocked telemetry, and harmony score
  - [ ] Post-processing polish (bloom, tone mapping, chromatic transitions)
  - [ ] Victory sequence (100% System Harmony achieved)
- [ ] **Milestone 6: Backend Preparation (FastAPI + PostgreSQL)**
  - [ ] Decoupled API service structure (`/backend`)
  - [ ] Endpoints for leaderboard, challenges, and telemetry
  - [ ] Docker Compose setup
