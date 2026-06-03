// ============================================================
// VSM Platform — Editor Page (main layout)
// ============================================================
import React, { useState, useRef } from 'react';
import { useVSMStore, useActiveDiagram, useActiveKPIs } from '../store/vsmStore';
import { VSMEditor } from '../components/editor/VSMEditor';
import { VSMScene3D } from '../components/viewer3d/VSMScene3D';
import { KPIDashboard } from '../components/dashboard/KPIDashboard';
import { SimulationPanel } from '../services/simulation/SimulationPanel';
import { ExportModal } from '../components/export/ExportModal';
import { formatDuration, formatPCE } from '../lib/kpi/KPICalculator';

type ViewMode = '2D' | '3D' | 'SPLIT' | 'DASHBOARD' | 'SIMULATION';
type DiagramTab = 'CURRENT_STATE' | 'FUTURE_STATE';

// ---- Toolbar button ----
const TBtn: React.FC<{
  icon: React.ReactNode; label: string;
  active?: boolean; onClick: () => void; variant?: 'default' | 'primary' | 'danger';
}> = ({ icon, label, active, onClick, variant = 'default' }) => (
  <button
    onClick={onClick}
    title={label}
    className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
      ${variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
        variant === 'danger'  ? 'bg-red-100 text-red-600 hover:bg-red-200' :
        active                ? 'bg-gray-200 text-gray-900' :
                                'text-gray-600 hover:bg-gray-100'}
    `}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

// ---- View Mode button group ----
const ViewBtn: React.FC<{
  mode: ViewMode; current: ViewMode; label: string; icon: string;
  setView: (m: ViewMode) => void;
}> = ({ mode, current, label, icon, setView }) => (
  <button
    onClick={() => setView(mode)}
    className={`
      flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all
      ${current === mode
        ? 'bg-blue-600 text-white shadow-sm'
        : 'text-gray-500 hover:bg-gray-100'}
    `}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

export const EditorPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('2D');
  const [diagramTab, setDiagramTab] = useState<DiagramTab>('CURRENT_STATE');
  const [showExport, setShowExport] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const diagram = useActiveDiagram();
  const kpi = useActiveKPIs();
  const {
    showGrid, showMinimap, showKPIPanel,
    toggleGrid, toggleKPIPanel,
    computeKPIs, activeDiagramId,
    setActiveDiagramType,
  } = useVSMStore();

  const handleDiagramTab = (tab: DiagramTab) => {
    setDiagramTab(tab);
    setActiveDiagramType(tab);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* ===== TOP TOOLBAR ===== */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-3 gap-2 flex-shrink-0 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-black">V</span>
          </div>
          <span className="font-bold text-gray-800 text-sm hidden md:inline">VSM Platform</span>
        </div>

        {/* Diagram name */}
        {diagram && (
          <span className="text-xs text-gray-500 border-l border-gray-200 pl-3 hidden sm:inline truncate max-w-[160px]">
            {diagram.name}
          </span>
        )}

        <div className="flex-1"/>

        {/* View mode switcher */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <ViewBtn mode="2D"         current={viewMode} label="2D"         icon="📐" setView={setViewMode}/>
          <ViewBtn mode="3D"         current={viewMode} label="3D"         icon="🧊" setView={setViewMode}/>
          <ViewBtn mode="SPLIT"      current={viewMode} label="Split"      icon="⚡" setView={setViewMode}/>
          <ViewBtn mode="DASHBOARD"  current={viewMode} label="Dashboard"  icon="📊" setView={setViewMode}/>
          <ViewBtn mode="SIMULATION" current={viewMode} label="Simulation" icon="▶" setView={setViewMode}/>
        </div>

        <div className="flex-1"/>

        {/* Toolbar actions */}
        <div className="flex items-center gap-1">
          <TBtn
            icon={<span>⊞</span>} label="Grille"
            active={showGrid} onClick={toggleGrid}
          />
          <TBtn
            icon={<span>📊</span>} label="KPI"
            active={showKPIPanel} onClick={toggleKPIPanel}
          />
          <TBtn
            icon={<span>⚡</span>} label="Calculer"
            variant="primary"
            onClick={() => activeDiagramId && computeKPIs(activeDiagramId)}
          />
          <TBtn
            icon={<span>⬇</span>} label="Exporter"
            onClick={() => setShowExport(true)}
          />
        </div>
      </div>

      {/* ===== STATE TABS (Current / Future) ===== */}
      {(viewMode === '2D' || viewMode === 'SPLIT') && (
        <div className="h-9 bg-white border-b border-gray-100 flex items-end px-4 gap-0 flex-shrink-0">
          {(['CURRENT_STATE', 'FUTURE_STATE'] as DiagramTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => handleDiagramTab(tab)}
              className={`
                px-4 py-1.5 text-xs font-semibold rounded-t-lg border-t border-x transition-all -mb-px
                ${diagramTab === tab
                  ? 'bg-white border-gray-200 text-blue-600 border-b-white'
                  : 'bg-gray-50 border-transparent text-gray-400 hover:text-gray-600'}
              `}
            >
              {tab === 'CURRENT_STATE' ? '📍 État Actuel' : '🎯 État Futur'}
            </button>
          ))}

          {/* KPI quick bar */}
          {showKPIPanel && kpi && (
            <div className="ml-auto flex items-center gap-3 pb-1 text-[10px] text-gray-500">
              <span>LT: <strong className="text-gray-700">{formatDuration(kpi.leadTime)}</strong></span>
              <span>PCE: <strong className={kpi.processCycleEfficiency >= 25 ? 'text-green-600' : 'text-amber-600'}>
                {formatPCE(kpi.processCycleEfficiency)}
              </strong></span>
              <span>Takt: <strong className="text-gray-700">{kpi.taktTime ? formatDuration(kpi.taktTime) : 'N/A'}</strong></span>
              <span>WIP: <strong className="text-gray-700">{kpi.totalWIP}</strong></span>
              {kpi.bottleneckNodeId && (
                <span className="flex items-center gap-1 text-red-500">
                  <span>⚠</span> Goulet détecté
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="flex-1 overflow-hidden" ref={canvasRef}>
        {viewMode === '2D' && (
          <div className="h-full">
            <VSMEditor />
          </div>
        )}

        {viewMode === '3D' && (
          <div className="h-full p-3">
            <VSMScene3D />
          </div>
        )}

        {viewMode === 'SPLIT' && (
          <div className="h-full flex gap-0">
            <div className="flex-1 h-full border-r border-gray-200">
              <VSMEditor />
            </div>
            <div className="w-[420px] h-full p-3 bg-gray-900">
              <VSMScene3D />
            </div>
          </div>
        )}

        {viewMode === 'DASHBOARD' && (
          <div className="h-full">
            <KPIDashboard />
          </div>
        )}

        {viewMode === 'SIMULATION' && (
          <div className="h-full flex gap-0">
            <div className="flex-1 h-full">
              <VSMScene3D />
            </div>
            <div className="w-80 h-full border-l border-gray-700">
              <SimulationPanel />
            </div>
          </div>
        )}
      </div>

      {/* ===== STATUS BAR ===== */}
      <div className="h-6 bg-gray-800 flex items-center px-3 gap-4 flex-shrink-0">
        <span className="text-[9px] text-gray-400">
          {diagram
            ? `${diagram.nodes.length} nœuds · ${diagram.edges.length} connexions`
            : 'Aucun diagramme actif'}
        </span>
        {kpi && (
          <>
            <span className="text-[9px] text-gray-500">|</span>
            <span className="text-[9px] text-gray-400">
              Calculé: {new Date(kpi.computedAt).toLocaleTimeString('fr-FR')}
            </span>
          </>
        )}
        <div className="flex-1"/>
        <span className="text-[9px] text-gray-500">VSM Platform v1.0 · Industry 4.0</span>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        canvasRef={canvasRef}
      />
    </div>
  );
};