import { createMulberry32 } from '../prng';
import { Simulation } from '../types';

export type RaftRole = 'FOLLOWER' | 'CANDIDATE' | 'LEADER';

export interface RaftLogEntry {
  term: number;
  index: number;
  command: string;
}

export interface RaftNode {
  id: number;
  role: RaftRole;
  currentTerm: number;
  votedFor: number | null;
  log: RaftLogEntry[];
  commitIndex: number;
  electionTimer: number;
  electionTimeout: number;
  heartbeatTimer: number;
  isAlive: boolean;
  votesReceived: number[];
}

export interface RaftMessage {
  id: number;
  from: number;
  to: number;
  type: 'REQUEST_VOTE' | 'VOTE_REPLY' | 'APPEND_ENTRIES' | 'APPEND_REPLY';
  term: number;
  entries?: RaftLogEntry[];
  prevLogIndex?: number;
  prevLogTerm?: number;
  leaderCommit?: number;
  voteGranted?: boolean;
  success?: boolean;
  transitProgress: number; // 0 to 1
}

export interface SplitBrainState {
  time: number;
  nodes: RaftNode[];
  messages: RaftMessage[];
  // Network links: partitioned[i][j] === true means severed!
  partitionMatrix: boolean[][];
  committedCommands: string[];
  clientWriteCount: number;
  invariantViolation: string | null;
  isFailed: boolean;
  isWon: boolean;
  prngState: number;
}

export type SplitBrainInput =
  | { type: 'ISOLATE_NODES'; nodeIds: number[] }
  | { type: 'HEAL_ALL_PARTITIONS' }
  | { type: 'KILL_NODE'; nodeId: number }
  | { type: 'REVIVE_NODE'; nodeId: number }
  | { type: 'SUBMIT_CLIENT_WRITE'; command: string };

const NODE_COUNT = 5;
const MAJORITY = 3;
const HEARTBEAT_INTERVAL = 0.4;

export const splitBrainSim: Simulation<SplitBrainState, SplitBrainInput> = {
  init(seed: number): SplitBrainState {
    const rng = createMulberry32(seed);

    const nodes: RaftNode[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        id: i,
        role: i === 0 ? 'LEADER' : 'FOLLOWER',
        currentTerm: 1,
        votedFor: i === 0 ? 0 : null,
        log: [{ term: 1, index: 1, command: 'INIT_GENESIS' }],
        commitIndex: 1,
        electionTimer: 0,
        electionTimeout: 1.5 + rng() * 1.5,
        heartbeatTimer: 0,
        isAlive: true,
        votesReceived: i === 0 ? [0, 1, 2] : [],
      });
    }

    const partitionMatrix: boolean[][] = Array.from({ length: NODE_COUNT }, () =>
      Array(NODE_COUNT).fill(false)
    );

    return {
      time: 0,
      nodes,
      messages: [],
      partitionMatrix,
      committedCommands: ['INIT_GENESIS'],
      clientWriteCount: 1,
      invariantViolation: null,
      isFailed: false,
      isWon: false,
      prngState: seed,
    };
  },

  step(state: SplitBrainState, input: SplitBrainInput | null, dt: number): SplitBrainState {
    if (state.isFailed || state.isWon) return state;

    const nextState: SplitBrainState = {
      ...state,
      time: state.time + dt,
      nodes: state.nodes.map((n) => ({
        ...n,
        log: [...n.log],
        votesReceived: [...n.votesReceived],
      })),
      messages: state.messages.map((m) => ({ ...m })),
      partitionMatrix: state.partitionMatrix.map((row) => [...row]),
      committedCommands: [...state.committedCommands],
    };

    const rng = createMulberry32((state.prngState + Math.floor(state.time * 100)) >>> 0);

    // 1. Process player inputs
    if (input) {
      if (input.type === 'ISOLATE_NODES') {
        const isolated = new Set(input.nodeIds);
        for (let i = 0; i < NODE_COUNT; i++) {
          for (let j = 0; j < NODE_COUNT; j++) {
            if (i !== j) {
              const crossPartition = isolated.has(i) !== isolated.has(j);
              nextState.partitionMatrix[i][j] = crossPartition;
            }
          }
        }
      } else if (input.type === 'HEAL_ALL_PARTITIONS') {
        for (let i = 0; i < NODE_COUNT; i++) {
          for (let j = 0; j < NODE_COUNT; j++) {
            nextState.partitionMatrix[i][j] = false;
          }
        }
      } else if (input.type === 'KILL_NODE') {
        const n = nextState.nodes.find((x) => x.id === input.nodeId);
        if (n) {
          n.isAlive = false;
          n.role = 'FOLLOWER';
        }
      } else if (input.type === 'REVIVE_NODE') {
        const n = nextState.nodes.find((x) => x.id === input.nodeId);
        if (n) {
          n.isAlive = true;
          n.electionTimer = 0;
          n.electionTimeout = 1.5 + rng() * 1.5;
        }
      } else if (input.type === 'SUBMIT_CLIENT_WRITE') {
        // Find alive leader
        const leader = nextState.nodes.find((n) => n.isAlive && n.role === 'LEADER');
        if (leader) {
          const newEntry: RaftLogEntry = {
            term: leader.currentTerm,
            index: leader.log.length + 1,
            command: input.command,
          };
          leader.log.push(newEntry);
          nextState.clientWriteCount++;
        }
      }
    }

    // Auto-generate client writes periodically (every 4 seconds)
    if (Math.floor(nextState.time) > Math.floor(state.time) && Math.floor(nextState.time) % 4 === 0) {
      const leader = nextState.nodes.find((n) => n.isAlive && n.role === 'LEADER');
      if (leader && nextState.clientWriteCount < 12) {
        leader.log.push({
          term: leader.currentTerm,
          index: leader.log.length + 1,
          command: `WRITE_KEY_${nextState.clientWriteCount + 1}`,
        });
        nextState.clientWriteCount++;
      }
    }

    // 2. Node timers & election state machine
    for (const node of nextState.nodes) {
      if (!node.isAlive) continue;

      if (node.role === 'LEADER') {
        node.heartbeatTimer += dt;
        if (node.heartbeatTimer >= HEARTBEAT_INTERVAL) {
          node.heartbeatTimer = 0;
          // Send AppendEntries to all reachable nodes
          for (let targetId = 0; targetId < NODE_COUNT; targetId++) {
            if (targetId === node.id || nextState.partitionMatrix[node.id][targetId]) continue;
            nextState.messages.push({
              id: Math.floor(rng() * 1000000),
              from: node.id,
              to: targetId,
              type: 'APPEND_ENTRIES',
              term: node.currentTerm,
              entries: [...node.log],
              leaderCommit: node.commitIndex,
              transitProgress: 0,
            });
          }
        }
      } else {
        // Followers & Candidates check election timeout
        node.electionTimer += dt;
        if (node.electionTimer >= node.electionTimeout) {
          // Start election!
          node.role = 'CANDIDATE';
          node.currentTerm += 1;
          node.votedFor = node.id;
          node.votesReceived = [node.id];
          node.electionTimer = 0;
          node.electionTimeout = 1.5 + rng() * 1.5;

          // Broadcast RequestVote
          for (let targetId = 0; targetId < NODE_COUNT; targetId++) {
            if (targetId === node.id || nextState.partitionMatrix[node.id][targetId]) continue;
            nextState.messages.push({
              id: Math.floor(rng() * 1000000),
              from: node.id,
              to: targetId,
              type: 'REQUEST_VOTE',
              term: node.currentTerm,
              prevLogIndex: node.log.length,
              prevLogTerm: node.log[node.log.length - 1]?.term || 0,
              transitProgress: 0,
            });
          }
        }
      }
    }

    // 3. Message transit and delivery
    for (let i = nextState.messages.length - 1; i >= 0; i--) {
      const msg = nextState.messages[i];
      // Check if network link is cut during transit
      if (nextState.partitionMatrix[msg.from][msg.to]) {
        nextState.messages.splice(i, 1);
        continue;
      }

      msg.transitProgress += dt * 3.5;
      if (msg.transitProgress >= 1.0) {
        nextState.messages.splice(i, 1);
        const recipient = nextState.nodes.find((n) => n.id === msg.to && n.isAlive);
        if (!recipient) continue;

        // Higher term seen: step down to Follower
        if (msg.term > recipient.currentTerm) {
          recipient.currentTerm = msg.term;
          recipient.role = 'FOLLOWER';
          recipient.votedFor = null;
          recipient.votesReceived = [];
        }

        if (msg.type === 'REQUEST_VOTE') {
          let voteGranted = false;
          if (
            msg.term >= recipient.currentTerm &&
            (recipient.votedFor === null || recipient.votedFor === msg.from)
          ) {
            voteGranted = true;
            recipient.votedFor = msg.from;
            recipient.electionTimer = 0; // reset election timer
          }
          if (!nextState.partitionMatrix[recipient.id][msg.from]) {
            nextState.messages.push({
              id: Math.floor(rng() * 1000000),
              from: recipient.id,
              to: msg.from,
              type: 'VOTE_REPLY',
              term: recipient.currentTerm,
              voteGranted,
              transitProgress: 0,
            });
          }
        } else if (msg.type === 'VOTE_REPLY' && recipient.role === 'CANDIDATE') {
          if (msg.voteGranted && msg.term === recipient.currentTerm) {
            if (!recipient.votesReceived.includes(msg.from)) {
              recipient.votesReceived.push(msg.from);
            }
            // Majority check: >= 3
            if (recipient.votesReceived.length >= MAJORITY) {
              recipient.role = 'LEADER';
              recipient.heartbeatTimer = HEARTBEAT_INTERVAL; // send heartbeat immediately
            }
          }
        } else if (msg.type === 'APPEND_ENTRIES') {
          if (msg.term >= recipient.currentTerm) {
            recipient.role = 'FOLLOWER';
            recipient.electionTimer = 0; // reset election timer

            // Reconcile log: adopt leader's log entries
            if (msg.entries && msg.entries.length > 0) {
              recipient.log = [...msg.entries];
            }
            if (msg.leaderCommit && msg.leaderCommit > recipient.commitIndex) {
              recipient.commitIndex = Math.min(msg.leaderCommit, recipient.log.length);
            }

            if (!nextState.partitionMatrix[recipient.id][msg.from]) {
              nextState.messages.push({
                id: Math.floor(rng() * 1000000),
                from: recipient.id,
                to: msg.from,
                type: 'APPEND_REPLY',
                term: recipient.currentTerm,
                success: true,
                prevLogIndex: recipient.log.length,
                transitProgress: 0,
              });
            }
          }
        } else if (msg.type === 'APPEND_REPLY' && recipient.role === 'LEADER') {
          if (msg.success) {
            // Count matching logs for commit
            const matchIndex = msg.prevLogIndex || 1;
            let ackCount = 1;
            for (const other of nextState.nodes) {
              if (other.id !== recipient.id && other.log.length >= matchIndex) {
                ackCount++;
              }
            }
            if (ackCount >= MAJORITY && matchIndex > recipient.commitIndex) {
              recipient.commitIndex = matchIndex;
              const committed = recipient.log.slice(0, matchIndex).map((e) => e.command);
              nextState.committedCommands = committed;
            }
          }
        }
      }
    }

    // 4. Invariant Verification: No Split Brain!
    // Check that at most ONE leader exists in any partitioned group with a quorum
    const aliveLeaders = nextState.nodes.filter((n) => n.isAlive && n.role === 'LEADER');
    if (aliveLeaders.length > 1) {
      // Are they in the same term?
      const termMap = new Map<number, number>();
      for (const l of aliveLeaders) {
        termMap.set(l.currentTerm, (termMap.get(l.currentTerm) || 0) + 1);
        if ((termMap.get(l.currentTerm) || 0) > 1) {
          nextState.invariantViolation = `SPLIT-BRAIN: Two leaders crowned in Term ${l.currentTerm}!`;
          nextState.isFailed = true;
          return nextState;
        }
      }
    }

    // Win condition: Committed 6+ entries through cluster operations
    if (nextState.committedCommands.length >= 6 && nextState.time >= 15) {
      nextState.isWon = true;
    }

    return nextState;
  },

  getScore(state: SplitBrainState): number {
    if (state.isFailed) return 0;
    const commitPoints = state.committedCommands.length * 75;
    const stabilityBonus = state.isWon ? 200 : 0;
    return commitPoints + stabilityBonus;
  },

  isTerminal(state: SplitBrainState): boolean {
    return state.isFailed || state.isWon;
  },

  isWon(state: SplitBrainState): boolean {
    return state.isWon && !state.isFailed;
  },
};
