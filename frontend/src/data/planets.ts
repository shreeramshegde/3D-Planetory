import { PlanetConfig } from '../types/universe';

export interface ExtendedPlanetConfig extends PlanetConfig {
  axialTilt: number; // in radians
  inclination: number; // orbital tilt in radians
}

export const PLANETS: ExtendedPlanetConfig[] = [
  {
    id: 'cloud',
    name: 'Stratos-9',
    domain: 'Cloud Architecture & DevOps',
    color: '#0284c7', // Cyan / Deep Ocean
    secondaryColor: '#0369a1',
    atmosphereColor: '#38bdf8',
    orbitRadius: 20,
    orbitSpeed: 0.22,
    rotationSpeed: 0.012,
    size: 2.3,
    axialTilt: 0.38,
    inclination: 0.04,
    hasRings: true,
    ringInnerRadius: 3.0,
    ringOuterRadius: 4.6,
    ringColor: '#38bdf8',
    moons: [
      { name: 'Pod Alpha', size: 0.42, distance: 5.2, speed: 0.7, color: '#bae6fd' },
      { name: 'Cluster Beta', size: 0.32, distance: 6.4, speed: 0.45, color: '#e0f2fe' }
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
      id: 'traffic-router',
      title: 'Cluster Traffic Router',
      instruction: 'Route incoming packet streams through network switches to target pods while isolating malicious requests before cluster health drops.',
      difficulty: 'Novice',
      rewardXP: 250,
      objective: 'Route 12 valid requests and sink 4 threat packets.'
    }
  },
  {
    id: 'ai',
    name: 'Synthetix',
    domain: 'Machine Learning & Neural Systems',
    color: '#7e22ce', // Deep Purple
    secondaryColor: '#581c87',
    atmosphereColor: '#c084fc',
    orbitRadius: 30,
    orbitSpeed: 0.16,
    rotationSpeed: 0.009,
    size: 2.7,
    axialTilt: 0.18,
    inclination: -0.03,
    moons: [
      { name: 'Attention Node', size: 0.5, distance: 4.8, speed: 0.6, color: '#f3e8ff' }
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
      id: 'perceptron-classifier',
      title: 'Dynamic Perceptron Sorter',
      instruction: 'Manually orient the classification hyperplane in real-time to partition streaming data clusters with at least 90% accuracy.',
      difficulty: 'Advanced',
      rewardXP: 350,
      objective: 'Classify 20 data points with accuracy above 90%.'
    }
  },
  {
    id: 'backend',
    name: 'Kronos Prime',
    domain: 'Distributed Systems & Data Infrastructure',
    color: '#d97706', // Obsidian Amber
    secondaryColor: '#92400e',
    atmosphereColor: '#fbbf24',
    orbitRadius: 40,
    orbitSpeed: 0.11,
    rotationSpeed: 0.014,
    size: 2.9,
    axialTilt: 0.44,
    inclination: 0.05,
    hasRings: true,
    ringInnerRadius: 3.6,
    ringOuterRadius: 5.8,
    ringColor: '#f59e0b',
    moons: [
      { name: 'Shard 01', size: 0.52, distance: 7.0, speed: 0.55, color: '#fef3c7' },
      { name: 'Replica 02', size: 0.38, distance: 8.5, speed: 0.35, color: '#fffbeb' }
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
      id: 'queue-dispatcher',
      title: 'Concurrency Queue Dispatcher',
      instruction: 'Dispatch workers across read, write, and analytics shard queues to process transactions before buffer saturation causes deadlock.',
      difficulty: 'Expert',
      rewardXP: 450,
      objective: 'Process 25 transactions without buffer overflow.'
    }
  },
  {
    id: 'frontend',
    name: 'Prisma',
    domain: 'Interface Architecture & Creative Web Graphics',
    color: '#db2777', // Magenta / Rose
    secondaryColor: '#9d174d',
    atmosphereColor: '#f472b6',
    orbitRadius: 50,
    orbitSpeed: 0.08,
    rotationSpeed: 0.018,
    size: 2.4,
    axialTilt: 0.22,
    inclination: -0.06,
    moons: [
      { name: 'Raster', size: 0.44, distance: 4.4, speed: 0.8, color: '#fce7f3' }
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
      id: 'blueprint-assembler',
      title: 'Interface Blueprint Assembler',
      instruction: 'Assemble semantic layout components into responsive interface wireframes under CSS layout rules.',
      difficulty: 'Advanced',
      rewardXP: 300,
      objective: 'Construct 3 target wireframe layouts.'
    }
  },
  {
    id: 'security',
    name: 'Citadel',
    domain: 'Cybersecurity, Cryptography & Defense',
    color: '#059669', // Emerald
    secondaryColor: '#064e3b',
    atmosphereColor: '#34d399',
    orbitRadius: 60,
    orbitSpeed: 0.06,
    rotationSpeed: 0.007,
    size: 2.5,
    axialTilt: 0.12,
    inclination: 0.02,
    moons: [
      { name: 'Sentinel Key', size: 0.48, distance: 4.8, speed: 0.6, color: '#d1fae5' }
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
      id: 'breach-protocol',
      title: 'Matrix Breach Protocol',
      instruction: 'Locate and execute the hex sequence in the security matrix by alternating row and column hops before the timer runs out.',
      difficulty: 'Expert',
      rewardXP: 400,
      objective: 'Extract the target sequence from the 5x5 hex matrix.'
    }
  }
];
