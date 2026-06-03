import React, { useState, useEffect } from 'react';
import { VSMEditor } from './components/editor/VSMEditor';
import { VSMScene3D } from './components/3d/VSMScene3D';
import { SimulationPanel } from './services/simulation/SimulationPanel';
import { KPIDashboard } from './services/simulation/KPIDashboard';
import { ExportModal } from './components/export/ExportModal';
import { useVSMStore } from './store/vsmStore';
import 'reactflow/dist/style.css';

type ViewMode = '2d' | '3d' | 'split' | 'simulation' | 'dashboard';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('2d');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { activeDiagramId, computeKPIs } = useVSMStore(state => ({
    activeDiagramId: state.activeDiagramId,
    computeKPIs: state.computeKPIs,
  }));

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            VSM Platform
          </h1>
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">Value Stream Mapping</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode buttons */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {[
              { mode: '2d', label: '2D', icon: '📐' },
              { mode: '3d', label: '3D', icon: '🎨' },
              { mode: 'split', label: 'Split', icon: '🖥️' },
              { mode: 'simulation', label: 'Sim', icon: '▶️' },
              { mode: 'dashboard', label: 'KPI', icon: '📊' },
            ].map(({ mode, label, icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as ViewMode)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === mode
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => activeDiagramId && computeKPIs(activeDiagramId)}
            className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            disabled={!activeDiagramId}
          >
            Calculer KPI
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            📎 Exporter
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {viewMode === '2d' && <VSMEditor />}
        {viewMode === '3d' && <VSMScene3D />}
        {viewMode === 'split' && (
          <div className="flex h-full">
            <div className="w-1/2 h-full border-r border-gray-200">
              <VSMEditor />
            </div>
            <div className="w-1/2 h-full">
              <VSMScene3D />
            </div>
          </div>
        )}
        {viewMode === 'simulation' && <SimulationPanel />}
        {viewMode === 'dashboard' && <KPIDashboard />}
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}

export default App;