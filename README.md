# 🌌 Kepler: DevCosmos
### An Interactive 3D Universe of Technical Domains

> **Post-Interview Engineering Task Showcase**  
> Built with **React 19, TypeScript, React Three Fiber, Three.js, Tailwind CSS, Zustand, and FastAPI + PostgreSQL (Docker)**.

---

## 🌟 Overview & Narrative
**Kepler: DevCosmos** is an award-winning style interactive 3D universe. Users navigate a high-fidelity solar system where each celestial body represents a fundamental technical domain in modern computer science and software engineering.

Users assume the role of an interstellar systems architect exploring the planets, analyzing their architectural dossiers, and solving domain-specific interactive challenges to calibrate the star system to **100% Cosmic System Harmony**.

---

## 🪐 The Celestial Domains

| Celestial Body | Technical Domain | Visual & Shader Design | Interactive Micro-Challenge |
| :--- | :--- | :--- | :--- |
| **The Kernel** (Sun) | **Core Computing & System Origin** | Plasma core with animated corona glow, procedural noise, and dynamic point light. | System overview, reset telemetry, and celestial speed controller. |
| **Stratos-9** | **Cloud Architecture & DevOps** | Cyan gas giant with atmospheric storm belts, glowing rings, and container satellite moons. | **Pipeline Orchestrator**: Sequence a broken CI/CD deployment graph in correct dependency order. |
| **Synthetix** | **AI, Machine Learning & Neural Systems** | Violet bioluminescent world etched with glowing synaptic neural grids. | **Neural Weight Tuner**: Live hyperparameter calibration (Learning Rate, Regularization, Epochs) to achieve >90% validation accuracy. |
| **Kronos Prime** | **Distributed Systems & Backend** | Obsidian volcanic planet with glowing molten data pipelines and clockwork magnetic rings. | **Load Balancer Matrix**: Route incoming concurrent traffic spikes across worker nodes and toggle HPA to prevent 504 timeouts. |
| **Prisma** | **Frontend, Creative Tech & UX** | Crystalline prismatic world featuring real-time light refraction and chromatic dispersion. | **Shader Resonance**: Tune WebGL chromatic aberration, oscillation frequency, and refraction to match target waveform. |
| **Citadel** | **Cybersecurity & Cryptography** | Monolithic dark-alloy sphere enclosed in a rotating translucent hexagonal energy matrix. | **Cipher Protocol**: Rotate concentric cryptographic cipher rings to align hexadecimal key hashes for SHA-256 handshake. |

---

## 🚀 Quick Start

### 1. Running the 3D Frontend (Autonomous & Zero-Friction)
The frontend is built with a **local-first architecture**. It runs 100% client-side with persistent state in `localStorage` without needing a database to test:

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

### 2. Running Full-Stack (FastAPI + PostgreSQL via Docker)
When ready to run the complete full-stack experience with the FastAPI gateway and PostgreSQL database:

```bash
docker compose up --build
```
* **Frontend UI**: [http://localhost:3000](http://localhost:3000)
* **FastAPI Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **PostgreSQL Database**: Port `5432`

---

### 3. Running Backend Standalone (Python / Local Fallback)
The backend features an automatic fallback to `aiosqlite` if PostgreSQL is not active, allowing zero-friction local testing:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 🛠️ Architecture & Tech Stack

### Frontend
- **3D Graphics**: `three`, `@react-three/fiber`, `@react-three/drei`
- **Post-Processing**: `@react-three/postprocessing` (Selective Bloom, ToneMapping, Vignette)
- **Audio Synthesizer**: Procedural Web Audio API sound engine (0 external network audio dependencies)
- **UI Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React icons
- **State Management**: `zustand` (with persistent store and local-first fallback)
- **Camera System**: Cinematic lerping camera controller with macro system view and micro planetary orbit tracking

### Backend (Prepared & Extensible)
- **API Framework**: FastAPI (Async Python)
- **ORM / Database**: SQLAlchemy 2.0 (Async), PostgreSQL / SQLite
- **Validation**: Pydantic v2
- **Containerization**: Docker & Docker Compose

---

## 📜 Product Requirements Document (PRD)
For the full architectural specification, storylines, and roadmap, see [PRD.md](file:///home/shreeram/Projects/PostInterviewTask/PRD.md).
