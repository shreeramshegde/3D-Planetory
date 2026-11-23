export interface StoryChapter {
  id: string;
  domainId: string;
  worldName: string;
  title: string;
  author: string;
  role: string;
  timestamp: string;
  quote: string;
  logbook: string[];
}

export const PROLOGUE = {
  title: "The Great Cascade",
  subtitle: "A History of the Fragmented Cosmos",
  text: [
    "Fifty years ago, humanity built the DevCosmos—not out of vanity, but out of necessity. It was conceived as a living celestial repository to preserve everything civilization had learned about the architecture of computing.",
    "It was not built by automated algorithms. It was built by millions of human hands: engineers debugging kernel panics by candlelight, researchers scribbling vector equations on cold whiteboard walls, sysadmins waking up to pager alerts at 3:00 AM, and interface designers who believed that computers should feel like an extension of human empathy.",
    "Then came The Great Cascade. Systems grew so vast and labyrinthine that no single human mind could hold the entire architecture. Technical silos formed. Teams stopped talking across domain boundaries. Documentation aged, dependencies rotted, and technical entropy crept into the celestial foundations.",
    "One by one, the planetary domains drifted out of alignment. The bridges between infrastructure, machine learning, distributed systems, user interfaces, and security fractured.",
    "You arrive aboard the exploration vessel not as an overlord, but as a Systems Cartographer and Restorer. Your charge is to visit each planetary society, listen to the human field records left by their architects, master their domain disciplines, and restore the DevCosmos to 100% System Harmony."
  ]
};

export const STORY_CHAPTERS: Record<string, StoryChapter> = {
  cloud: {
    id: 'stratos-story',
    domainId: 'cloud',
    worldName: 'Stratos-9',
    title: 'The Night the Cable Broke',
    author: 'Elena Vance',
    role: 'Principal Site Reliability Architect',
    timestamp: 'Solar Cycle 2041.08.14',
    quote: 'Infrastructure is only truly beautiful when nobody notices it exists.',
    logbook: [
      "People think the cloud is a magical, weightless ether. It isn't. It's glass fiber resting on ocean trenches, steel diesel generators humming in the desert, and copper heat pipes sweating under load.",
      "Three years ago, an undersea tectonic shift severed both transatlantic optic trunk lines during peak financial exchange hours. 400 terabits of civilization's traffic evaporated in sixty milliseconds.",
      "I sat in the operations bunker with cold coffee, watching alarms bleed across thirty monitors. But then the miracle happened. The declarative controllers we had spent four years perfecting kicked in. Traffic automatically drained from the severed transatlantic routes, spun up 8,000 ephemeral container pods in Frankfurt and Virginia, and rerouted transactions without dropping a single payment for an ICU patient or an orbital hospital shuttle.",
      "That is why we fight for 99.999% uptime here on Stratos-9. When the infrastructure holds, the human world keeps turning."
    ]
  },
  ai: {
    id: 'synthetix-story',
    domainId: 'ai',
    worldName: 'Synthetix',
    title: 'Whispers in the Latent Void',
    author: 'Dr. Marcus Chen',
    role: 'Director of Neural Representation',
    timestamp: 'Solar Cycle 2043.03.22',
    quote: 'We gave numbers the power of language, and in return, they held up a mirror to who we are.',
    logbook: [
      "I still remember the first night our transformer converged on Synthetix. We had fed it centuries of human thought: Shakespearean sonnets, medical research papers, ancient Sanskrit epics, and open-source code repositories.",
      "At 4:18 AM, after six weeks of continuous GPU gradient descent, the training loss curve suddenly dipped below 0.05. I prompted the model with a fragment of an unfinished letter my late grandfather had written during the migration wars.",
      "The model didn't just complete the sentence. It captured his cadence, his hesitation, his quiet stubborn hope. I sat alone in the server room and wept.",
      "Machine learning is not about replacing human consciousness; it is the mathematical art of distilling human experience into high-dimensional geometric space. But without careful regularization and ethical grounding, models hallucinate and drift into madness. We must remain the stewards of the loss landscape."
    ]
  },
  backend: {
    id: 'kronos-story',
    domainId: 'backend',
    worldName: 'Kronos Prime',
    title: 'The Unbroken Ledger',
    author: 'Tariq Al-Mansoor',
    role: 'Keeper of Distributed Quorums',
    timestamp: 'Solar Cycle 2039.11.02',
    quote: 'Truth in a distributed system is never instantaneous; it is an agreement forged through consensus.',
    logbook: [
      "In a single computer, truth is easy: there is one memory bus, one quartz clock, one register. In a distributed universe, truth is a fragile miracle.",
      "During the solar storm of '39, half the magnetic nodes on Kronos Prime were cut off. A split-brain disaster threatened to corrupt twenty petabytes of land registries and global identity records. Rogue leaders attempted to write conflicting entries.",
      "The Raft consensus algorithm saved us. Because we enforced strict majority quorums, the partitioned minority nodes refused to commit unverified mutations. The write-ahead logs held firm.",
      "When the electromagnetic storm cleared and the networks reconnected, the distributed state machines re-synchronized down to the microsecond. Not one byte of human heritage was lost. That is our sacred promise on Kronos Prime: no matter how chaotic the network becomes, the truth remains uncorrupted."
    ]
  },
  frontend: {
    id: 'prisma-story',
    domainId: 'frontend',
    worldName: 'Prisma',
    title: 'The Human Canvas',
    author: 'Maya Lin',
    role: 'Lead Interface & Creative Technologist',
    timestamp: 'Solar Cycle 2044.07.19',
    quote: 'A computer is a silent box of silicon until the frontend turns it into an instrument of human emotion.',
    logbook: [
      "Backend engineers love to joke that frontend is just 'making buttons pretty.' They don't understand that the frontend is the only part of computing that touches a living, breathing human being.",
      "When a person is anxious, waiting for test results from a hospital server, every dropped frame, every confusing error state, every 200ms delay in touch feedback amplifies their fear.",
      "Here on Prisma, we treat the 16.6-millisecond frame budget like a promise of respect to human attention. When animations glide at 60 frames per second, when light refracts intuitively through a WebGL shader, the boundary between the machine and the mind dissolves.",
      "We build interfaces not to showcase code, but to make technology accessible to an elderly grandparent, a child in a rural classroom, or an astronaut navigating through deep space. The interface is empathy made visible."
    ]
  },
  security: {
    id: 'citadel-story',
    domainId: 'security',
    worldName: 'Citadel',
    title: 'The Silent Watch',
    author: 'Sarah Connor-Cruz',
    role: 'Commander of Cryptographic Defense',
    timestamp: 'Solar Cycle 2045.01.05',
    quote: 'Privacy is not about having something to hide; it is the fundamental right to remain free.',
    logbook: [
      "People only think of cybersecurity when a breach makes the evening news. They never see the four hundred thousand malicious intrusion attempts our cryptographic shields deflect every single hour on Citadel.",
      "We live in a world where authoritarian regimes, extortion cartels, and rogue automated botnets constantly probe for the slightest crack in the wall—a hardcoded token, an unpatched zero-day, a forgotten open port.",
      "Our defense is built on Zero Trust and pure mathematics. The beauty of public-key cryptography is that even if an adversary has all the compute power of a dying star, they cannot invert an elliptic-curve discrete logarithm without the private key.",
      "We stand guard on Citadel so that journalists can publish without fear, citizens can vote in privacy, and open societies can thrive in peace. We are the guardians of the digital commons."
    ]
  }
};
