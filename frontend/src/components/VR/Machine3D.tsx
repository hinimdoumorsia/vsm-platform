import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Interactive } from '@react-three/xr';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { MachineTelemetry } from '../../services/vrWebSocket';

interface Machine3DProps {
  machine: MachineTelemetry;
  selected: boolean;
  onSelect: (id: string) => void;
}

function getMachineColor(health: number) {
  if (health >= 80) return '#22c55e';
  if (health >= 50) return '#f59e0b';
  return '#ef4444';
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'critical':
      return 'CRITIQUE';
    case 'warning':
      return 'ATTENTION';
    default:
      return 'OK';
  }
}

export function Machine3D({ machine, selected, onSelect }: Machine3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const vibrationStrength = Math.min(machine.vibration / 80, 0.18);
    meshRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 6) * vibrationStrength;
    meshRef.current.rotation.y += state.clock.getDelta() * 0.18;
  });

  return (
    <group position={[machine.position.x, 0, machine.position.z]}>
      <Interactive onSelect={() => onSelect(machine.id)}>
        <mesh ref={meshRef} castShadow receiveShadow>
          <boxGeometry args={[1.3, 1.3, 1.3]} />
          <meshStandardMaterial color={getMachineColor(machine.health)} metalness={0.45} roughness={0.35} />
        </mesh>
      </Interactive>

      <Html position={[0, 1.25, 0]} center distanceFactor={10}> 
        <div className="rounded-full border border-white/20 bg-slate-950/80 px-2 py-1 text-center text-[10px] text-white backdrop-blur-sm">
          <span className="font-semibold">{machine.name}</span>
        </div>
      </Html>

      <Html position={[0, 1.75, 0]} center distanceFactor={10} occlude>
        <div className="w-24 rounded-2xl bg-slate-900/90 p-2 text-[11px] text-white shadow-xl backdrop-blur-lg">
          <div className="mb-1 font-semibold">Santé</div>
          <div className="h-2 w-full rounded-full bg-slate-700">
            <div
              className="h-full rounded-full"
              style={{ width: `${machine.health}%`, backgroundColor: getMachineColor(machine.health) }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-300">
            <span>{machine.temperature.toFixed(0)}°C</span>
            <span>{getStatusLabel(machine.status)}</span>
          </div>
        </div>
      </Html>

      {selected && (
        <Html position={[0, 2.55, 0]} center distanceFactor={10} occlude>
          <div className="w-56 rounded-3xl border border-white/10 bg-slate-950/95 p-3 text-[12px] text-white shadow-2xl backdrop-blur-xl">
            <div className="mb-2 text-sm font-semibold">Détails machine</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Température</span>
                <span className="font-semibold">{machine.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Vibration</span>
                <span className="font-semibold">{machine.vibration.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Prédiction</span>
                <span className="font-semibold">{machine.prediction}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Statut</span>
                <span className="font-semibold uppercase">{machine.status}</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
