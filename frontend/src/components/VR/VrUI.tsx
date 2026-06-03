import React from 'react';
import type { MachineTelemetry } from '../../services/vrWebSocket';

interface VrUIProps {
  selectedMachine?: MachineTelemetry;
}

export function VrUI({ selectedMachine }: VrUIProps) {
  return (
    <div className="pointer-events-none absolute left-4 top-4 z-30 w-full max-w-sm">
      <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-4 text-sm text-slate-100 shadow-2xl backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-white">Tableau de bord VR</div>
            <div className="text-xs text-slate-400">Sélectionnez une machine avec vos contrôleurs VR.</div>
          </div>
          <div className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase text-slate-950">
            WebXR</div>
        </div>

        {selectedMachine ? (
          <div className="space-y-3">
            <div className="rounded-2xl bg-slate-900/90 p-3">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Machine</div>
              <div className="mt-1 font-semibold text-white">{selectedMachine.name}</div>
            </div>
            <div className="grid gap-2 text-[12px]">
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 p-3">
                <span>Température</span>
                <span className="font-semibold">{selectedMachine.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 p-3">
                <span>Vibration</span>
                <span className="font-semibold">{selectedMachine.vibration.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 p-3">
                <span>Prédiction</span>
                <span className="font-semibold">{selectedMachine.prediction}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 p-3">
                <span>État</span>
                <span className={`font-semibold ${selectedMachine.status === 'critical' ? 'text-rose-400' : selectedMachine.status === 'warning' ? 'text-amber-300' : 'text-emerald-300'}`}>
                  {selectedMachine.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-900/80 p-4 text-[12px] text-slate-300">
            Aucune machine sélectionnée. Pointez une machine dans le monde VR et appuyez sur le déclencheur pour afficher les détails.
          </div>
        )}
      </div>
    </div>
  );
}
