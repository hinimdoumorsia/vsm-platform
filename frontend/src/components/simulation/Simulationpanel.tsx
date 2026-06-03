// ============================================================
// VSM Platform — Simulation Panel UI
// ============================================================
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useVSMStore, useActiveDiagram } from '../../store/vsmStore';
import { VSMSimulationEngine, SimulationSnapshot } from '../../lib/simulation/SimEngine';
import type { SimulationConfig } from '../../types/vsm.types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

const DEFAULT_CONFIG: SimulationConfig = {
  durationSeconds: 3600,
  speedMultiplier: 10,
  showParticles: true,
  highlightBottlenecks: true,
};

// ---- Speed selector ----
const SPEEDS = [1, 5, 10, 50, 100];

// ---- Stat card ----
const StatCard: React.FC<{ label: string; value: string; color?: string }> = ({
  label, value, color = '#3B82F6',
}) => (
  <div className="bg-gray-800 rounded-lg p-3 flex flex-col gap-0.5">
    <span className="text-[9px] text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-xl font-bold font-mono" style={{ color }}>{value}</span>
  </div>
);

// ---- Progress bar ----
const ProgressBar: React.FC<{ value: number; color?: string }> = ({
  value, color = '#3B82F6',
}) => (
  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, value)}%`, background: color }}
    />
  </div>
);

// ---- Node state row ----
const NodeStateRow: React.FC<{
  nodeId: string;
  state: { queueLength: number; utilization: number; totalThroughput: number };
  label: string;
}> = ({ label, state }) => {
  const util = state.utilization;
  const color = util > 90 ? '#EF4444' : util > 70 ? '#F59E0B' : '#10B981';

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-gray-700 last:border-0">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}/>
      <span className="text-[10px] text-gray-300 flex-1 truncate">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-gray-500">Queue:{state.queueLength}</span>
        <div className="w-16">
          <ProgressBar value={util} color={color}/>
        </div>
        <span className="text-[10px] font-mono font-semibold w-8 text-right" style={{ color }}>
          {util.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

// ---- Main Simulation Panel ----
export const SimulationPanel: React.FC = () => {
  const diagram = useActiveDiagram();
  const { simulation, startSimulation, pauseSimulation, stopSimulation } = useVSMStore();

  const engineRef = useRef<VSMSimulationEngine | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [snapshot, setSnapshot] = useState<SimulationSnapshot | null>(null);
  const [history, setHistory] = useState<{ time: number; throughput: number; parts: number }[]>([]);
  const [nodeLabels, setNodeLabels] = useState<Record<string, string>>({});

  // Build node label map
  useEffect(() => {
    if (!diagram) return;
    const labels: Record<string, string> = {};
    diagram.nodes.forEach(n => { labels[n.id] = n.label; });
    setNodeLabels(labels);
  }, [diagram]);

  // Animation loop
  const tick = useCallback((timestamp: number) => {
    if (!engineRef.current || simulation.status !== 'RUNNING') return;

    const delta = lastTimeRef.current > 0
      ? (timestamp - lastTimeRef.current) / 1000
      : 1 / 60;
    lastTimeRef.current = timestamp;

    const snap = engineRef.current.tick(delta);
    setSnapshot(snap);

    // Record history every ~2 sim seconds
    setHistory(prev => {
      if (prev.length === 0 || snap.time - prev[prev.length - 1].time >= 60) {
        return [...prev.slice(-60), {
          time: Math.round(snap.time / 60),
          throughput: snap.throughput,
          parts: snap.completedParts,
        }];
      }
      return prev;
    });

    if (engineRef.current.isFinished()) {
      stopSimulation();
      return;
    }

    animFrameRef.current = requestAnimationFrame(tick);
  }, [simulation.status, stopSimulation]);

  useEffect(() => {
    if (simulation.status === 'RUNNING') {
      lastTimeRef.current = 0;
      animFrameRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [simulation.status, tick]);

  const handleStart = () => {
    if (!diagram) return;
    const engine = new VSMSimulationEngine(diagram, config);
    engine.initialize();
    engineRef.current = engine;
    setHistory([]);
    setSnapshot(null);
    startSimulation(config);
  };

  const handleStop = () => {
    cancelAnimationFrame(animFrameRef.current);
    engineRef.current = null;
    stopSimulation();
    setSnapshot(null);
    setHistory([]);
  };

  const progress = config.durationSeconds > 0
    ? ((snapshot?.time ?? 0) / config.durationSeconds) * 100
    : 0;
  const isRunning = simulation.status === 'RUNNING';
  const isPaused = simulation.status === 'PAUSED';
  const isIdle = simulation.status === 'IDLE';

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Moteur de Simulation</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Simulation à événements discrets VSM
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${
            isRunning ? 'bg-green-400 animate-pulse' :
            isPaused ? 'bg-amber-400' : 'bg-gray-600'
          }`}/>
          <span className="text-[10px] text-gray-400">
            {isRunning ? 'En cours' : isPaused ? 'Pause' : 'Arrêté'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Config panel (only when idle) */}
        {isIdle && (
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest">
                Durée de simulation
              </label>
              <select
                value={config.durationSeconds}
                onChange={e => setConfig(c => ({ ...c, durationSeconds: Number(e.target.value) }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-200 outline-none focus:border-blue-500"
              >
                <option value={1800}>30 minutes</option>
                <option value={3600}>1 heure</option>
                <option value={28800}>8 heures (1 poste)</option>
                <option value={86400}>24 heures</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 uppercase tracking-widest">
                Vitesse (×)
              </label>
              <div className="flex gap-2">
                {SPEEDS.map(s => (
                  <button
                    key={s}
                    onClick={() => setConfig(c => ({ ...c, speedMultiplier: s }))}
                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      config.speedMultiplier === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    ×{s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showParticles}
                  onChange={e => setConfig(c => ({ ...c, showParticles: e.target.checked }))}
                  className="accent-blue-500"
                />
                <span className="text-xs text-gray-300">Afficher les particules 3D</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.highlightBottlenecks}
                  onChange={e => setConfig(c => ({ ...c, highlightBottlenecks: e.target.checked }))}
                  className="accent-blue-500"
                />
                <span className="text-xs text-gray-300">Surligner les goulets</span>
              </label>
            </div>
          </div>
        )}

        {/* Live stats */}
        {!isIdle && snapshot && (
          <div className="p-4 space-y-4">
            {/* Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Progression</span>
                <span>
                  {Math.round(snapshot.time / 60)}min / {config.durationSeconds / 60}min
                </span>
              </div>
              <ProgressBar value={progress} color="#3B82F6"/>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-2">
              <StatCard
                label="Pièces terminées"
                value={String(snapshot.completedParts)}
                color="#10B981"
              />
              <StatCard
                label="Débit (pcs/h)"
                value={snapshot.throughput.toFixed(1)}
                color="#3B82F6"
              />
              <StatCard
                label="WIP actuel"
                value={String(snapshot.parts.length)}
                color="#F59E0B"
              />
              <StatCard
                label="Temps (min)"
                value={Math.round(snapshot.time / 60).toString()}
                color="#8B5CF6"
              />
            </div>

            {/* Throughput chart */}
            {history.length > 1 && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Débit dans le temps
                </p>
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151"/>
                      <XAxis dataKey="time" tick={{ fontSize: 9, fill: '#6B7280' }}
                        tickFormatter={v => `${v}m`} tickLine={false}/>
                      <YAxis tick={{ fontSize: 9, fill: '#6B7280' }} tickLine={false} axisLine={false}/>
                      <Tooltip
                        contentStyle={{ background: '#1F2937', border: 'none', borderRadius: 8, fontSize: 11 }}
                        labelFormatter={v => `${v} min`}
                        formatter={(v: number) => [`${v} pcs/h`, 'Débit']}
                      />
                      <Area
                        type="monotone" dataKey="throughput"
                        stroke="#3B82F6" fill="url(#tpGrad)" strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Node utilization */}
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                Utilisation des nœuds
              </p>
              <div className="space-y-0">
                {Object.entries(snapshot.nodeStates)
                  .sort((a, b) => b[1].utilization - a[1].utilization)
                  .map(([id, state]) => (
                    <NodeStateRow
                      key={id}
                      nodeId={id}
                      state={state}
                      label={nodeLabels[id] ?? id}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls footer */}
      <div className="p-3 border-t border-gray-700 flex gap-2">
        {isIdle && (
          <button
            onClick={handleStart}
            disabled={!diagram}
            className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
            Lancer la simulation
          </button>
        )}

        {(isRunning || isPaused) && (
          <>
            <button
              onClick={pauseSimulation}
              className={`flex-1 text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isPaused
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}
            >
              {isPaused ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  Reprendre
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z"/>
                  </svg>
                  Pause
                </>
              )}
            </button>
            <button
              onClick={handleStop}
              className="px-4 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z"/>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};