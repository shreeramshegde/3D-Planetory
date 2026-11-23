import { createMulberry32 } from '../prng';
import { Simulation } from '../types';

export type ServiceNodeType = 'LOAD_BALANCER' | 'CACHE' | 'QUEUE' | 'REPLICA';

export interface TopologyNode {
  id: string;
  type: ServiceNodeType;
  x: number;
  y: number;
  capacity: number;
  currentLoad: number;
  cost: number;
  isAlive: boolean;
  droppedCount: number;
  processedCount: number;
}

export interface Packet {
  id: number;
  spawnTime: number;
  targetNodeId: string;
  latencyMs: number;
  status: 'IN_TRANSIT' | 'CACHED' | 'PROCESSED' | 'DROPPED';
}

export interface PacketRainState {
  time: number;
  budget: number;
  nodes: TopologyNode[];
  activePackets: Packet[];
  completedLatencies: number[];
  totalSpawned: number;
  totalProcessed: number;
  totalDropped: number;
  chaosTriggered: boolean;
  wave: number;
  isFailed: boolean;
  isWon: boolean;
  prngState: number;
}

export type PacketRainInput =
  | { type: 'ADD_NODE'; nodeType: ServiceNodeType; x: number; y: number }
  | { type: 'REMOVE_NODE'; nodeId: string }
  | { type: 'REBOOT_NODE'; nodeId: string };

const NODE_COSTS: Record<ServiceNodeType, number> = {
  LOAD_BALANCER: 15,
  CACHE: 20,
  QUEUE: 10,
  REPLICA: 18,
};

const NODE_CAPACITIES: Record<ServiceNodeType, number> = {
  LOAD_BALANCER: 16,
  CACHE: 12,
  QUEUE: 24,
  REPLICA: 8,
};

export const packetRainSim: Simulation<PacketRainState, PacketRainInput> = {
  init(seed: number): PacketRainState {
    const initialNodes: TopologyNode[] = [
      {
        id: 'lb_0',
        type: 'LOAD_BALANCER',
        x: 1,
        y: 0,
        capacity: NODE_CAPACITIES.LOAD_BALANCER,
        currentLoad: 0,
        cost: NODE_COSTS.LOAD_BALANCER,
        isAlive: true,
        droppedCount: 0,
        processedCount: 0,
      },
      {
        id: 'rep_1',
        type: 'REPLICA',
        x: 0,
        y: 1,
        capacity: NODE_CAPACITIES.REPLICA,
        currentLoad: 0,
        cost: NODE_COSTS.REPLICA,
        isAlive: true,
        droppedCount: 0,
        processedCount: 0,
      },
      {
        id: 'rep_2',
        type: 'REPLICA',
        x: 2,
        y: 1,
        capacity: NODE_CAPACITIES.REPLICA,
        currentLoad: 0,
        cost: NODE_COSTS.REPLICA,
        isAlive: true,
        droppedCount: 0,
        processedCount: 0,
      },
    ];

    const initialSpend = initialNodes.reduce((acc, n) => acc + n.cost, 0);

    return {
      time: 0,
      budget: 100 - initialSpend,
      nodes: initialNodes,
      activePackets: [],
      completedLatencies: [],
      totalSpawned: 0,
      totalProcessed: 0,
      totalDropped: 0,
      chaosTriggered: false,
      wave: 1,
      isFailed: false,
      isWon: false,
      prngState: seed,
    };
  },

  step(state: PacketRainState, input: PacketRainInput | null, dt: number): PacketRainState {
    if (state.isFailed || state.isWon) return state;

    const nextState: PacketRainState = {
      ...state,
      time: state.time + dt,
      nodes: state.nodes.map((n) => ({ ...n })),
      activePackets: state.activePackets.map((p) => ({ ...p })),
      completedLatencies: [...state.completedLatencies],
    };

    const rng = createMulberry32((state.prngState + Math.floor(state.time * 100)) >>> 0);

    // 1. Process player topology edits
    if (input) {
      if (input.type === 'ADD_NODE') {
        const cost = NODE_COSTS[input.nodeType];
        if (nextState.budget >= cost) {
          nextState.budget -= cost;
          const newId = `${input.nodeType.toLowerCase().slice(0, 3)}_${nextState.nodes.length}`;
          nextState.nodes.push({
            id: newId,
            type: input.nodeType,
            x: input.x,
            y: input.y,
            capacity: NODE_CAPACITIES[input.nodeType],
            currentLoad: 0,
            cost,
            isAlive: true,
            droppedCount: 0,
            processedCount: 0,
          });
        }
      } else if (input.type === 'REMOVE_NODE') {
        const idx = nextState.nodes.findIndex((n) => n.id === input.nodeId);
        if (idx !== -1) {
          const removed = nextState.nodes.splice(idx, 1)[0];
          nextState.budget += Math.floor(removed.cost * 0.7);
        }
      } else if (input.type === 'REBOOT_NODE') {
        const n = nextState.nodes.find((x) => x.id === input.nodeId);
        if (n && !n.isAlive && nextState.budget >= 5) {
          nextState.budget -= 5;
          n.isAlive = true;
          n.currentLoad = 0;
        }
      }
    }

    // 2. Waves and spawn rate
    if (nextState.time > 15 && nextState.wave === 1) nextState.wave = 2;
    if (nextState.time > 30 && nextState.wave === 2) nextState.wave = 3;

    // Chaos monkey event at 18s: kill node rep_1
    if (nextState.time >= 18.0 && !nextState.chaosTriggered) {
      nextState.chaosTriggered = true;
      const victim = nextState.nodes.find((n) => n.type === 'REPLICA' && n.isAlive);
      if (victim) {
        victim.isAlive = false;
        // Dropped packets currently on victim node
        nextState.totalDropped += victim.currentLoad;
        victim.currentLoad = 0;
      }
    }

    // Packet spawn rate depends on wave
    const spawnChance = (nextState.wave * 1.8) * dt;
    if (rng() < spawnChance && nextState.totalSpawned < 140) {
      nextState.totalSpawned++;
      // Arrives at load balancer or first available node
      const entryNode = nextState.nodes.find((n) => n.type === 'LOAD_BALANCER' && n.isAlive) || nextState.nodes[0];
      if (entryNode) {
        nextState.activePackets.push({
          id: nextState.totalSpawned,
          spawnTime: nextState.time,
          targetNodeId: entryNode.id,
          latencyMs: 15,
          status: 'IN_TRANSIT',
        });
      }
    }

    // 3. Service grid processing & routing
    // Reset load counts for active step
    for (const n of nextState.nodes) {
      n.currentLoad = 0;
    }

    const aliveReplicas = nextState.nodes.filter((n) => n.type === 'REPLICA' && n.isAlive);
    const caches = nextState.nodes.filter((n) => n.type === 'CACHE' && n.isAlive);
    const queues = nextState.nodes.filter((n) => n.type === 'QUEUE' && n.isAlive);

    for (let i = nextState.activePackets.length - 1; i >= 0; i--) {
      const pkt = nextState.activePackets[i];
      const node = nextState.nodes.find((n) => n.id === pkt.targetNodeId);

      if (!node || !node.isAlive) {
        // Node failure drop
        pkt.status = 'DROPPED';
        nextState.totalDropped++;
        nextState.activePackets.splice(i, 1);
        continue;
      }

      node.currentLoad++;

      // Overload check
      if (node.currentLoad > node.capacity) {
        // Can a queue buffer it?
        const availableQueue = queues.find((q) => q.currentLoad < q.capacity);
        if (availableQueue) {
          availableQueue.currentLoad++;
          pkt.targetNodeId = availableQueue.id;
          pkt.latencyMs += 45;
          continue;
        }

        pkt.status = 'DROPPED';
        node.droppedCount++;
        nextState.totalDropped++;
        nextState.activePackets.splice(i, 1);
        continue;
      }

      // If at Load Balancer, route to Cache or Replica
      if (node.type === 'LOAD_BALANCER') {
        pkt.latencyMs += 10;
        if (caches.length > 0 && rng() < 0.6) {
          // Route to Cache
          pkt.targetNodeId = caches[Math.floor(rng() * caches.length)].id;
        } else if (aliveReplicas.length > 0) {
          // Route to Replica
          pkt.targetNodeId = aliveReplicas[Math.floor(rng() * aliveReplicas.length)].id;
        } else {
          // No worker available
          pkt.status = 'DROPPED';
          nextState.totalDropped++;
          nextState.activePackets.splice(i, 1);
        }
      }
      // If at Cache: 60% hit rate!
      else if (node.type === 'CACHE') {
        if (rng() < 0.6) {
          // Cache hit: quick response
          pkt.latencyMs += 8;
          pkt.status = 'CACHED';
          node.processedCount++;
          nextState.totalProcessed++;
          nextState.completedLatencies.push(pkt.latencyMs);
          nextState.activePackets.splice(i, 1);
        } else {
          // Cache miss: forward to replica
          pkt.latencyMs += 12;
          if (aliveReplicas.length > 0) {
            pkt.targetNodeId = aliveReplicas[Math.floor(rng() * aliveReplicas.length)].id;
          } else {
            pkt.status = 'DROPPED';
            nextState.totalDropped++;
            nextState.activePackets.splice(i, 1);
          }
        }
      }
      // If at Replica: computation finished
      else if (node.type === 'REPLICA') {
        pkt.latencyMs += 35 + rng() * 15;
        pkt.status = 'PROCESSED';
        node.processedCount++;
        nextState.totalProcessed++;
        nextState.completedLatencies.push(pkt.latencyMs);
        nextState.activePackets.splice(i, 1);
      }
    }

    // 4. Check failure and win conditions
    const dropRate = nextState.totalSpawned > 15 ? nextState.totalDropped / nextState.totalSpawned : 0;
    if (dropRate > 0.35) {
      nextState.isFailed = true;
    } else if (nextState.totalProcessed >= 70 && nextState.time >= 25) {
      nextState.isWon = true;
    }

    return nextState;
  },

  getScore(state: PacketRainState): number {
    if (state.completedLatencies.length === 0) return 0;
    const sorted = [...state.completedLatencies].sort((a, b) => a - b);
    const p99Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.99));
    const p99 = sorted[p99Index] || 100;

    const throughputPoints = state.totalProcessed * 8;
    const latencyBonus = Math.max(0, Math.floor((140 - p99) * 3));
    const budgetBonus = Math.floor(state.budget * 2);

    return Math.max(0, throughputPoints + latencyBonus + budgetBonus);
  },

  isTerminal(state: PacketRainState): boolean {
    return state.isFailed || state.isWon;
  },

  isWon(state: PacketRainState): boolean {
    return state.isWon && !state.isFailed;
  },
};
