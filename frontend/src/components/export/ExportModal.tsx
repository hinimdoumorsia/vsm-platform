// ============================================================
// VSM Platform — Export Modal
// ============================================================
import React, { useState, useRef } from 'react';
import { useVSMStore, useActiveDiagram, useActiveKPIs } from '../../store/vsmStore';
import { ExportService } from './ExportService';
import type { ExportFormat } from '../../types/vsm.types';

interface ExportOption {
  format: ExportFormat;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    format: 'PDF',
    label: 'PDF',
    icon: '📄',
    description: 'Rapport KPI complet imprimable',
    color: '#EF4444',
  },
  {
    format: 'PNG',
    label: 'Image PNG',
    icon: '🖼',
    description: 'Capture haute résolution du diagramme',
    color: '#3B82F6',
  },
  {
    format: 'SVG',
    label: 'Vecteur SVG',
    icon: '✏️',
    description: 'Format vectoriel éditable',
    color: '#8B5CF6',
  },
  {
    format: 'JSON',
    label: 'JSON',
    icon: '{ }',
    description: 'Données brutes — import/export VSM',
    color: '#F59E0B',
  },
  {
    format: 'EXCEL',
    label: 'Excel',
    icon: '📊',
    description: 'Rapport KPI tabulaire (.xlsx)',
    color: '#10B981',
  },
];

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef?: React.RefObject<HTMLDivElement>;
  svgRef?: React.RefObject<SVGSVGElement>;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen, onClose, canvasRef, svgRef,
}) => {
  const diagram = useActiveDiagram();
  const kpi = useActiveKPIs();
  const [loading, setLoading] = useState<ExportFormat | null>(null);
  const [done, setDone] = useState<ExportFormat | null>(null);

  if (!isOpen || !diagram) return null;

  const svc = new ExportService(diagram, kpi);

  const handleExport = async (format: ExportFormat) => {
    setLoading(format);
    try {
      switch (format) {
        case 'JSON':
          svc.exportJSON();
          break;
        case 'PDF':
          svc.exportPDF();
          break;
        case 'SVG':
          if (svgRef?.current) svc.exportSVG(svgRef.current);
          break;
        case 'PNG':
          if (canvasRef?.current) await svc.exportPNG(canvasRef.current);
          break;
        case 'EXCEL':
          await svc.exportExcel();
          break;
      }
      setDone(format);
      setTimeout(() => setDone(null), 2000);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold text-lg">Exporter</h2>
                <p className="text-blue-200 text-xs mt-0.5 truncate max-w-[280px]">
                  {diagram.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-blue-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="p-4 space-y-2">
            {EXPORT_OPTIONS.map(opt => {
              const isLoading = loading === opt.format;
              const isDone = done === opt.format;

              return (
                <button
                  key={opt.format}
                  onClick={() => handleExport(opt.format)}
                  disabled={!!loading}
                  className={`
                    w-full flex items-center gap-4 p-3.5 rounded-xl border transition-all
                    ${isLoading || isDone
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm'}
                    ${loading && !isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${opt.color}15`, color: opt.color }}
                  >
                    {isDone ? '✓' : opt.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{opt.description}</p>
                  </div>

                  {/* Status */}
                  <div className="flex-shrink-0">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"/>
                    ) : isDone ? (
                      <span className="text-green-500 text-sm font-semibold">✓</span>
                    ) : (
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* KPI notice */}
          {!kpi && (
            <div className="mx-4 mb-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <p className="text-xs text-amber-700">
                ⚠ Aucun KPI calculé — les exports PDF et Excel seront sans données Lean.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center">
              {diagram.nodes.length} nœuds · {diagram.edges.length} connexions ·
              {kpi ? ` PCE ${kpi.processCycleEfficiency}%` : ' KPI non calculés'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};