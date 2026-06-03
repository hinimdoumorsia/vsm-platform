// ============================================================
// VSM Platform — Main VSM Editor (React Flow canvas)
// ============================================================
import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap,
  addEdge, NodeChange, EdgeChange, Connection,
  ReactFlowProvider, useReactFlow, Panel,
  BackgroundVariant,
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { nanoid } from 'nanoid';
import { useVSMStore, useActiveDiagram } from '../../store/vsmStore';
import { SYMBOL_REGISTRY } from './symbols';
import { PropertyPanel } from './PropertyPanel';
import { SymbolPalette } from './SymbolPalette';
import type { VSMNode, VSMNodeType } from '../../types/vsm.types';
import { VSMNodeComponent } from './VSMNodeComponent';
import { VSMEdgeComponent } from './VSMEdgeComponent';

// ---- Custom node/edge type maps ----
const nodeTypes = {
  vsmNode: VSMNodeComponent,
};
const edgeTypes = {
  vsmEdge: VSMEdgeComponent,
};

// ---- Editor Inner ----
const VSMEditorInner: React.FC = () => {
  const diagram = useActiveDiagram();
  const {
    addNode, updateNode, deleteNode, setNodes, setEdges, addEdge: storeAddEdge,
    setSelectedNode, selectedNodeId, showGrid, showMinimap, showPropertyPanel,
    computeKPIs,
  } = useVSMStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  if (!diagram) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Ouvrez ou créez un projet VSM pour commencer
      </div>
    );
  }

  // Convert VSMNodes → ReactFlow nodes
  const rfNodes: Node[] = diagram.nodes.map(n => ({
    id: n.id,
    type: 'vsmNode',
    position: n.position,
    data: { ...n.data, vsmType: n.type, label: n.label, selected: n.id === selectedNodeId },
    width: n.width,
    height: n.height,
    selected: n.id === selectedNodeId,
  }));

  const rfEdges: Edge[] = diagram.edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'vsmEdge',
    animated: e.animated,
    label: e.label,
    data: { edgeType: e.type, ...e.data },
  }));

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    changes.forEach(change => {
      if (change.type === 'position' && change.position) {
        updateNode(diagram.id, change.id, { position: change.position });
      }
      if (change.type === 'remove') {
        deleteNode(diagram.id, change.id);
      }
      if (change.type === 'select') {
        setSelectedNode(change.selected ? change.id : null);
      }
    });
  }, [diagram.id, updateNode, deleteNode, setSelectedNode]);

  const onEdgesChange = useCallback((_changes: EdgeChange[]) => {
    // handled by store
  }, []);

  const onConnect = useCallback((params: Connection) => {
    if (!params.source || !params.target) return;
    storeAddEdge(diagram.id, {
      id: nanoid(),
      source: params.source,
      target: params.target,
      type: 'pushFlow',
      animated: true,
    });
    computeKPIs(diagram.id);
  }, [diagram.id, storeAddEdge, computeKPIs]);

  // Drag-and-drop from palette
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const vsmType = event.dataTransfer.getData('application/vsmtype') as VSMNodeType;
    if (!vsmType || !SYMBOL_REGISTRY[vsmType]) return;

    const symbol = SYMBOL_REGISTRY[vsmType];
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: VSMNode = {
      id: nanoid(),
      type: vsmType,
      position,
      width: symbol.defaultWidth,
      height: symbol.defaultHeight,
      label: symbol.label,
      data: {
        processData: vsmType === 'process' ? {
          cycleTime: 60,
          changeoverTime: 0,
          uptime: 100,
          operators: 1,
          batchSize: 1,
        } : undefined,
        properties: {},
        is3DVisible: true,
      },
    };

    addNode(diagram.id, newNode);
    setSelectedNode(newNode.id);
  }, [diagram.id, addNode, setSelectedNode, screenToFlowPosition]);

  return (
    <div className="flex h-full w-full">
      {/* Symbol Palette */}
      <SymbolPalette />

      {/* Canvas */}
      <div ref={reactFlowWrapper} className="flex-1 h-full relative" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          snapToGrid
          snapGrid={[10, 10]}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
        >
          {showGrid && <Background variant={BackgroundVariant.Dots} gap={20} size={1} />}
          <Controls />
          {showMinimap && (
            <MiniMap
              nodeColor={(node) => {
                const type = node.data?.vsmType as VSMNodeType;
                const colors: Partial<Record<VSMNodeType, string>> = {
                  supplier: '#3B82F6', customer: '#F59E0B',
                  process: '#10B981', inventory: '#8B5CF6',
                };
                return colors[type] ?? '#9CA3AF';
              }}
              maskColor="rgba(0,0,0,0.05)"
            />
          )}
          <Panel position="top-right">
            <div className="flex gap-2 bg-white rounded-lg shadow px-3 py-2 text-xs text-gray-600">
              <span>Nœuds: {diagram.nodes.length}</span>
              <span>|</span>
              <span>Connexions: {diagram.edges.length}</span>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Property Panel */}
      {showPropertyPanel && <PropertyPanel />}
    </div>
  );
};

// ---- Main export with provider ----
export const VSMEditor: React.FC = () => (
  <ReactFlowProvider>
    <VSMEditorInner />
  </ReactFlowProvider>
);