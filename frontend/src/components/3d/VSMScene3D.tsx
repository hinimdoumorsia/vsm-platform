// ============================================================
// VSM Platform — 3D Scene (React Three Fiber + Three.js)
// Synchronized with VSM diagram via Zustand store
// ============================================================
import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import {
  OrbitControls, Grid, Text, Html,
  RoundedBox, Cone, Line,
} from '@react-three/drei';
import { XR, Interactive, createXRStore } from '@react-three/xr';
import * as THREE from 'three';
import { useVSMStore, useActiveDiagram } from '../../store/vsmStore';
import type { VSMNode, VSMNodeType } from '../../types/vsm.types';

// ---- Color mapping per VSM type ----
const NODE_COLORS: Record<VSMNodeType, string> = {
  supplier:       '#3B82F6',
  customer:       '#F59E0B',
  process:        '#10B981',
  dataBox:        '#6B7280',
  inventory:      '#8B5CF6',
  supermarket:    '#A855F7',
  kaizenburst:    '#EF4444',
  electronicFlow: '#3B82F6',
  manualFlow:     '#6B7280',
  pushArrow:      '#1E40AF',
  pullArrow:      '#831843',
  fifoLane:       '#065F46',
  truckShipment:  '#B45309',
};

// ---- Convert 2D canvas coords → 3D world coords ----
function to3D(x: number, y: number, canvasWidth = 2000, canvasHeight = 1500) {
  return {
    x: (x / canvasWidth) * 40 - 20,
    y: 0,
    z: (y / canvasHeight) * 30 - 15,
  };
}

function VRStartButton({ store }: { store: ReturnType<typeof createXRStore> }) {
  return (
    <button
      type="button"
      className="absolute right-4 top-4 z-10 rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-black/20 hover:bg-blue-500"
      onClick={() => store.enterVR().catch(() => undefined)}
    >
      Entrer en VR
    </button>
  );
}

// ---- 3D Process Machine ----
const ProcessMachine: React.FC<{ node: VSMNode; selected: boolean; onClick: () => void }> = ({
  node, selected, onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const pos = to3D(node.position.x, node.position.y);
  const color = NODE_COLORS[node.type] ?? '#9CA3AF';
  const pd = node.data.processData;

  // Pulse animation on selected
  useFrame((_, delta) => {
    if (selected && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Interactive onSelect={onClick}>
      <group position={[pos.x, 0, pos.z]} onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); }}>
        {/* Machine body */}
        <RoundedBox ref={meshRef} args={[2.2, 1.6, 2.2]} radius={0.12} castShadow>
          <meshStandardMaterial
            color={color}
            metalness={0.4}
            roughness={0.5}
            emissive={selected ? color : '#000000'}
            emissiveIntensity={selected ? 0.25 : 0}
          />
        </RoundedBox>

      {/* Machine top indicator (utilization) */}
      {pd && (
        <mesh position={[0, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.6, 12]} />
          <meshStandardMaterial
            color={pd.uptime > 85 ? '#22C55E' : pd.uptime > 60 ? '#F59E0B' : '#EF4444'}
          />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.28}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {node.label}
      </Text>

      {/* Data tooltip on hover */}
      {selected && pd && (
        <Html position={[1.5, 0.5, 0]} distanceFactor={10}>
          <div className="bg-gray-900 text-white text-xs rounded px-2 py-1.5 min-w-[120px] shadow-xl">
            <div className="font-semibold mb-1">{node.label}</div>
            <div>CT: {pd.cycleTime}s</div>
            <div>CO: {pd.changeoverTime}s</div>
            <div>Up: {pd.uptime}%</div>
            <div>Ops: {pd.operators}</div>
          </div>
        </Html>
      )}
      </group>
    </Interactive>
  );
};

// ---- 3D Inventory Triangle ----
const InventoryMarker: React.FC<{ node: VSMNode; onClick: () => void }> = ({ node, onClick }) => {
  const pos = to3D(node.position.x, node.position.y);
  const qty = node.data.processData?.inventory ?? 0;
  const height = Math.max(0.6, Math.min(3, qty / 50));

  return (
    <Interactive onSelect={onClick}>
      <group position={[pos.x, 0, pos.z]} onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onClick(); }}>
        <Cone args={[0.9, height, 6]} position={[0, height / 2, 0]} castShadow>
          <meshPhysicalMaterial color="#8B5CF6" metalness={0.45} roughness={0.35} clearcoat={0.2} />
        </Cone>
        <Text position={[0, height + 0.3, 0]} fontSize={0.22} color="#8B5CF6" anchorX="center">
          {qty} units
        </Text>
      </group>
    </Interactive>
  );
};

// ---- 3D Flow Connector (conveyor) ----
const FlowConnector: React.FC<{ source: VSMNode; target: VSMNode; animated: boolean }> = ({
  source, target, animated,
}) => {
  const s = to3D(source.position.x, source.position.y);
  const t = to3D(target.position.x, target.position.y);
  const particleRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (animated && particleRef.current) {
      const t_ = (clock.elapsedTime * 0.3) % 1;
      particleRef.current.position.x = s.x + (t.x - s.x) * t_;
      particleRef.current.position.z = s.z + (t.z - s.z) * t_;
    }
  });

  const points = [
    new THREE.Vector3(s.x, 0.1, s.z),
    new THREE.Vector3(t.x, 0.1, t.z),
  ];
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [s.x, s.z, t.x, t.z]);

  return (
    <group>
      <Line
        points={[[s.x, 0.1, s.z], [t.x, 0.1, t.z]]}
        color="#3B82F6"
        lineWidth={2}
        transparent
        opacity={0.6}
      />
      {animated && (
        <mesh ref={particleRef} position={[s.x, 0.2, s.z]} castShadow>
          <sphereGeometry args={[0.15, 8, 8]}/>
          <meshStandardMaterial color="#60A5FA" emissive="#60A5FA" emissiveIntensity={0.5}/>
        </mesh>
      )}
    </group>
  );
};

// ---- Scene content ----
const SceneContent: React.FC = () => {
  const diagram = useActiveDiagram();
  const { setSelectedNode, selectedNodeId } = useVSMStore();

  if (!diagram) return null;

  const nodeMap = useMemo(() => {
    const m: Record<string, VSMNode> = {};
    diagram.nodes.forEach(n => { m[n.id] = n; });
    return m;
  }, [diagram.nodes]);

  return (
    <>
      <hemisphereLight intensity={0.8} color="#ffffff" groundColor="#444444" />
      <ambientLight intensity={0.7}/>
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, 5, -5]} intensity={0.6} color="#60A5FA"/>

      <Grid
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#374151"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#6B7280"
        fadeDistance={50}
        infiniteGrid
        position={[0, -0.01, 0]}
      />

      {/* Render nodes by type */}
      {diagram.nodes.filter(n => n.data.is3DVisible !== false).map(node => {
        if (node.type === 'inventory' || node.type === 'supermarket') {
          return (
            <InventoryMarker
              key={node.id}
              node={node}
              onClick={() => setSelectedNode(node.id)}
            />
          );
        }
        if (['electronicFlow', 'manualFlow', 'pushArrow', 'pullArrow', 'fifoLane'].includes(node.type)) {
          return null; // Flows rendered as edges
        }
        return (
          <ProcessMachine
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onClick={() => setSelectedNode(node.id)}
          />
        );
      })}

      {/* Render edges as flow connectors */}
      {diagram.edges.map(edge => {
        const src = nodeMap[edge.source];
        const tgt = nodeMap[edge.target];
        if (!src || !tgt) return null;
        return (
          <FlowConnector
            key={edge.id}
            source={src}
            target={tgt}
            animated={edge.animated ?? false}
          />
        );
      })}

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </>
  );
};

// ---- Main 3D View export ----
export const VSMScene3D: React.FC = () => {
  const xrStore = useMemo(() => createXRStore(), []);

  return (
    <div className="relative h-full w-full bg-gray-950 rounded-lg overflow-hidden">
      <VRStartButton store={xrStore} />
      <Canvas
        shadows
        camera={{ position: [0, 16, 28], fov: 55, near: 0.1, far: 300 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <XR store={xrStore}>
            <SceneContent />
          </XR>
        </Suspense>
      </Canvas>
    </div>
  );
};