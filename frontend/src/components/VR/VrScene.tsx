import React, { Suspense, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { VRCanvas, Hands } from '@react-three/xr';
import { Environment, Sky } from '@react-three/drei';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { FactoryFloorplan } from './FactoryFloorplan';
import { VrController } from './VrController';
import type { MachineTelemetry } from '../../services/vrWebSocket';

function WebXRButton() {
  const { gl } = useThree();

  useEffect(() => {
    if (!gl) return;
    const button = VRButton.createButton(gl);
    document.body.appendChild(button);
    return () => {
      button.remove();
    };
  }, [gl]);

  return null;
}

interface VrSceneProps {
  machines: MachineTelemetry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function VrScene({ machines, selectedId, onSelect }: VrSceneProps) {
  return (
    <div className="relative h-full w-full bg-slate-950">
      <VRCanvas
        shadows
        gl={{ antialias: true }}
        className="h-full w-full"
        xr={{ sessionInit: { optionalFeatures: ['local-floor', 'bounded-floor'] } }}
      >
        <color attach="background" args={['#0b1320']} />
        <hemisphereLight skyColor="#e0f7ff" groundColor="#10182c" intensity={0.5} />
        <directionalLight
          position={[10, 12, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Suspense fallback={null}>
          <Environment preset="warehouse" />
        </Suspense>

        <Sky distance={450000} sunPosition={[1, 1, 0.8]} inclination={0.45} azimuth={0.3} />
        <WebXRButton />
        <FactoryFloorplan machines={machines} selectedId={selectedId} onSelect={onSelect} />
        <Hands />
        <VrController />
      </VRCanvas>
    </div>
  );
}
