import React from 'react';
import { TeleportArea } from '@react-three/xr';
import { Grid } from '@react-three/drei';
import { Machine3D } from './Machine3D';
import type { MachineTelemetry } from '../../services/vrWebSocket';

interface FactoryFloorplanProps {
  machines: MachineTelemetry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function FactoryFloorplan({ machines, selectedId, onSelect }: FactoryFloorplanProps) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#161f2c" roughness={0.94} metalness={0.05} />
      </mesh>

      <TeleportArea>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[24, 24]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
      </TeleportArea>

      <Grid
        args={[24, 24]}
        cellSize={1}
        sectionSize={3}
        fadeDistance={30}
        color="#3b5169"
        sectionColor="#2c4258"
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {machines.map((machine) => (
        <Machine3D key={machine.id} machine={machine} selected={selectedId === machine.id} onSelect={onSelect} />
      ))}

      {[
        [-10.5, -3],
        [10.5, -3],
        [-10.5, 3],
        [10.5, 3],
      ].map(([x, z], index) => (
        <mesh key={`pillar-${index}`} position={[x, 1.5, z]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 3, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
