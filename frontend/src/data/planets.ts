import { PlanetConfig } from '../types/universe';

export const PLANETS: PlanetConfig[] = [
  {
    id: 'cloud',
    name: 'Stratos-9',
    domain: 'Cloud Architecture & DevOps',
    color: '#00f5ff', // Cyan
    secondaryColor: '#0077b6',
    atmosphereColor: '#38bdf8',
    orbitRadius: 18,
    orbitSpeed: 0.22,
    rotationSpeed: 0.015,
    size: 2.1,
    hasRings: true,
    ringInnerRadius: 2.7,
    ringOuterRadius: 4.2,
    ringColor: '#38bdf8',
    moons: [
      { name: 'Pod-Alpha', size: 0.45, distance: 4.8, speed: 0.8, color: '#67e8f9' },
      { name: 'Cluster-Beta', size: 0.35, distance: 6.0, speed: 0.5, color: '#a5f3fc' }
    ],
    tagline: 'The Infinite Infrastructure Nebula',
    description: 'A tempestuous gas world wrapped in containerized orbital rings. Stratos-9 powers zero-downtime microservice galaxies through immutable infrastructure-as-code and self-healing cluster meshes.',
    keyPillars: [
      { title: 'Kubernetes Orchestration', desc: 'Declarative workload autoscaling, ingress routing, and service mesh discovery.' },
      { title: 'Immutable IaC', desc: 'Reproducible multi-region topology provisioned via Terraform and OpenTofu.' },
      { title: 'Observability & SRE', desc: 'Distributed tracing (OpenTelemetry), Prometheus metrics, and automated canary rollbacks.' }
    ],
    techStack: ['Kubernetes', 'Docker', 'Terraform', 'AWS / GCP', 'ArgoCD', 'Prometheus', 'Envoy'],
    challenge: {
      id: 'pipeline-orchestrator',
      title: 'Pipeline Orchestrator',
      instruction: 'A cosmic radiation surge severed the CI/CD pipeline! Sequence the release stages in correct dependency order to prevent deployment outage.',
      difficulty: 'Novice',
      rewardXP: 250,
      objective: 'Arrange 5 pipeline stages into valid deployment sequence.'
    }
  },
  {
    id: 'ai',
    name: 'Synthetix',
    domain: 'AI, Machine Learning & Neural Systems',
    color: '#a855f7', // Violet
    secondaryColor: '#6b21a8',
    atmosphereColor: '#c084fc',
    orbitRadius: 27,
    orbitSpeed: 0.16,
    rotationSpeed: 0.01,
    size: 2.6,
    moons: [
      { name: 'Attention-Head', size: 0.5, distance: 4.5, speed: 0.7, color: '#e9d5ff' }
    ],
    tagline: 'The Latent Space Singularity',
    description: 'A deep bioluminescent world pulsating with synaptic tensor networks. Energy flows through multi-dimensional latent manifolds, continuously training foundation models on cosmic data streams.',
    keyPillars: [
      { title: 'Transformer Architectures', desc: 'Self-attention mechanisms, causal language modeling, and sparse mixture of experts.' },
      { title: 'Vector Retrieval & RAG', desc: 'High-dimensional embeddings indexed with HNSW and approximate nearest neighbor search.' },
      { title: 'Gradient Optimization', desc: 'Adaptive learning schedules (AdamW), backpropagation, and loss minimization.' }
    ],
    techStack: ['PyTorch', 'Hugging Face', 'Transformers', 'Qdrant / Milvus', 'LangChain', 'CUDA', 'vLLM'],
    challenge: {
      id: 'neural-weight-tuner',
      title: 'Neural Weight Tuner',
      instruction: 'The planetary neural network is experiencing catastrophic overfitting! Calibrate the Learning Rate and Regularization to achieve >90% validation accuracy.',
      difficulty: 'Advanced',
      rewardXP: 350,
      objective: 'Tune hyperparameters to minimize validation loss without underfitting.'
    }
  },
  {
    id: 'backend',
    name: 'Kronos Prime',
    domain: 'Distributed Systems & High-Throughput Backend',
    color: '#f59e0b', // Amber/Magma
    secondaryColor: '#b45309',
    atmosphereColor: '#fbbf24',
    orbitRadius: 36,
    orbitSpeed: 0.11,
    rotationSpeed: 0.012,
    size: 2.8,
    hasRings: true,
    ringInnerRadius: 3.5,
    ringOuterRadius: 5.6,
    ringColor: '#f59e0b',
    moons: [
      { name: 'Shard-01', size: 0.55, distance: 6.8, speed: 0.6, color: '#fde68a' },
      { name: 'Replica-02', size: 0.4, distance: 8.2, speed: 0.4, color: '#fef3c7' }
    ],
    tagline: 'The Fault-Tolerant Dynamo',
    description: 'Forged from high-density magnetic magma, Kronos Prime orchestrates petabyte-scale transaction streams. Its core operates under Raft consensus, ensuring zero data loss across distributed shards.',
    keyPillars: [
      { title: 'Distributed Consensus', desc: 'Quorum-based replication, leader election, and atomic broadcast via Raft / Paxos.' },
      { title: 'Event-Driven Streaming', desc: 'Partitioned write-ahead logs, backpressure handling, and exactly-once semantics in Kafka.' },
      { title: 'Storage Engines & Sharding', desc: 'LSM-tree writes, B+ Tree indexes, and consistent hashing for partition elasticity.' }
    ],
    techStack: ['Go', 'Rust', 'PostgreSQL', 'Apache Kafka', 'Redis', 'gRPC', 'Cassandra'],
    challenge: {
      id: 'load-balancer-matrix',
      title: 'Load Balancer Matrix',
      instruction: 'A tidal burst of incoming HTTP/gRPC requests is hitting the gateway! Route traffic efficiently across worker nodes to avoid server meltdown.',
      difficulty: 'Expert',
      rewardXP: 450,
      objective: 'Balance 3 worker node loads dynamically to prevent 504 timeouts.'
    }
  },
  {
    id: 'frontend',
    name: 'Prisma',
    domain: 'Creative Frontend & UX Engineering',
    color: '#ec4899', // Pink/Prism
    secondaryColor: '#831843',
    atmosphereColor: '#f472b6',
    orbitRadius: 45,
    orbitSpeed: 0.08,
    rotationSpeed: 0.02,
    size: 2.2,
    moons: [
      { name: 'Canvas-IO', size: 0.45, distance: 4.2, speed: 0.9, color: '#fbcfe8' }
    ],
    tagline: 'The Crystalline Glass Interface',
    description: 'A crystalline planet refracting photons into vivid spectrums of real-time shaders and fluid motion. Prisma represents the nexus of reactive DOM reconciliation, WebGL, and human-computer symbiosis.',
    keyPillars: [
      { title: 'Hardware-Accelerated WebGL/GPU', desc: 'Custom GLSL shaders, buffer geometries, and 60-120 FPS render loops.' },
      { title: 'Reactive State Architecture', desc: 'Concurrent UI scheduling, fine-grained reactivity, and optimistic updates.' },
      { title: 'Accessibility & Design Systems', desc: 'WCAG AAA contrast, semantic tree fidelity, and tokens-driven ergonomics.' }
    ],
    techStack: ['React', 'TypeScript', 'Three.js / WebGL', 'Tailwind CSS', 'Framer Motion', 'Web Workers', 'Vite'],
    challenge: {
      id: 'shader-resonance',
      title: 'Shader & CSS Resonance',
      instruction: 'The planetary refraction lens has fallen out of harmonic resonance! Tweak chromatic aberration, hue frequency, and pulse depth to align with the target waveform.',
      difficulty: 'Advanced',
      rewardXP: 300,
      objective: 'Harmonize visual shader parameters to match target telemetry.'
    }
  },
  {
    id: 'security',
    name: 'Citadel',
    domain: 'Cybersecurity, Cryptography & Defense',
    color: '#10b981', // Emerald/Matrix
    secondaryColor: '#064e3b',
    atmosphereColor: '#34d399',
    orbitRadius: 54,
    orbitSpeed: 0.06,
    rotationSpeed: 0.008,
    size: 2.4,
    moons: [
      { name: 'Bastion-Key', size: 0.5, distance: 4.6, speed: 0.65, color: '#a7f3d0' }
    ],
    tagline: 'The Cryptographic Stronghold',
    description: 'Enclosed in an impenetrable hexagonal energy matrix, Citadel safeguards the system against anomalous zero-day vectors. Every transaction is authenticated via elliptic-curve cryptography and Zero Trust policies.',
    keyPillars: [
      { title: 'Zero Trust Architecture', desc: 'Never trust, always verify: continuous mTLS authentication and least-privilege RBAC.' },
      { title: 'Public-Key Cryptography', desc: 'Elliptic curve Diffie-Hellman, post-quantum lattice encryption, and PKI cert chains.' },
      { title: 'Offensive & Defensive Security', desc: 'Threat modeling, side-channel attack mitigation, and automated SAST/DAST guards.' }
    ],
    techStack: ['Rust / C', 'WireGuard', 'OpenSSL / libsodium', 'OAuth2 / OIDC', 'Falco', 'HashiCorp Vault', 'mTLS'],
    challenge: {
      id: 'cipher-protocol',
      title: 'Cipher Protocol',
      instruction: 'An anomalous signal has encrypted the defense telemetry! Rotate cryptographic cipher rings to align public and private keys before lockdown.',
      difficulty: 'Expert',
      rewardXP: 400,
      objective: 'Align 3 concentric cipher rings to complete the SHA-256 handshake.'
    }
  }
];
