export interface StoryFragment {
  id: string;
  domainId: string;
  catalogId: string;
  worldName: string;
  title: string;
  author: string;
  role: string;
  timestamp: string;
  quote: string;
  logbook: string[];
}

export const PROLOGUE = {
  title: 'The Great Cascade',
  subtitle: 'An Archival Chronicle of the Six Domains',
  text: [
    'The Observatory was established not as an abstraction, but as a surveyor’s instrument. Six computational realms were mapped from raw silicon to global distributed infrastructure.',
    'Over decades, architectural silos hardened. Interfaces drifted from underlying memory models, neural optimizers decoupled from hardware limits, and distributed consensus failed under partition chaos.',
    'As Lead Systems Archivist, your charge is to calibrate each world through deterministic simulation. Plot all six bodies to complete the celestial Star Atlas.'
  ]
};

export const STORY_CHAPTERS: Record<string, StoryFragment> = {
  kernel: {
    id: 'kernel-fragment',
    domainId: 'kernel',
    catalogId: 'OBS-00',
    worldName: 'The Kernel',
    title: 'Arbitration at the Metal',
    author: 'K. Torvalds-Vance',
    role: 'Hardware Architecture Fellow',
    timestamp: 'Cycle 01.001',
    quote: 'The CPU does not know mercy; it only knows the clock.',
    logbook: [
      'We forged the preemptive scheduler from bare silicon. First boot failed: priority inversion locked Core 0 while low-priority interrupts starved the memory bus. We rewrote the runqueues in pure assembly, enforcing fair time slices and TLB shootdowns. The metal yielded. Threads now yield cleanly without bus contention.'
    ]
  },
  cloud: {
    id: 'stratos-fragment',
    domainId: 'cloud',
    catalogId: 'OBS-01',
    worldName: 'Stratos-9',
    title: 'The Atmospheric Transit',
    author: 'Elena Vance',
    role: 'Principal SRE Cartographer',
    timestamp: 'Cycle 01.084',
    quote: 'Infrastructure is only truly beautiful when nobody notices it exists.',
    logbook: [
      'We anchored container clusters across Stratos-9’s jet streams. When an atmospheric lightning surge killed three ingress nodes mid-day, unbuffered packets caused cascading drop-offs. We placed reactive queues and cache tiers in front of replicas. Traffic reconciled across availability zones in sixty milliseconds with zero customer impact.'
    ]
  },
  ai: {
    id: 'synthetix-fragment',
    domainId: 'ai',
    catalogId: 'OBS-02',
    worldName: 'Synthetix',
    title: 'Descent Down the Ravine',
    author: 'Dr. Marcus Chen',
    role: 'Director of Neural Representation',
    timestamp: 'Cycle 02.140',
    quote: 'We must remain the stewards of the loss landscape.',
    logbook: [
      'We mapped the 1024-dimensional manifold. Vanilla SGD exploded in the ravines, oscillating between saddle points. By implementing adaptive second moments in Adam and tuning momentum decay, the parameter ball damped its descent, sidestepped the decoy local minimum, and converged cleanly at the global basin.'
    ]
  },
  backend: {
    id: 'kronos-fragment',
    domainId: 'backend',
    catalogId: 'OBS-03',
    worldName: 'Kronos Prime',
    title: 'Consensus Across the Void',
    author: 'Tariq Al-Mansoor',
    role: 'Distributed Systems Architect',
    timestamp: 'Cycle 02.312',
    quote: 'Truth in a distributed network is an agreement forged through quorum.',
    logbook: [
      'A network partition severed two nodes from Kronos Prime’s Raft cluster. Rogue writes attempted to elect a phantom leader on the minority side. The quorum invariants held: unconfirmed entries were rejected. When the partition healed, write-ahead logs reconciled seamlessly without a single divergent state.'
    ]
  },
  frontend: {
    id: 'prisma-fragment',
    domainId: 'frontend',
    catalogId: 'OBS-04',
    worldName: 'Prisma',
    title: 'The Sixteen-Millisecond Budget',
    author: 'Maya Lin',
    role: 'Lead Creative Technologist',
    timestamp: 'Cycle 03.018',
    quote: 'The interface is empathy made visible in silicon.',
    logbook: [
      'On Prisma, layout thrashing was dropping frames across the conveyor belt. Interleaved DOM reads and writes forced expensive synchronous reflows. We promoted moving geometry to isolated GPU compositor layers, batched measurements, and offloaded heavy computation to web workers. The pipeline locked at a silky sixty frames per second.'
    ]
  },
  security: {
    id: 'citadel-fragment',
    domainId: 'security',
    catalogId: 'OBS-05',
    worldName: 'Citadel',
    title: 'Closing the Side Channel',
    author: 'Sarah Connor-Cruz',
    role: 'Cryptographic Security Engineer',
    timestamp: 'Cycle 03.204',
    quote: 'Security is not an add-on; it is mathematical paranoia in code.',
    logbook: [
      'Citadel’s comparator was leaking byte-by-byte timing data through early break statements. Attackers deduced passwords by measuring subtle twelve-millisecond variations. We patched the comparison loop to run constant-time bitwise accumulators. The statistical bump vanished; the side channel was sealed shut.'
    ]
  }
};
