# Kepler: DevCosmos
## An Interactive 3D Universe of Technical Domains

> **Post-Interview Technical Showcase**  
> Built with **React 19, TypeScript, React Three Fiber, Three.js, Tailwind CSS, Zustand, and FastAPI + PostgreSQL (Docker)**.

---

## Overview & Narrative
Kepler: DevCosmos is an interactive 3D universe that models fundamental software engineering domains as celestial bodies in an explorable star system.

Users navigate the system in full 360-degree free orbit, inspect domain-specific architectural dossiers, and complete interactive domain mini-games to calibrate the system to 100% System Harmony.

---

## The Celestial Domains

| Celestial Body | Technical Domain | Visual & Shader Design | Interactive Mini-Game |
| :--- | :--- | :--- | :--- |
| **The Kernel** (Sun) | **Core Computing Architecture** | Plasma core with animated convection surface and omni-directional lighting. | Macro system overview, free orbit controls, and celestial speed controller. |
| **Stratos-9** | **Cloud Architecture & DevOps** | Cyan gas giant with atmospheric storm belts, orbital rings, and satellite container moons. | **Cluster Traffic Router**: Route packet streams through network switches to target pods while isolating threats. |
| **Synthetix** | **Machine Learning & Neural Systems** | Violet world etched with glowing synaptic neural grids. | **Dynamic Perceptron Sorter**: Orient the classification hyperplane in real-time to partition latent clusters with >90% accuracy. |
| **Kronos Prime** | **Distributed Systems & Backend** | Obsidian volcanic planet with molten data pipelines and clockwork magnetic rings. | **Concurrency Queue Dispatcher**: Process read, write, and streaming shard queues before buffer saturation causes deadlock. |
| **Prisma** | **Interface Architecture & Web Graphics** | Crystalline prismatic world featuring light refraction and chromatic dispersion. | **Interface Blueprint Assembler**: Construct responsive interface trees by slotting semantic components into wireframes. |
| **Citadel** | **Cybersecurity & Cryptography** | Monolithic dark sphere enclosed in a rotating translucent hexagonal energy matrix. | **Matrix Breach Protocol**: Locate and extract hex sequences in the security matrix by alternating row and column hops. |

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
* **Frontend**: [http://localhost:3000](http://localhost:3000)
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
- **Procedural Surface Textures**: Mathematical canvas-generated gas bands, neural grids, magma crusts, and hexagonal shields
- **Post-Processing**: Selective Bloom, ToneMapping, Vignette
- **Audio Synthesizer**: Procedural Web Audio API sound engine
- **UI Framework**: React 19, TypeScript, Vite, Tailwind CSS
- **State Management**: Zustand with persistent storage

### Backend (Extensible)
- **API Framework**: FastAPI (Async Python)
- **ORM / Database**: SQLAlchemy 2.0 (Async), PostgreSQL / SQLite fallback
- **Validation**: Pydantic v2
- **Containerization**: Docker & Docker Compose
