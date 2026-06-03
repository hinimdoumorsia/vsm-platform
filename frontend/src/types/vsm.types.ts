// ============================================================
// VSM Platform — Core Domain Types
// ============================================================

// ------ VSM Node Types (13 standard symbols) ------
export type VSMNodeType =
  | 'supplier'
  | 'customer'
  | 'process'
  | 'dataBox'
  | 'inventory'
  | 'supermarket'
  | 'kaizenburst'
  | 'electronicFlow'
  | 'manualFlow'
  | 'pushArrow'
  | 'pullArrow'
  | 'fifoLane'
  | 'truckShipment';

export type VSMEdgeType =
  | 'pushFlow'
  | 'pullFlow'
  | 'electronicInfo'
  | 'manualInfo'
  | 'fifo';

export type DiagramType = 'CURRENT_STATE' | 'FUTURE_STATE';

export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

// ------ Process Data (per node) ------
export interface ProcessData {
  cycleTime: number;          // seconds
  changeoverTime: number;     // seconds
  uptime: number;             // percentage 0-100
  operators: number;
  batchSize: number;
  inventory?: number;         // units before this process
  shiftTime?: number;         // seconds per shift
  shifts?: number;
  defectRate?: number;        // percentage
}

// ------ VSM Node ------
export interface VSMNode {
  id: string;
  type: VSMNodeType;
  position: { x: number; y: number };
  width: number;
  height: number;
  label: string;
  data: {
    processData?: ProcessData;
    properties?: Record<string, unknown>;
    color?: string;
    is3DVisible?: boolean;
  };
  selected?: boolean;
  dragging?: boolean;
}

// ------ VSM Edge ------
export interface VSMEdge {
  id: string;
  source: string;
  target: string;
  type: VSMEdgeType;
  animated?: boolean;
  label?: string;
  data?: {
    frequency?: string;   // e.g. "daily", "weekly"
    quantity?: number;
  };
}

// ------ VSM Diagram ------
export interface VSMDiagram {
  id: string;
  projectId: string;
  name: string;
  type: DiagramType;
  nodes: VSMNode[];
  edges: VSMEdge[];
  viewport: { x: number; y: number; zoom: number };
  taktTime?: number;        // customer demand rate (seconds/unit)
  customerDemand?: number;  // units per period
  workingTime?: number;     // seconds per period
  createdAt: string;
  updatedAt: string;
}

// ------ VSM Project ------
export interface VSMProject {
  id: string;
  name: string;
  description?: string;
  product?: string;
  ownerId: string;
  currentStateDiagramId?: string;
  futureStateDiagramId?: string;
  createdAt: string;
  updatedAt: string;
}

// ------ KPI Results ------
export interface KPIResult {
  diagramId: string;
  computedAt: string;
  leadTime: number;               // total seconds
  totalCycleTime: number;         // sum of all CT
  valueAddedTime: number;         // sum of VA process CT
  nonValueAddedTime: number;      // leadTime - valueAddedTime
  processCycleEfficiency: number; // VAT / leadTime * 100
  taktTime: number;               // workingTime / customerDemand
  totalWIP: number;               // total units in system
  bottleneckNodeId?: string;      // node with highest CT
  processDetails: ProcessKPI[];
}

export interface ProcessKPI {
  nodeId: string;
  nodeLabel: string;
  cycleTime: number;
  changeoverTime: number;
  uptime: number;
  operators: number;
  availableCapacity: number;      // CT / uptime
  utilizationRate: number;        // CT / taktTime * 100
  isBottleneck: boolean;
  isValueAdded: boolean;
}

// ------ Simulation ------
export type SimulationStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'ERROR';

export interface SimulationConfig {
  durationSeconds: number;
  speedMultiplier: number;        // 1x, 5x, 10x
  showParticles: boolean;
  highlightBottlenecks: boolean;
}

export interface SimulationState {
  status: SimulationStatus;
  currentTime: number;
  parts: SimulationPart[];
  nodeStates: Record<string, NodeSimState>;
  config: SimulationConfig;
}

export interface SimulationPart {
  id: string;
  currentNodeId: string;
  progress: number;               // 0-1 through current process
  position3D: { x: number; y: number; z: number };
  isWaiting: boolean;
  waitTime: number;
}

export interface NodeSimState {
  nodeId: string;
  queueLength: number;
  processingCount: number;
  totalThroughput: number;
  averageWaitTime: number;
  utilization: number;
}

// ------ 3D Scene ------
export interface Scene3DObject {
  nodeId: string;
  type: VSMNodeType;
  position3D: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  color: string;
}

// ------ Export ------
export type ExportFormat = 'PDF' | 'PNG' | 'SVG' | 'JSON' | 'EXCEL';

export interface ExportOptions {
  format: ExportFormat;
  includeKPIs: boolean;
  include3D: boolean;
  includeSimulation: boolean;
  filename?: string;
}