import { PlanetConfig } from '../types/universe';

export const PLANETS: PlanetConfig[] = [
  {
    id: 'kernel',
    name: 'The Kernel',
    catalogId: 'OBS-00',
    domain: 'Operating Systems & Process Scheduling',
    color: '#D4A359',
    secondaryColor: '#8C5A20',
    atmosphereColor: '#F2C94C',
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.005,
    size: 4.2,
    axialTilt: 0.05,
    inclination: 0,
    tagline: 'Preemptive hardware arbitration and memory protection',
    description: 'The computational origin of the system. The Kernel schedules execution threads across hardware execution units, arbitrates virtual memory pages, and enforces rings of privilege.',
    keyPillars: [
      { title: 'Preemptive CPU Scheduling', desc: 'Fair queueing, context switching, and avoiding thread starvation under sustained burst workloads.' },
      { title: 'Virtual Memory & Page Translation', desc: 'Hardware translation lookaside buffers (TLB), page table traversal, and copy-on-write isolation.' },
      { title: 'Privilege Boundaries', desc: 'Kernel-space vs user-space transition cost, syscall validation, and interrupt handling.' }
    ],
    techStack: ['C', 'Rust', 'Assembly', 'eBPF', 'POSIX', 'Linux Kernel'],
    challenge: {
      id: 'scheduler',
      title: 'CPU Core Process Scheduler',
      instruction: 'Assign arriving process blocks across 4 CPU execution cores. Switch scheduling policies live to prevent priority inversion and thread starvation.',
      difficulty: 'Advanced',
      rewardXP: 300,
      objective: 'Process 30 threads without starvation timeouts.'
    }
  },
  {
    id: 'cloud',
    name: 'Stratos-9',
    catalogId: 'OBS-01',
    domain: 'Cloud Architecture & DevOps',
    color: '#38BDF8',
    secondaryColor: '#0369A1',
    atmosphereColor: '#7DD3FC',
    orbitRadius: 20,
    orbitSpeed: 0.22,
    rotationSpeed: 0.012,
    size: 2.3,
    axialTilt: 0.38,
    inclination: 0.04,
    hasRings: true,
    ringInnerRadius: 3.0,
    ringOuterRadius: 4.6,
    ringColor: '#38BDF8',
    moons: [
      { name: 'Pod Alpha', size: 0.42, distance: 5.2, speed: 0.7, color: '#BAE6FD' },
      { name: 'Cluster Beta', size: 0.32, distance: 6.4, speed: 0.45, color: '#E0F2FE' }
    ],
    tagline: 'High-availability container mesh and declarative infrastructure',
    description: 'Stratos-9 exemplifies elastic, zero-downtime distributed systems. Its atmospheric layers represent multi-region clusters orchestrated via automated control loops and self-healing deployments.',
    keyPillars: [
      { title: 'Declarative Orchestration', desc: 'Kubernetes controllers reconcile desired vs actual state with zero operator overhead.' },
      { title: 'Infrastructure as Code', desc: 'Reproducible immutable topologies provisioned across hybrid zones.' },
      { title: 'Telemetry & SRE', desc: 'Distributed tracing, SLI/SLO threshold alerting, and automated canary rollbacks.' }
    ],
    techStack: ['Kubernetes', 'Docker', 'Terraform', 'OpenTelemetry', 'ArgoCD', 'Envoy'],
    challenge: {
      id: 'packet-rain',
      title: 'Packet Rain: Topology Routing',
      instruction: 'Place and wire services on a grid to handle arriving request streams. Maintain low p99 latency without cascading overload.',
      difficulty: 'Intermediate',
      rewardXP: 250,
      objective: 'Route 40 packets through service topologies with p99 < 80ms.'
    }
  },
  {
    id: 'ai',
    name: 'Synthetix',
    catalogId: 'OBS-02',
    domain: 'Machine Learning & Neural Systems',
    color: '#A855F7',
    secondaryColor: '#581C87',
    atmosphereColor: '#C084FC',
    orbitRadius: 30,
    orbitSpeed: 0.16,
    rotationSpeed: 0.009,
    size: 2.7,
    axialTilt: 0.18,
    inclination: -0.03,
    moons: [
      { name: 'Attention Node', size: 0.5, distance: 4.8, speed: 0.6, color: '#F3E8FF' }
    ],
    tagline: 'High-dimensional latent manifolds and gradient optimization',
    description: 'Synthetix models continuous representation spaces. Its neural synaptic surface continuously transforms unstructured data streams into dense embeddings for inference and pattern extraction.',
    keyPillars: [
      { title: 'Transformer Architectures', desc: 'Scaled dot-product attention and multi-head projection layers.' },
      { title: 'Vector Retrieval Systems', desc: 'Approximate nearest neighbor search on high-dimensional manifolds.' },
      { title: 'Loss Convergence', desc: 'Gradient descent optimization with adaptive momentum and weight decay.' }
    ],
    techStack: ['PyTorch', 'Transformers', 'Qdrant', 'CUDA', 'vLLM', 'Hugging Face'],
    challenge: {
      id: 'loss-landscape',
      title: 'Loss Landscape Optimization',
      instruction: 'Navigate an optimizer across a non-convex 3D loss surface with saddle points and ravines. Tune parameters live to converge.',
      difficulty: 'Advanced',
      rewardXP: 350,
      objective: 'Converge to global minimum loss < 0.05 under 100 steps.'
    }
  },
  {
    id: 'backend',
    name: 'Kronos Prime',
    catalogId: 'OBS-03',
    domain: 'Distributed Systems & Data Infrastructure',
    color: '#F59E0B',
    secondaryColor: '#92400E',
    atmosphereColor: '#FBBF24',
    orbitRadius: 40,
    orbitSpeed: 0.11,
    rotationSpeed: 0.014,
    size: 2.9,
    axialTilt: 0.44,
    inclination: 0.05,
    hasRings: true,
    ringInnerRadius: 3.6,
    ringOuterRadius: 5.8,
    ringColor: '#F59E0B',
    moons: [
      { name: 'Shard 01', size: 0.52, distance: 7.0, speed: 0.55, color: '#FEF3C7' },
      { name: 'Replica 02', size: 0.38, distance: 8.5, speed: 0.35, color: '#FFFBEB' }
    ],
    tagline: 'Fault-tolerant consensus and high-throughput streaming',
    description: 'A dense geological core governed by distributed write-ahead logs and quorum voting. Kronos Prime handles sustained write pressure while maintaining linearizable consistency.',
    keyPillars: [
      { title: 'Quorum Consensus', desc: 'State machine replication via Raft and Paxos leader-follower agreements.' },
      { title: 'Partition Resilience', desc: 'Consistent hashing with virtual nodes for dynamic cluster rebalancing.' },
      { title: 'Storage Engines', desc: 'LSM-tree write optimization and write-ahead log persistence.' }
    ],
    techStack: ['Go', 'Rust', 'PostgreSQL', 'Apache Kafka', 'Redis', 'gRPC'],
    challenge: {
      id: 'split-brain',
      title: 'Split-Brain: Raft Invariants',
      instruction: 'Control network links across a 5-node cluster. Prevent split-brain writes and preserve quorum log consistency through partition chaos.',
      difficulty: 'Advanced',
      rewardXP: 450,
      objective: 'Commit 15 log entries with 0 linearizability violations.'
    }
  },
  {
    id: 'frontend',
    name: 'Prisma',
    catalogId: 'OBS-04',
    domain: 'Interface Architecture & Creative Web Graphics',
    color: '#EC4899',
    secondaryColor: '#9D174D',
    atmosphereColor: '#F472B6',
    orbitRadius: 50,
    orbitSpeed: 0.08,
    rotationSpeed: 0.018,
    size: 2.4,
    axialTilt: 0.22,
    inclination: -0.06,
    moons: [
      { name: 'Raster', size: 0.44, distance: 4.4, speed: 0.8, color: '#FCE7F3' }
    ],
    tagline: 'Hardware-accelerated rendering and reactive UI composition',
    description: 'Prisma balances WebGL render pipelines, reactive component trees, and accessibility standards. Light passes through its crystalline structures to form responsive visual interfaces.',
    keyPillars: [
      { title: 'GPU Render Pipelines', desc: 'Shaders, scene-graph traversal, and 60-120 FPS rasterization loops.' },
      { title: 'Reactivity & State Graphs', desc: 'Concurrent UI scheduling and selective sub-tree reconciliation.' },
      { title: 'Design System Semantics', desc: 'Composable design tokens, layout ergonomics, and WCAG accessibility.' }
    ],
    techStack: ['React', 'TypeScript', 'Three.js / WebGL', 'Tailwind CSS', 'Web Workers', 'Vite'],
    challenge: {
      id: 'pixel-pipeline',
      title: 'Pixel Pipeline: 16.6ms Budget',
      instruction: 'Manage the conveyor of DOM mutations. Route work away from layout thrashing and maintain 60 FPS within frame budget.',
      difficulty: 'Intermediate',
      rewardXP: 300,
      objective: 'Deliver 60 frames with 0 drops under 16.6ms.'
    }
  },
  {
    id: 'security',
    name: 'Citadel',
    catalogId: 'OBS-05',
    domain: 'Cybersecurity, Cryptography & Defense',
    color: '#10B981',
    secondaryColor: '#064E3B',
    atmosphereColor: '#34D399',
    orbitRadius: 60,
    orbitSpeed: 0.06,
    rotationSpeed: 0.007,
    size: 2.5,
    axialTilt: 0.12,
    inclination: 0.02,
    moons: [
      { name: 'Sentinel Key', size: 0.48, distance: 4.8, speed: 0.6, color: '#D1FAE5' }
    ],
    tagline: 'Zero trust verification and cryptographic integrity',
    description: 'Enclosed in ballistic titanium hexagonal matrices, Citadel enforces strict boundary protection. Every incoming signal is authenticated with mutual TLS and cryptographic attestation.',
    keyPillars: [
      { title: 'Zero Trust Protocols', desc: 'Continuous identity verification with least-privilege role boundaries.' },
      { title: 'Asymmetric Cryptography', desc: 'Elliptic curve key exchanges and tamper-evident cryptographic chains.' },
      { title: 'Defensive Hardening', desc: 'Runtime syscall enforcement, memory safety, and automated vulnerability triage.' }
    ],
    techStack: ['Rust', 'WireGuard', 'OpenSSL / libsodium', 'OAuth2 / OIDC', 'mTLS', 'Vault'],
    challenge: {
      id: 'timing-oracle',
      title: 'Timing Oracle: Side-Channel Extraction',
      instruction: 'Exploit non-constant time string comparisons using noisy response-time probes to recover the secret, then patch with constant-time equality.',
      difficulty: 'Advanced',
      rewardXP: 400,
      objective: 'Extract 8-character secret with statistical confidence.'
    }
  }
];
