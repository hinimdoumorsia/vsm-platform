// ============================================================
// VSM Platform — Discrete Event Simulation Engine
// ============================================================
import { nanoid } from 'nanoid';
import type {
  VSMDiagram, VSMNode, SimulationState, SimulationConfig,
  SimulationPart, NodeSimState,
} from '../../types/vsm.types';

type EventType = 'PART_ARRIVE' | 'PART_START' | 'PART_FINISH' | 'CHANGEOVER_DONE';

interface SimEvent {
  time: number;
  type: EventType;
  nodeId: string;
  partId?: string;
}

interface NodeRuntime {
  node: VSMNode;
  queue: string[];
  processing: string | null;
  busyUntil: number;
  changeoverUntil: number;
  totalProcessed: number;
  totalWaitTime: number;
  cycleTime: number;
  changeoverTime: number;
  uptime: number;
  batchSize: number;
}

export interface SimulationSnapshot {
  time: number;
  nodeStates: Record<string, NodeSimState>;
  parts: SimulationPart[];
  throughput: number;
  completedParts: number;
  events: SimEvent[];
}

export class VSMSimulationEngine {
  private diagram: VSMDiagram;
  private config: SimulationConfig;
  private events: SimEvent[] = [];
  private nodeRuntimes: Map<string, NodeRuntime> = new Map();
  private parts: Map<string, SimulationPart> = new Map();
  private currentTime = 0;
  private completedParts = 0;
  private snapshots: SimulationSnapshot[] = [];
  private processOrder: string[] = [];

  constructor(diagram: VSMDiagram, config: SimulationConfig) {
    this.diagram = diagram;
    this.config = config;
  }

  initialize(): void {
    this.currentTime = 0;
    this.completedParts = 0;
    this.events = [];
    this.parts.clear();
    this.snapshots = [];

    this.buildNodeRuntimes();
    this.buildProcessOrder();
    this.scheduleInitialArrivals();
  }

  tick(deltaRealSeconds: number): SimulationSnapshot {
    const simDelta = deltaRealSeconds * this.config.speedMultiplier;
    const targetTime = Math.min(this.currentTime + simDelta, this.config.durationSeconds);

    while (this.events.length > 0 && this.events[0].time <= targetTime) {
      const event = this.events.shift()!;
      this.currentTime = event.time;
      this.processEvent(event);
    }

    this.currentTime = targetTime;
    const snapshot = this.buildSnapshot();
    this.snapshots.push(snapshot);
    return snapshot;
  }

  isFinished(): boolean {
    return this.currentTime >= this.config.durationSeconds;
  }

  getSnapshots(): SimulationSnapshot[] {
    return this.snapshots;
  }

  getSummary() {
    const lastSnap = this.snapshots[this.snapshots.length - 1];
    if (!lastSnap) return null;

    const bottleneckId = Array.from(this.nodeRuntimes.values())
      .filter(nr => nr.node.type === 'process')
      .sort((a, b) => {
        const utilA = a.totalProcessed > 0 ? (a.busyUntil / this.config.durationSeconds) : 0;
        const utilB = b.totalProcessed > 0 ? (b.busyUntil / this.config.durationSeconds) : 0;
        return utilB - utilA;
      })[0]?.node.id;

    return {
      totalTime: this.config.durationSeconds,
      completedParts: this.completedParts,
      throughput: this.completedParts / (this.config.durationSeconds / 3600),
      bottleneckNodeId: bottleneckId,
      nodeStates: lastSnap.nodeStates,
    };
  }

  private buildNodeRuntimes(): void {
    this.nodeRuntimes.clear();
    const processTypes = new Set(['process', 'inventory', 'supermarket']);

    for (const node of this.diagram.nodes) {
      if (!processTypes.has(node.type)) continue;
      const pd = node.data.processData;

      this.nodeRuntimes.set(node.id, {
        node,
        queue: [],
        processing: null,
        busyUntil: 0,
        changeoverUntil: 0,
        totalProcessed: 0,
        totalWaitTime: 0,
        cycleTime: pd?.cycleTime ?? 60,
        changeoverTime: pd?.changeoverTime ?? 0,
        uptime: (pd?.uptime ?? 100) / 100,
        batchSize: pd?.batchSize ?? 1,
      });
    }
  }

  private buildProcessOrder(): void {
    const inDegree: Record<string, number> = {};
    const adj: Record<string, string[]> = {};

    for (const id of this.nodeRuntimes.keys()) {
      inDegree[id] = 0;
      adj[id] = [];
    }

    for (const edge of this.diagram.edges) {
      if (this.nodeRuntimes.has(edge.source) && this.nodeRuntimes.has(edge.target)) {
        adj[edge.source].push(edge.target);
        inDegree[edge.target] = (inDegree[edge.target] ?? 0) + 1;
      }
    }

    const queue = Object.entries(inDegree)
      .filter(([, deg]) => deg === 0)
      .map(([id]) => id);

    this.processOrder = [];
    while (queue.length > 0) {
      const id = queue.shift()!;
      this.processOrder.push(id);
      for (const next of (adj[id] ?? [])) {
        inDegree[next]--;
        if (inDegree[next] === 0) queue.push(next);
      }
    }

    if (this.processOrder.length === 0) {
      this.processOrder = Array.from(this.nodeRuntimes.keys());
    }
  }

  private scheduleInitialArrivals(): void {
    const hasIncoming = new Set(this.diagram.edges.map(e => e.target));
    const entryNodes = this.processOrder.filter(id => !hasIncoming.has(id));

    for (const nodeId of entryNodes) {
      const event: SimEvent = { time: 0, type: 'PART_ARRIVE', nodeId, partId: nanoid() };
      this.events.push(event);
    }
  }

  private processEvent(event: SimEvent): void {
    const nodeState = this.nodeRuntimes.get(event.nodeId);
    if (!nodeState) return;

    switch (event.type) {
      case 'PART_ARRIVE':
        nodeState.queue.push(event.partId ?? nanoid());
        this.scheduleNextStart(event.nodeId);
        break;
      case 'PART_START':
        nodeState.processing = event.partId ?? nanoid();
        nodeState.busyUntil = event.time + nodeState.cycleTime;
        this.events.push({
          time: nodeState.busyUntil,
          type: 'PART_FINISH',
          nodeId: event.nodeId,
          partId: nodeState.processing,
        });
        break;
      case 'PART_FINISH':
        nodeState.totalProcessed += 1;
        nodeState.processing = null;
        this.completedParts += 1;
        this.routePartToNext(event);
        break;
      case 'CHANGEOVER_DONE':
        nodeState.changeoverUntil = 0;
        break;
    }
  }

  private scheduleNextStart(nodeId: string): void {
    const nodeState = this.nodeRuntimes.get(nodeId);
    if (!nodeState || nodeState.processing || nodeState.queue.length === 0) return;

    const partId = nodeState.queue.shift()!;
    this.events.push({
      time: Math.max(this.currentTime, nodeState.busyUntil),
      type: 'PART_START',
      nodeId,
      partId,
    });
  }

  private routePartToNext(event: SimEvent): void {
    const nextIndex = this.processOrder.indexOf(event.nodeId) + 1;
    if (nextIndex >= this.processOrder.length) return;

    const nextNodeId = this.processOrder[nextIndex];
    const nextNode = this.nodeRuntimes.get(nextNodeId);
    if (!nextNode) return;

    nextNode.queue.push(event.partId ?? nanoid());
    this.scheduleNextStart(nextNodeId);
  }

  private buildSnapshot(): SimulationSnapshot {
    const nodeStates: Record<string, NodeSimState> = {};
    for (const [nodeId, runtime] of this.nodeRuntimes.entries()) {
      nodeStates[nodeId] = {
        node: runtime.node,
        queueLength: runtime.queue.length,
        utilization: runtime.busyUntil > 0
          ? Math.min(100, Math.round((runtime.busyUntil / Math.max(1, this.currentTime)) * 100))
          : 0,
        totalThroughput: runtime.totalProcessed,
      };
    }

    return {
      time: this.currentTime,
      nodeStates,
      parts: Array.from(this.parts.values()),
      throughput: this.completedParts,
      completedParts: this.completedParts,
      events: [...this.events],
    };
  }
}
