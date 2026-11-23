# Project Requirements Document (PRD): Kepler DevCosmos
**Target**: Post-Interview Technical Showcase  
**Status**: In Progress  
**Version**: 1.1  
**Repository**: `/home/shreeram/Projects/PostInterviewTask`

---

## 1. Executive Summary & Narrative
**Storyline**: The user assumes the role of a Systems Architect navigating the **DevCosmos**—a planetary system where each celestial body represents a foundational domain of modern software engineering.

The mission is to explore the planetary system in full 360-degree free orbit, inspect domain-specific architectural dossiers, and complete interactive domain mini-games to calibrate the system toward **100% System Harmony**.

---

## 2. System Architecture & Tech Stack

### 2.1 Frontend Architecture
* **Framework**: React 19 with TypeScript & Vite
* **3D Canvas & Graphics**: Three.js, React Three Fiber, and React Three Drei
* **Procedural Surface Textures**: Mathematical canvas textures (gas bands, neural grids, magma crusts, crystal facets, hexagonal shields)
* **Post-Processing**: React Three Postprocessing (Selective Bloom, Tone Mapping, Vignette)
* **State Management**: Zustand with persistent storage (`localStorage`) for standalone offline-ready gameplay
* **2D UI & Telemetry**: Tailwind CSS + Lucide React icons + Framer Motion
* **Camera Controls**: OrbitControls with full 360-degree rotation across both azimuth and polar axes
* **Audio FX**: Web Audio API procedural sound synthesizer for clicks, hover pings, warp swooshes, and completion chimes

### 2.2 Backend Architecture (FastAPI + PostgreSQL)
* **Framework**: FastAPI (Python 3.11+)
* **Database**: PostgreSQL with SQLAlchemy (Async) & automatic SQLite fallback
* **Containerization**: `docker-compose.yml` for unified spin-up
* **Responsibilities**:
  * Persistent pilot leaderboard & scoring
  * Server-side challenge validation & telemetry verification
  * Global telemetry aggregation
* *Design Principle*: **Local-First & Resilient**. The frontend operates standalone by default with zero blockers if the backend is not running, and seamlessly connects to FastAPI when active.

---

## 3. Celestial Domains & Interactive Games

### 3.1 Central Star: The Kernel
* **Domain**: Core Computing Architecture & Operating Principles
* **Visuals**: Dynamic glowing plasma sun with convection texture, rotating corona halo, casting omni-directional light across all planetary bodies.
* **Controls**: System status, global progress percentage, audio toggle, and free-camera reset.

### 3.2 Planet 1: Stratos-9
* **Domain**: Cloud Architecture & DevOps
* **Visual Aesthetic**: Cyan gas giant with atmospheric storm belts, glowing orbital rings, and satellite container pods.
* **Dossier**: Kubernetes orchestration, Infrastructure as Code, CI/CD pipelines, autoscaling, and microservices resilience.
* **Interactive Game**: **Cluster Traffic Router**
  * Real-time network arcade game. Incoming requests (API, Auth, and DDOS attack packets) travel across lanes toward service pods. Players toggle network routing gates to direct clean traffic into pods and isolate threats into quarantine sinkholes before cluster health depletes.

### 3.3 Planet 2: Synthetix
* **Domain**: Machine Learning & Neural Systems
* **Visual Aesthetic**: Deep violet world etched with pulsing neural synaptic networks and glowing tensor nodes.
* **Dossier**: Transformers, LLMs, neural networks, loss functions, vector embeddings, and training telemetry.
* **Interactive Game**: **Dynamic Perceptron Sorter**
  * Real-time 2D latent space classification game. Players adjust the decision hyperplane's angle and bias offset in real-time to partition streaming data clusters, achieving >=90% classification accuracy.

### 3.4 Planet 3: Kronos Prime
* **Domain**: Distributed Systems & High-Throughput Backend
* **Visual Aesthetic**: Obsidian volcanic planet with molten data trenches and clockwork magnetic rings.
* **Dossier**: CAP theorem, consensus (Raft/Paxos), distributed caching (Redis), message queues (Kafka), and database sharding.
* **Interactive Game**: **Concurrency Queue Dispatcher**
  * Fast-paced transaction queue manager. Incoming transaction events populate Read, Write, and Streaming shard queues. Players dispatch workers via tactile buttons or keyboard shortcuts [1], [2], [3] and resolve mutex contention locks before buffer saturation triggers deadlock.

### 3.5 Planet 4: Prisma
* **Domain**: Interface Architecture & Creative Web Graphics
* **Visual Aesthetic**: Crystalline prismatic world featuring real-time light refraction, chromatic dispersion, and floating glass UI prisms.
* **Dossier**: React reconciliation, DOM rendering pipelines, WebGL/WebGPU shaders, responsive design, and accessibility.
* **Interactive Game**: **Interface Blueprint Assembler**
  * Visual interface construction puzzle. Players assemble semantic components (Navigation Bar, Hero Canvas, Metric Grid, Action Footer) into responsive wireframe slots under CSS layout rules.

### 3.6 Planet 5: Citadel
* **Domain**: Cybersecurity, Cryptography & Defense
* **Visual Aesthetic**: Monolithic dark-alloy sphere enclosed in a rotating translucent hexagonal energy matrix with cryptographic streams.
* **Dossier**: Zero Trust architecture, public key cryptography (RSA/ECC), OAuth2/JWT, and defense-in-depth.
* **Interactive Game**: **Matrix Breach Protocol**
  * Cyberpunk-style 5x5 code matrix hacking minigame. Players navigate the hex grid by alternating row and column hops to extract the target sequence within buffer memory limits and countdown timer.

---

## 4. UI/UX & Interaction Model

### 4.1 Navigation & 360-Degree Camera Controls
1. **Solar System View (Macro)**:
   * Full 360-degree free orbit (polar: 0 to 180 degrees, azimuth: continuous).
   * Left-click + drag: Rotate camera around system origin from any perspective (above, below, side).
   * Scroll wheel: Smooth zoom in/out with distance clamping.
   * Right-click + drag: Smooth camera pan.
2. **Fly-To Transition & Planetary Inspection (Micro)**:
   * Clicking a planet initiates a smooth cubic ease-out camera flight that frames the planet.
   * Users maintain 360-degree free orbit around the focused planet to inspect surface details, rings, and orbiting moons.
3. **Return to System**:
   * One-click return to macro solar system overview.

---

## 5. Development Status
* [x] Milestone 0: PRD & Architecture
* [x] Milestone 1: 3D Solar System & Procedural Textures
* [x] Milestone 2: 360-degree Car-View Camera Controls
* [x] Milestone 3: Clean, Non-AI Human-Crafted HUD & Procedural Audio
* [x] Milestone 4: 5 Interactive Games (Traffic Router, Perceptron Sorter, Queue Dispatcher, Blueprint Assembler, Breach Protocol)
* [x] Milestone 5: FastAPI + PostgreSQL Backend Scaffold & Docker Compose
