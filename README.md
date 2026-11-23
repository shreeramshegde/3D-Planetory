# Kepler: DevCosmos
## An Interactive 3D Universe of Technical Domains

> **Post-Interview Technical Showcase**  
> Built with **React 19, TypeScript, React Three Fiber, Three.js, Tailwind CSS, Zustand, and FastAPI + PostgreSQL (Docker)**.

---

## Storyline: The Architect's Odyssey
Fifty years ago, humanity built the **DevCosmos**—a living celestial repository designed to preserve civilization's collective engineering intelligence across computing. It was not built by automated algorithms, but by millions of human hands: engineers debugging kernel panics by candlelight, researchers scribbling vector equations on cold whiteboard walls, sysadmins waking up to pager alerts at 3:00 AM, and interface designers who believed that computers should feel like an extension of human empathy.

Then came **The Great Cascade**. Systems grew so vast and labyrinthine that no single human mind could hold the entire architecture. Technical silos formed. Teams stopped talking across domain boundaries. Documentation aged, dependencies rotted, and technical entropy crept into the celestial foundations.

One by one, the planetary domains drifted out of alignment. You arrive aboard the exploration vessel as a **Systems Cartographer and Restorer**. Your charge is to visit each planetary society, read the human field records left by their architects, master their domain disciplines, and restore the DevCosmos to **100% System Harmony**.

---

## The Celestial Domains & Authentic Domain Games

| Celestial Body | Technical Domain | Human Architect & Field Log | Interactive Domain Game |
| :--- | :--- | :--- | :--- |
| **The Kernel** (Sun) | **Core Computing Architecture** | The Foundational Archive | Macro system overview, 360-degree free orbit controls, and speed controller. |
| **Stratos-9** | **Cloud Architecture & DevOps** | Elena Vance: *"The Night the Cable Broke"* | **Chaos Cluster: 99.99% SLA Defense**: Survive multi-AZ Chaos Monkey strikes and 1,800 RPS DDoS surges. Scale replicas and cordon degraded nodes to maintain uptime &ge; 99.90%. |
| **Synthetix** | **Machine Learning & Neural Systems** | Dr. Marcus Chen: *"Whispers in the Latent Void"* | **Gradient Descent & Adversarial Defense**: Train a deep neural network on a 2D non-convex loss contour. Deploy momentum to escape saddle points, clip exploding gradients, and toggle adversarial dropout to reach &ge; 96.0% accuracy. |
| **Kronos Prime** | **Distributed Systems & Backend** | Tariq Al-Mansoor: *"The Unbroken Ledger"* | **Raft Consensus & Distributed Quorum**: Manage a 5-node cluster implementing Raft consensus. Handle network partitions, avoid split-brain hazards, elect majority leaders, and commit 15 WAL entries. |
| **Prisma** | **Interface Architecture & Web Graphics** | Maya Lin: *"The Human Canvas"* | **16.6ms Render Pipeline: Zero-Jank**: Diagnose an application thrashing at 38ms. Batch DOM reads via requestAnimationFrame, promote to GPU composite layers, and apply CSS containment to hold solid 60 FPS (&le; 16.6ms). |
| **Citadel** | **Cybersecurity & Cryptography** | Sarah Connor-Cruz: *"The Silent Watch"* | **Zero-Trust Defense: 3-Tier Handshake**: 3-tier active cryptographic defense. Align 4 asymmetric cipher rings, verify real-time HMAC SHA-256 TLS packet checksums, and compute Diffie-Hellman shared secrets before intrusion strikes. |

---

## Dual Experience Modes

1. **In-Universe Holographic HUD**:
   - Explore the 3D universe in unconstrained 360-degree free orbit (like an interactive 3D vehicle viewer).
   - Click any world to focus the camera while maintaining full 360° orbital freedom around the planet.
   - Slide out the holographic dossier to view architectural principles, read field transcripts, and run in-panel simulations.

2. **Dedicated Fullscreen Arcade Terminal (`#/terminal/:domainId`)**:
   - Click **"Run in Dedicated Fullscreen Tab"** or **"Open in New Tab"** to launch a full-screen battle station terminal in a separate browser tab.
   - Includes real browser fullscreen toggle (`requestFullscreen()`), historical narrative transcripts, and large-format tactical game controls.
   - Cross-tab state synchronization: winning a game in the new tab immediately updates the main 3D universe tab in real-time via `BroadcastChannel` and `localStorage`.

---

## Quick Start

### 1. Running the 3D Frontend (Local-First)
The frontend is built with a local-first architecture. It operates standalone in the browser with persistent state:

```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

To verify the production build:
```bash
npm run build
npm run preview
```

---

### 2. Full-Stack Setup (FastAPI + PostgreSQL via Docker)
When ready to run the full-stack setup with the FastAPI gateway and PostgreSQL database:

```bash
docker compose up --build
```
* **Frontend UI**: [http://localhost:3000](http://localhost:3000)
* **FastAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **PostgreSQL Database**: Port `5432`

---

### 3. Running Backend Standalone (Python / Local Fallback)
The backend features an automatic fallback to `aiosqlite` if PostgreSQL is not active:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Architecture & Tech Stack

### Frontend
- **3D Graphics Engine**: Three.js, React Three Fiber, React Three Drei
- **Camera Controls**: OrbitControls with unrestricted 360-degree rotation (polar & azimuth) and smooth damping
- **Procedural Surface Textures**: Mathematical canvas-generated gas bands, neural grids, magma crusts, crystal facets, and hexagonal shields
- **Post-Processing**: Selective Bloom, ToneMapping, Vignette
- **Audio Synthesizer**: Procedural Web Audio API sound engine
- **UI Framework**: React 19, TypeScript, React Router, Vite, Tailwind CSS
- **State Management**: Zustand with persistent storage and BroadcastChannel cross-tab synchronization

### Backend
- **API Framework**: FastAPI (Async Python)
- **ORM / Database**: SQLAlchemy 2.0 (Async), PostgreSQL / SQLite fallback
- **Validation**: Pydantic v2
- **Containerization**: Docker & Docker Compose
