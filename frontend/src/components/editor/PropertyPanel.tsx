// ============================================================
// VSM Platform — Property Panel (selected node editor)
// ============================================================
import React from 'react';
import { useVSMStore, useSelectedNode } from '../../store/vsmStore';
import type { ProcessData } from '../../types/vsm.types';
import { formatDuration } from '../../lib/kpi/KPICalculator';

// ---- Numeric field ----
const NumField: React.FC<{
  label: string; value: number; unit?: string; min?: number; max?: number;
  onChange: (v: number) => void;
}> = ({ label, value, unit, min = 0, max, onChange }) => (
  <div className="flex flex-col gap-0.5">
    <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{label}</label>
    <div className="flex items-center gap-1">
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 text-sm border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 text-gray-700"
      />
      {unit && <span className="text-xs text-gray-400 w-6 flex-shrink-0">{unit}</span>}
    </div>
  </div>
);

// ---- Section header ----
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{title}</h4>
    {children}
  </div>
);

// ---- KPI Preview ----
const KPIPreview: React.FC<{ pd: ProcessData; taktTime?: number }> = ({ pd, taktTime }) => {
  const uptime = pd.uptime / 100;
  const availableCapacity = uptime > 0 ? pd.cycleTime / uptime : pd.cycleTime;
  const utilization = taktTime && taktTime > 0 ? (pd.cycleTime / taktTime) * 100 : null;
  const isBottleneck = utilization !== null && utilization > 100;

  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Aperçu KPI</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[9px] text-gray-400">Capacité dispo.</p>
          <p className="text-sm font-semibold text-gray-700">{formatDuration(availableCapacity)}</p>
        </div>
        {utilization !== null && (
          <div>
            <p className="text-[9px] text-gray-400">Utilisation</p>
            <p className={`text-sm font-semibold ${isBottleneck ? 'text-red-600' : utilization > 80 ? 'text-amber-600' : 'text-green-600'}`}>
              {utilization.toFixed(1)}%
            </p>
          </div>
        )}
      </div>
      {isBottleneck && (
        <div className="flex items-center gap-1.5 bg-red-50 border border-red-100 rounded px-2 py-1">
          <span className="text-red-400 text-xs">⚠</span>
          <span className="text-[10px] text-red-600">Goulet d'étranglement potentiel</span>
        </div>
      )}
    </div>
  );
};

// ---- Main Property Panel ----
export const PropertyPanel: React.FC = () => {
  const node = useSelectedNode();
  const { activeDiagramId, diagrams, updateNode, updateNodeProcessData, computeKPIs } = useVSMStore();

  const diagram = activeDiagramId ? diagrams[activeDiagramId] : null;

  const update = (field: keyof ProcessData, value: number) => {
    if (!activeDiagramId || !node) return;
    updateNodeProcessData(activeDiagramId, node.id, { [field]: value });
    // Auto-recompute KPIs after property change
    setTimeout(() => computeKPIs(activeDiagramId), 200);
  };

  const updateLabel = (label: string) => {
    if (!activeDiagramId || !node) return;
    updateNode(activeDiagramId, node.id, { label });
  };

  if (!node) {
    return (
      <div className="w-64 flex-shrink-0 h-full bg-white border-l border-gray-100 flex flex-col items-center justify-center text-gray-300 p-4">
        <svg className="w-10 h-10 mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/>
        </svg>
        <p className="text-xs text-center">Sélectionnez un nœud pour éditer ses propriétés</p>
      </div>
    );
  }

  const pd = node.data.processData;
  const hasProcessData = pd !== undefined;

  return (
    <div className="w-64 flex-shrink-0 h-full bg-white border-l border-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
            Propriétés
          </span>
          <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">
            {node.type}
          </span>
        </div>
        <input
          type="text"
          value={node.label}
          onChange={e => updateLabel(e.target.value)}
          className="mt-2 w-full text-sm font-semibold border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-blue-400 text-gray-700"
          placeholder="Nom du nœud"
        />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Position info */}
        <Section title="Position">
          <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500">
            <div>X: <span className="font-mono text-gray-700">{Math.round(node.position.x)}</span></div>
            <div>Y: <span className="font-mono text-gray-700">{Math.round(node.position.y)}</span></div>
          </div>
        </Section>

        {/* Process data (only for process nodes) */}
        {hasProcessData && pd && (
          <Section title="Données Process">
            <NumField
              label="Cycle Time" value={pd.cycleTime} unit="s"
              onChange={v => update('cycleTime', v)}
            />
            <NumField
              label="Changeover Time" value={pd.changeoverTime} unit="s"
              onChange={v => update('changeoverTime', v)}
            />
            <div className="flex flex-col gap-0.5">
              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                Uptime
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range" min={0} max={100} value={pd.uptime}
                  onChange={e => update('uptime', Number(e.target.value))}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-xs font-semibold text-gray-700 w-8 text-right">
                  {pd.uptime}%
                </span>
              </div>
            </div>
            <NumField
              label="Opérateurs" value={pd.operators} min={0}
              onChange={v => update('operators', v)}
            />
            <NumField
              label="Taille de lot" value={pd.batchSize} unit="pcs" min={1}
              onChange={v => update('batchSize', v)}
            />
          </Section>
        )}

        {/* Inventory data */}
        {(node.type === 'inventory' || node.type === 'supermarket') && pd && (
          <Section title="Stock">
            <NumField
              label="Quantité" value={pd.inventory ?? 0} unit="pcs" min={0}
              onChange={v => update('inventory', v)}
            />
          </Section>
        )}

        {/* KPI preview */}
        {hasProcessData && pd && (
          <KPIPreview pd={pd} taktTime={diagram?.taktTime ?? undefined}/>
        )}

        {/* 3D visibility toggle */}
        <Section title="Vue 3D">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={node.data.is3DVisible !== false}
              onChange={e => {
                if (activeDiagramId) {
                  updateNode(activeDiagramId, node.id, {
                    data: { ...node.data, is3DVisible: e.target.checked }
                  });
                }
              }}
              className="w-4 h-4 accent-blue-500"
            />
            <span className="text-xs text-gray-600">Visible dans la vue 3D</span>
          </label>
        </Section>
      </div>

      {/* Footer: node ID */}
      <div className="p-2 border-t border-gray-100">
        <p className="text-[9px] text-gray-300 font-mono truncate" title={node.id}>
          ID: {node.id}
        </p>
      </div>
    </div>
  );
};