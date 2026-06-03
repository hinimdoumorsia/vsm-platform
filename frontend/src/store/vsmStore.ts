// ============================================================
// VSM Platform — Zustand Global Store
// ============================================================
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  VSMProject, VSMDiagram, VSMNode, VSMEdge,
  KPIResult, SimulationState, SimulationConfig,
  DiagramType, ExportOptions, ProcessData
} from '../types/vsm.types';
import { KPICalculator } from '../lib/kpi/KPICalculator';

// ---- Slice interfaces ----

interface ProjectSlice {
  projects: VSMProject[];
  activeProjectId: string | null;
  setActiveProject: (id: string) => void;
  addProject: (project: VSMProject) => void;
  updateProject: (id: string, updates: Partial<VSMProject>) => void;
  deleteProject: (id: string) => void;
}

interface DiagramSlice {
  diagrams: Record<string, VSMDiagram>;
  activeDiagramId: string | null;
  activeDiagramType: DiagramType;
  setActiveDiagram: (id: string) => void;
  setActiveDiagramType: (type: DiagramType) => void;
  addDiagram: (diagram: VSMDiagram) => void;
  updateDiagram: (id: string, updates: Partial<VSMDiagram>) => void;
}

interface NodeSlice {
  setNodes: (diagramId: string, nodes: VSMNode[]) => void;
  addNode: (diagramId: string, node: VSMNode) => void;
  updateNode: (diagramId: string, nodeId: string, updates: Partial<VSMNode>) => void;
  updateNodeProcessData: (diagramId: string, nodeId: string, data: Partial<ProcessData>) => void;
  deleteNode: (diagramId: string, nodeId: string) => void;
  selectedNodeId: string | null;
  setSelectedNode: (id: string | null) => void;
}

interface EdgeSlice {
  setEdges: (diagramId: string, edges: VSMEdge[]) => void;
  addEdge: (diagramId: string, edge: VSMEdge) => void;
  deleteEdge: (diagramId: string, edgeId: string) => void;
}

interface KPISlice {
  kpiResults: Record<string, KPIResult>;
  kpiLoading: boolean;
  computeKPIs: (diagramId: string) => void;
}

interface SimulationSlice {
  simulation: SimulationState;
  startSimulation: (config: SimulationConfig) => void;
  pauseSimulation: () => void;
  stopSimulation: () => void;
  tickSimulation: () => void;
}

interface UISlice {
  view: '2D' | '3D' | 'SPLIT';
  setView: (view: '2D' | '3D' | 'SPLIT') => void;
  showGrid: boolean;
  showMinimap: boolean;
  showKPIPanel: boolean;
  showPropertyPanel: boolean;
  toggleGrid: () => void;
  toggleKPIPanel: () => void;
  togglePropertyPanel: () => void;
  export: (options: ExportOptions) => void;
}

// ---- Store type ----
type VSMStore =
  ProjectSlice & DiagramSlice & NodeSlice &
  EdgeSlice & KPISlice & SimulationSlice & UISlice;

// ---- Store implementation ----
export const useVSMStore = create<VSMStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // ===== PROJECT SLICE =====
        projects: [
          {
            id: 'demo-project',
            name: 'Projet Démo',
            description: 'Diagramme VSM initial pour démarrer',
            product: 'Produit X',
            ownerId: 'demo-user',
            currentStateDiagramId: 'demo-diagram',
            futureStateDiagramId: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        activeProjectId: 'demo-project',

        setActiveProject: (id) => set(state => { state.activeProjectId = id; }),

        addProject: (project) => set(state => {
          state.projects.push(project);
        }),

        updateProject: (id, updates) => set(state => {
          const idx = state.projects.findIndex(p => p.id === id);
          if (idx !== -1) Object.assign(state.projects[idx], updates);
        }),

        deleteProject: (id) => set(state => {
          state.projects = state.projects.filter(p => p.id !== id);
        }),

        // ===== DIAGRAM SLICE =====
        diagrams: {
          'demo-diagram': {
            id: 'demo-diagram',
            projectId: 'demo-project',
            name: 'État courant de démonstration',
            type: 'CURRENT_STATE',
            nodes: [
              {
                id: 'node-supplier',
                type: 'supplier',
                position: { x: 80, y: 220 },
                width: 64,
                height: 64,
                label: 'Fournisseur',
                data: { properties: {}, is3DVisible: true },
              },
              {
                id: 'node-process',
                type: 'process',
                position: { x: 320, y: 220 },
                width: 96,
                height: 64,
                label: 'Processus',
                data: {
                  processData: {
                    cycleTime: 45,
                    changeoverTime: 10,
                    uptime: 90,
                    operators: 2,
                    batchSize: 5,
                  },
                  properties: {},
                  is3DVisible: true,
                },
              },
              {
                id: 'node-inventory',
                type: 'inventory',
                position: { x: 560, y: 220 },
                width: 64,
                height: 64,
                label: 'Stock',
                data: {
                  processData: {
                    inventory: 120,
                  },
                  properties: {},
                  is3DVisible: true,
                },
              },
              {
                id: 'node-customer',
                type: 'customer',
                position: { x: 800, y: 220 },
                width: 64,
                height: 64,
                label: 'Client',
                data: { properties: {}, is3DVisible: true },
              },
            ],
            edges: [
              {
                id: 'edge-1',
                source: 'node-supplier',
                target: 'node-process',
                type: 'pushFlow',
                animated: true,
                label: 'Flux',
                data: {},
              },
              {
                id: 'edge-2',
                source: 'node-process',
                target: 'node-inventory',
                type: 'pushFlow',
                animated: true,
                label: 'Flux',
                data: {},
              },
              {
                id: 'edge-3',
                source: 'node-inventory',
                target: 'node-customer',
                type: 'pushFlow',
                animated: true,
                label: 'Flux',
                data: {},
              },
            ],
            viewport: { x: 0, y: 0, zoom: 1 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
        activeDiagramId: 'demo-diagram',
        activeDiagramType: 'CURRENT_STATE',

        setActiveDiagram: (id) => set(state => { state.activeDiagramId = id; }),

        setActiveDiagramType: (type) => set(state => {
          state.activeDiagramType = type;
        }),

        addDiagram: (diagram) => set(state => {
          state.diagrams[diagram.id] = diagram;
        }),

        updateDiagram: (id, updates) => set(state => {
          if (state.diagrams[id]) {
            Object.assign(state.diagrams[id], updates);
          }
        }),

        // ===== NODE SLICE =====
        selectedNodeId: null,

        setNodes: (diagramId, nodes) => set(state => {
          if (state.diagrams[diagramId]) {
            state.diagrams[diagramId].nodes = nodes;
          }
        }),

        addNode: (diagramId, node) => set(state => {
          state.diagrams[diagramId]?.nodes.push(node);
        }),

        updateNode: (diagramId, nodeId, updates) => set(state => {
          const diagram = state.diagrams[diagramId];
          if (!diagram) return;
          const node = diagram.nodes.find(n => n.id === nodeId);
          if (node) Object.assign(node, updates);
        }),

        updateNodeProcessData: (diagramId, nodeId, data) => set(state => {
          const diagram = state.diagrams[diagramId];
          if (!diagram) return;
          const node = diagram.nodes.find(n => n.id === nodeId);
          if (node) {
            if (!node.data.processData) node.data.processData = {} as ProcessData;
            Object.assign(node.data.processData, data);
          }
        }),

        deleteNode: (diagramId, nodeId) => set(state => {
          const diagram = state.diagrams[diagramId];
          if (!diagram) return;
          diagram.nodes = diagram.nodes.filter(n => n.id !== nodeId);
          diagram.edges = diagram.edges.filter(
            e => e.source !== nodeId && e.target !== nodeId
          );
        }),

        setSelectedNode: (id) => set(state => { state.selectedNodeId = id; }),

        // ===== EDGE SLICE =====
        setEdges: (diagramId, edges) => set(state => {
          if (state.diagrams[diagramId]) {
            state.diagrams[diagramId].edges = edges;
          }
        }),

        addEdge: (diagramId, edge) => set(state => {
          state.diagrams[diagramId]?.edges.push(edge);
        }),

        deleteEdge: (diagramId, edgeId) => set(state => {
          const diagram = state.diagrams[diagramId];
          if (diagram) {
            diagram.edges = diagram.edges.filter(e => e.id !== edgeId);
          }
        }),

        // ===== KPI SLICE =====
        kpiResults: {},
        kpiLoading: false,

        computeKPIs: (diagramId) => {
          const diagram = get().diagrams[diagramId];
          if (!diagram) return;

          set(state => { state.kpiLoading = true; });

          const calculator = new KPICalculator(diagram);
          const result = calculator.compute();

          set(state => {
            state.kpiResults[diagramId] = result;
            state.kpiLoading = false;
          });
        },

        // ===== SIMULATION SLICE =====
        simulation: {
          status: 'IDLE',
          currentTime: 0,
          parts: [],
          nodeStates: {},
          config: {
            durationSeconds: 3600,
            speedMultiplier: 1,
            showParticles: true,
            highlightBottlenecks: true,
          },
        },

        startSimulation: (config) => set(state => {
          state.simulation.status = 'RUNNING';
          state.simulation.config = config;
          state.simulation.currentTime = 0;
          state.simulation.parts = [];
        }),

        pauseSimulation: () => set(state => {
          state.simulation.status =
            state.simulation.status === 'RUNNING' ? 'PAUSED' : 'RUNNING';
        }),

        stopSimulation: () => set(state => {
          state.simulation.status = 'IDLE';
          state.simulation.currentTime = 0;
          state.simulation.parts = [];
          state.simulation.nodeStates = {};
        }),

        tickSimulation: () => set(state => {
          if (state.simulation.status !== 'RUNNING') return;
          state.simulation.currentTime +=
            (1 / 60) * state.simulation.config.speedMultiplier;
        }),

        // ===== UI SLICE =====
        view: '2D',
        showGrid: true,
        showMinimap: true,
        showKPIPanel: true,
        showPropertyPanel: true,

        setView: (view) => set(state => { state.view = view; }),
        toggleGrid: () => set(state => { state.showGrid = !state.showGrid; }),
        toggleKPIPanel: () => set(state => { state.showKPIPanel = !state.showKPIPanel; }),
        togglePropertyPanel: () => set(state => {
          state.showPropertyPanel = !state.showPropertyPanel;
        }),

        export: (_options: ExportOptions) => {
          // Delegated to ExportService
          console.info('Export triggered', _options);
        },
      })),
      {
        name: 'vsm-store',
        partialize: (state) => ({
          projects: state.projects,
          diagrams: state.diagrams,
          activeProjectId: state.activeProjectId,
          view: state.view,
        }),
      }
    )
  )
);

// ---- Selectors ----
export const useActiveDiagram = () => {
  const { diagrams, activeDiagramId } = useVSMStore();

  if (activeDiagramId && diagrams[activeDiagramId]) {
    return diagrams[activeDiagramId];
  }

  const firstDiagram = Object.values(diagrams)[0] ?? null;
  return firstDiagram;
};

export const useActiveKPIs = () => {
  const { kpiResults, activeDiagramId } = useVSMStore();
  return activeDiagramId ? kpiResults[activeDiagramId] : null;
};

export const useSelectedNode = () => {
  const { diagrams, activeDiagramId, selectedNodeId } = useVSMStore();
  if (!activeDiagramId || !selectedNodeId) return null;
  return diagrams[activeDiagramId]?.nodes.find(n => n.id === selectedNodeId) ?? null;
};