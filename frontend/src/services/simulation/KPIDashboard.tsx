// ============================================================
// VSM Platform — KPI Dashboard Component
// ============================================================
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, Legend,
  LineChart, Line,
} from 'recharts';
import { useActiveKPIs, useVSMStore } from '../../store/vsmStore';
import { formatDuration, formatPCE } from '../../lib/kpi/KPICalculator';

// ---- KPI Card ----
const KPICard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  color?: string;
  warning?: boolean;
}> = ({ label, value, sub, color = '#3B82F6', warning }) => (
  <div className={`
    bg-white rounded-xl border p-4 shadow-sm flex flex-col gap-1
    ${warning ? 'border-red-200 bg-red-50' : 'border-gray-100'}
  `}>
    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
    <span className="text-2xl font-bold" style={{ color }}>{value}</span>
    {sub && <span className="text-xs text-gray-400">{sub}</span>}
  </div>
);

// ---- PCE Gauge ----
const PCEGauge: React.FC<{ pce: number }> = ({ pce }) => {
  const color = pce >= 25 ? '#10B981' : pce >= 10 ? '#F59E0B' : '#EF4444';
  const data = [{ name: 'PCE', value: pce, fill: color }];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Process Cycle Efficiency
      </span>
      <div className="h-36 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="80%"
            innerRadius="60%" outerRadius="90%"
            startAngle={180} endAngle={0}
            data={[{ value: pce, fill: color }, { value: 100 - pce, fill: '#F3F4F6' }]}
          >
            <RadialBar dataKey="value" cornerRadius={6}/>
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="-mt-8 text-center">
          <span className="text-3xl font-bold" style={{ color }}>{pce.toFixed(1)}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-1 text-center">
        {pce >= 25 ? 'Bon' : pce >= 10 ? 'À améliorer' : 'Critique'}
        {' '}— Lean world class: ≥ 25%
      </p>
    </div>
  );
};

// ---- Process Utilization Bar Chart ----
const UtilizationChart: React.FC<{ details: NonNullable<ReturnType<typeof useActiveKPIs>>['processDetails'] }> = ({
  details,
}) => {
  const data = details.map(p => ({
    name: p.nodeLabel.slice(0, 12),
    utilization: Math.round(p.utilizationRate),
    cycleTime: p.cycleTime,
    isBottleneck: p.isBottleneck,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
        Taux d'utilisation par processus (%)
      </span>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6"/>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false}/>
            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]}/>
            <Tooltip
              formatter={(v: number) => [`${v}%`, 'Utilisation']}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar
              dataKey="utilization"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              label={{ position: 'top', fontSize: 9, fill: '#6B7280' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ---- Time Analysis Chart ----
const TimeAnalysisChart: React.FC<{
  leadTime: number; vat: number; nvat: number;
}> = ({ leadTime: _lt, vat, nvat }) => {
  const data = [
    { name: 'Value Added Time', value: Math.round(vat), fill: '#10B981' },
    { name: 'Non Value Added', value: Math.round(nvat), fill: '#EF4444' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
        Décomposition du Lead Time
      </span>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barCategoryGap="40%">
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false}/>
            <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false}
              tickFormatter={v => `${Math.round(v / 60)}min`}/>
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} tickLine={false} width={110}/>
            <Tooltip
              formatter={(v: number) => [formatDuration(v), 'Durée']}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]}
              label={{ position: 'right', fontSize: 9, formatter: (v: number) => formatDuration(v) }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ---- Main KPI Dashboard ----
export const KPIDashboard: React.FC = () => {
  const kpi = useActiveKPIs();
  const { kpiLoading } = useVSMStore();

  if (kpiLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"/>
      </div>
    );
  }

  if (!kpi) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
        <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p className="text-sm">Calculez les KPI pour afficher le tableau de bord</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPICard
            label="Lead Time"
            value={formatDuration(kpi.leadTime)}
            sub="Temps total de traversée"
            color="#3B82F6"
          />
          <KPICard
            label="Value Added Time"
            value={formatDuration(kpi.valueAddedTime)}
            sub="Temps à valeur ajoutée"
            color="#10B981"
          />
          <KPICard
            label="Takt Time"
            value={kpi.taktTime > 0 ? formatDuration(kpi.taktTime) : 'N/A'}
            sub="Rythme de la demande client"
            color="#8B5CF6"
          />
          <KPICard
            label="Total WIP"
            value={`${kpi.totalWIP} units`}
            sub="Encours de production"
            color={kpi.totalWIP > 500 ? '#EF4444' : '#F59E0B'}
            warning={kpi.totalWIP > 500}
          />
        </div>

        {/* PCE + Time breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PCEGauge pce={kpi.processCycleEfficiency}/>
          <TimeAnalysisChart
            leadTime={kpi.leadTime}
            vat={kpi.valueAddedTime}
            nvat={kpi.nonValueAddedTime}
          />
        </div>

        {/* Process detail */}
        {kpi.processDetails.length > 0 && (
          <UtilizationChart details={kpi.processDetails}/>
        )}

        {/* Bottleneck alert */}
        {kpi.bottleneckNodeId && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-red-500 mt-0.5">⚠</span>
            <div>
              <p className="text-sm font-semibold text-red-700">Goulet d'étranglement détecté</p>
              <p className="text-xs text-red-500 mt-0.5">
                Nœud: {kpi.processDetails.find(p => p.nodeId === kpi.bottleneckNodeId)?.nodeLabel ?? 'Inconnu'}
                {' '}— CT: {formatDuration(
                  kpi.processDetails.find(p => p.nodeId === kpi.bottleneckNodeId)?.cycleTime ?? 0
                )}
              </p>
            </div>
          </div>
        )}

        {/* Computed at */}
        <p className="text-xs text-gray-400 text-right">
          Calculé le {new Date(kpi.computedAt).toLocaleString('fr-FR')}
        </p>
      </div>
    </div>
  );
};