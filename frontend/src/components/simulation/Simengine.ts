// ============================================================
// VSM Platform — Discrete Event Simulation Engine
// ============================================================
import { nanoid } from 'nanoid';
import type {
  VSMDiagram, VSMNode, SimulationState, SimulationConfig,
  SimulationPart, NodeSimState,
} from '../../types/vsm.types';

// ---- Event types ----
type EventType = 'PART_ARRIVE' | 'PART_START' | 'PART_FINISH' | 'CHANGEOVER_DONE';

interface SimEvent {
  time: number;
  type: EventType;
  nodeId: string;
  partId?: string;
}

// ---- Node runtime state ----
interface NodeRuntime {
  node: VSMNode;
  queue: string[];            // part IDs waiting
  processing: string | null;  // current part
  busyUntil: number;
  changeoverUntil: number;
  totalProcessed: number;
  totalWaitTime: number;
  cycleTime: number;
  changeoverTime: number;
  uptime: number;
  batchSize: number;
}

// ---- Simulation result snapshot ----
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

  // Ordered process nodes (topological sort via edges)
  private processOrder: string[] = [];

  constructor(diagram: VSMDiagram, config: SimulationConfig) {
    this.diagram = diagram;
    this.config = config;
  }

  // ---- Public API ----

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

  /**
   * Advance simulation by `deltaSeconds` real seconds × speedMultiplier.
   * Returns a snapshot of current state.
   */
  tick(deltaRealSeconds: number): SimulationSnapshot {
    const simDelta = deltaRealSeconds * this.config.speedMultiplier;
    const targetTime = Math.min(
      this.currentTime + simDelta,
      this.config.durationSeconds
    );

    // Process all events up to targetTime
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
        const utilA = a.totalProcessed > 0
          ? (a.busyUntil / this.config.durationSeconds) : 0;
        const utilB = b.totalProcessed > 0
          ? (b.busyUntil / this.config.durationSeconds) : 0;
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

  // ---- Private: build ----

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
    // Simple topological sort via edge traversal
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

    // Fallback: just use insertion order
    if (this.processOrder.length === 0) {
      this.processOrder = Array.from(this.nodeRuntimes.keys());
    }
  }

  private scheduleInitialArrivals(): void {
    // Schedule first part arrival at each entry node (no incoming edges)
    const hasIncoming = new Set(this.diagram.edges.map(e => e.target));
    const entryNodes = this.processOrder.filter(id => !hasIncoming.has(id));

    for (const nodeId of entryNodes) {
      const nr = this.nodeRuntimes.get(nodeId);
      if (!nr) continue;

      // Schedule arrivals based on takt time or CT
      const interval = this.diagram.taktTime ?? nr.cycleTime;
      let t = 0;
      while (t <= this.config.durationSeconds) {
        this.scheduleEvent({ time: t, type: 'PART_ARRIVE', nodeId });
        t += interval;
      }
    }
  }

  // ---- Private: event processing ----

  private processEvent(event: SimEvent): void {
    switch (event.type) {
      case 'PART_ARRIVE':
        this.handlePartArrive(event);
        break;
      case 'PART_START':
        this.handlePartStart(event);
        break;
      case 'PART_FINISH':
        this.handlePartFinish(event);
        break;
      case 'CHANGEOVER_DONE':
        this.handleChangeoverDone(event);
        break;
    }
  }

  private handlePartArrive(event: SimEvent): void {
    const nr = this.nodeRuntimes.get(event.nodeId);
    if (!nr) return;

    const partId = nanoid(8);
    const part: SimulationPart = {
      id: partId,
      currentNodeId: event.nodeId,
      progress: 0,
      position3D: this.getNode3DPosition(event.nodeId),
      isWaiting: true,
      waitTime: 0,
    };
    this.parts.set(partId, part);
    nr.queue.push(partId);

    // Try to start processing immediately
    if (!nr.processing && this.currentTime >= nr.changeoverUntil) {
      this.scheduleEvent({
        time: this.currentTime,
        type: 'PART_START',
        nodeId: event.nodeId,
        partId,
      });
    }
  }

  private handlePartStart(event: SimEvent): void {
    const nr = this.nodeRuntimes.get(event.nodeId);
    if (!nr || nr.queue.length === 0) return;
    if (nr.processing) return; // busy

    const partId = nr.queue.shift()!;
    nr.processing = partId;

    const part = this.parts.get(partId);
    if (part) {
      part.isWaiting = false;
      part.progress = 0;
    }

    // Effective CT adjusted for uptime (breakdown model)
    const effectiveCT = nr.uptime > 0 ? nr.cycleTime / nr.uptime : nr.cycleTime;
    const finishTime = this.currentTime + effectiveCT;
    nr.busyUntil = finishTime;

    this.scheduleEvent({
      time: finishTime,
      type: 'PART_FINISH',
      nodeId: event.nodeId,
      partId,
    });
  }

  private handlePartFinish(event: SimEvent): void {
    const nr = this.nodeRuntimes.get(event.nodeId);
    if (!nr || !event.partId) return;

    nr.processing = null;
    nr.totalProcessed++;

    const part = this.parts.get(event.partId);

    // Move part to next node or complete
    const nextNodeId = this.getNextNode(event.nodeId);
    if (nextNodeId) {
      const nextNR = this.nodeRuntimes.get(nextNodeId);
      if (nextNR && part) {
        part.currentNodeId = nextNodeId;
        part.progress = 0;
        part.isWaiting = true;
        nextNR.queue.push(event.partId);

        this.scheduleEvent({
          time: this.currentTime,
          type: 'PART_START',
          nodeId: nextNodeId,
          partId: event.partId,
        });
      }
    } else {
      // Part exits the system
      this.completedParts++;
      this.parts.delete(event.partId);
    }

    // Schedule changeover if needed
    if (nr.changeoverTime > 0) {
      const changeoverEnd = this.currentTime + nr.changeoverTime;
      nr.changeoverUntil = changeoverEnd;
      this.scheduleEvent({
        time: changeoverEnd,
        type: 'CHANGEOVER_DONE',
        nodeId: event.nodeId,
      });
    } else if (nr.queue.length > 0) {
      // Start next part immediately
      this.scheduleEvent({
        time: this.currentTime,
        type: 'PART_START',
        nodeId: event.nodeId,
      });
    }
  }

  private handleChangeoverDone(event: SimEvent): void {
    const nr = this.nodeRuntimes.get(event.nodeId);
    if (!nr) return;
    if (nr.queue.length > 0 && !nr.processing) {
      this.scheduleEvent({
        time: this.currentTime,
        type: 'PART_START',
        nodeId: event.nodeId,
      });
    }
  }

  // ---- Private: helpers ----

  private scheduleEvent(event: SimEvent): void {
    // Insert sorted by time
    const idx = this.events.findIndex(e => e.time > event.time);
    if (idx === -1) {
      this.events.push(event);
    } else {
      this.events.splice(idx, 0, event);
    }
  }

  private getNextNode(nodeId: string): string | null {
    const edges = this.diagram.edges.filter(e => e.source === nodeId);
    if (edges.length === 0) return null;
    // Pick first outgoing edge that leads to a runtime node
    for (const edge of edges) {
      if (this.nodeRuntimes.has(edge.target)) return edge.target;
    }
    return null;
  }

  private getNode3DPosition(nodeId: string): { x: number; y: number; z: number } {
    const node = this.diagram.nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0, z: 0 };
    return {
      x: (node.position.x / 2000) * 40 - 20,
      y: 0.3,
      z: (node.position.y / 1500) * 30 - 15,
    };
  }

  private buildSnapshot(): SimulationSnapshot {
    const nodeStates: Record<string, NodeSimState> = {};

    for (const [id, nr] of this.nodeRuntimes) {
      const utilization = this.currentTime > 0
        ? Math.min(100, (nr.busyUntil / this.currentTime) * 100)
        : 0;

      nodeStates[id] = {
        nodeId: id,
        queueLength: nr.queue.length,
        processingCount: nr.processing ? 1 : 0,
        totalThroughput: nr.totalProcessed,
        averageWaitTime: nr.totalProcessed > 0
          ? nr.totalWaitTime / nr.totalProcessed : 0,
        utilization: Math.round(utilization * 10) / 10,
      };
    }

    // Update part progress
    const partsArray: SimulationPart[] = Array.from(this.parts.values()).map(p => {
      const nr = this.nodeRuntimes.get(p.currentNodeId);
      let progress = 0;
      if (nr && nr.processing === p.id && nr.cycleTime > 0) {
        const elapsed = this.currentTime - (nr.busyUntil - nr.cycleTime / nr.uptime);
        progress = Math.min(1, elapsed / (nr.cycleTime / nr.uptime));
      }
      return { ...p, progress };
    });

    const throughput = this.currentTime > 0
      ? (this.completedParts / this.currentTime) * 3600 : 0;

    return {
      time: this.currentTime,
      nodeStates,
      parts: partsArray,
      throughput: Math.round(throughput * 10) / 10,
      completedParts: this.completedParts,
      events: [...this.events.slice(0, 5)], // preview next 5 events
    };
  }
}