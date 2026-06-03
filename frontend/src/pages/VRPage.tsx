import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VrScene } from '../components/VR/VrScene';
import { VrUI } from '../components/VR/VrUI';
import { useVrTelemetry } from '../services/vrWebSocket';

export default function VRPage() {
  const machines = useVrTelemetry();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedMachine = machines.find((machine) => machine.id === selectedId);

  return (
    <div className="h-screen w-screen relative bg-slate-950 text-white">
      <VrScene machines={machines} selectedId={selectedId} onSelect={setSelectedId} />
      <VrUI selectedMachine={selectedMachine} />

      <div className="absolute top-4 left-4 z-30">
        <Link
          to="/"
          className="rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-2 text-sm font-medium text-white shadow-2xl backdrop-blur-xl transition hover:bg-slate-800"
        >
          ← Retour à l’interface standard
        </Link>
      </div>

      <div className="absolute bottom-4 left-4 z-30 rounded-3xl bg-slate-900/90 px-4 py-3 text-xs text-slate-300 shadow-2xl backdrop-blur-xl">
        <div className="font-semibold text-white">Guide VR</div>
        <div className="mt-2 space-y-1">
          <div>• Pointez une machine avec votre contrôleur</div>
          <div>• Appuyez sur le déclencheur pour sélectionner</div>
          <div>• Téléportez-vous en pointant le sol</div>
          <div>• Les alertes critiques apparaissent ici</div>
        </div>
      </div>
    </div>
  );
}
