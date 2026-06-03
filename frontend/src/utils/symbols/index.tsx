// ============================================================
// VSM Platform — Symbol Library (13 standard VSM symbols)
// Each symbol is an SVG React component
// ============================================================
import React from 'react';
import type { VSMNodeType } from '../../../types/vsm.types';

interface SymbolProps {
  width?: number;
  height?: number;
  selected?: boolean;
  color?: string;
}

// ------ Supplier ------
export const SupplierSymbol: React.FC<SymbolProps> = ({ width = 80, height = 60, selected }) => (
  <svg width={width} height={height} viewBox="0 0 80 60">
    <rect x="2" y="2" width="76" height="56" rx="2"
      fill="#E8F4FD" stroke={selected ? '#3B82F6' : '#1E40AF'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <text x="40" y="28" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1E40AF">SUPPLIER</text>
    <path d="M20 38 L60 38 M20 44 L50 44" stroke="#1E40AF" strokeWidth="1" opacity="0.5"/>
  </svg>
);

// ------ Customer ------
export const CustomerSymbol: React.FC<SymbolProps> = ({ width = 80, height = 60, selected }) => (
  <svg width={width} height={height} viewBox="0 0 80 60">
    <rect x="2" y="2" width="76" height="56" rx="2"
      fill="#FEF3C7" stroke={selected ? '#3B82F6' : '#92400E'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <text x="40" y="28" textAnchor="middle" fontSize="11" fontWeight="600" fill="#92400E">CUSTOMER</text>
    <path d="M20 38 L60 38 M20 44 L50 44" stroke="#92400E" strokeWidth="1" opacity="0.5"/>
  </svg>
);

// ------ Process Box ------
export const ProcessSymbol: React.FC<SymbolProps> = ({ width = 100, height = 70, selected }) => (
  <svg width={width} height={height} viewBox="0 0 100 70">
    <rect x="2" y="2" width="96" height="66" rx="3"
      fill="#F0FFF4" stroke={selected ? '#3B82F6' : '#166534'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <rect x="2" y="2" width="96" height="24" rx="3" fill="#166534"/>
    <text x="50" y="18" textAnchor="middle" fontSize="11" fontWeight="600" fill="white">PROCESS</text>
    <text x="50" y="45" textAnchor="middle" fontSize="9" fill="#166534">CT / CO / Uptime</text>
    <text x="50" y="58" textAnchor="middle" fontSize="9" fill="#166534">Operators / Batch</text>
  </svg>
);

// ------ Data Box ------
export const DataBoxSymbol: React.FC<SymbolProps> = ({ width = 90, height = 55, selected }) => (
  <svg width={width} height={height} viewBox="0 0 90 55">
    <rect x="2" y="2" width="86" height="51" rx="2"
      fill="white" stroke={selected ? '#3B82F6' : '#374151'}
      strokeWidth={selected ? 2.5 : 1}
      strokeDasharray={selected ? 'none' : 'none'}/>
    <line x1="2" y1="18" x2="88" y2="18" stroke="#374151" strokeWidth="1"/>
    <text x="44" y="13" textAnchor="middle" fontSize="9" fontWeight="600" fill="#374151">DATA BOX</text>
    <text x="10" y="30" fontSize="8" fill="#6B7280">CT:</text>
    <text x="10" y="40" fontSize="8" fill="#6B7280">CO:</text>
    <text x="10" y="50" fontSize="8" fill="#6B7280">Up:</text>
    <text x="50" y="30" fontSize="8" fill="#6B7280">Ops:</text>
    <text x="50" y="40" fontSize="8" fill="#6B7280">Batch:</text>
  </svg>
);

// ------ Inventory ------
export const InventorySymbol: React.FC<SymbolProps> = ({ width = 60, height = 50, selected }) => (
  <svg width={width} height={height} viewBox="0 0 60 50">
    <polygon points="30,2 58,46 2,46"
      fill="#FEF9C3" stroke={selected ? '#3B82F6' : '#854D0E'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <text x="30" y="38" textAnchor="middle" fontSize="8" fontWeight="600" fill="#854D0E">INV</text>
  </svg>
);

// ------ Supermarket ------
export const SupermarketSymbol: React.FC<SymbolProps> = ({ width = 70, height = 55, selected }) => (
  <svg width={width} height={height} viewBox="0 0 70 55">
    <rect x="2" y="2" width="66" height="51" rx="2"
      fill="#F3E8FF" stroke={selected ? '#3B82F6' : '#6B21A8'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <rect x="12" y="30" width="10" height="18" fill="#6B21A8" opacity="0.6"/>
    <rect x="30" y="22" width="10" height="26" fill="#6B21A8" opacity="0.6"/>
    <rect x="48" y="18" width="10" height="30" fill="#6B21A8" opacity="0.6"/>
    <text x="35" y="14" textAnchor="middle" fontSize="8" fontWeight="600" fill="#6B21A8">SUPERMARKET</text>
  </svg>
);

// ------ Kaizen Burst ------
export const KaizenBurstSymbol: React.FC<SymbolProps> = ({ width = 65, height = 65, selected }) => {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI) / 8;
    const r = i % 2 === 0 ? 30 : 20;
    return `${32 + r * Math.cos(angle)},${32 + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox="0 0 64 64">
      <polygon points={pts}
        fill="#FEE2E2" stroke={selected ? '#3B82F6' : '#DC2626'}
        strokeWidth={selected ? 2.5 : 1.5}/>
      <text x="32" y="30" textAnchor="middle" fontSize="7" fontWeight="700" fill="#DC2626">KAIZEN</text>
      <text x="32" y="40" textAnchor="middle" fontSize="7" fontWeight="700" fill="#DC2626">BURST</text>
    </svg>
  );
};

// ------ Electronic Information Flow ------
export const ElectronicFlowSymbol: React.FC<SymbolProps> = ({ width = 80, height = 30, selected }) => (
  <svg width={width} height={height} viewBox="0 0 80 30">
    <path d="M5 15 Q20 5 40 15 Q60 25 75 15"
      fill="none" stroke={selected ? '#3B82F6' : '#1D4ED8'}
      strokeWidth="2.5"/>
    <polygon points="72,10 80,15 72,20" fill={selected ? '#3B82F6' : '#1D4ED8'}/>
    <line x1="35" y1="2" x2="45" y2="28" stroke={selected ? '#3B82F6' : '#1D4ED8'} strokeWidth="1.5"/>
  </svg>
);

// ------ Manual Information Flow ------
export const ManualFlowSymbol: React.FC<SymbolProps> = ({ width = 80, height = 30, selected }) => (
  <svg width={width} height={height} viewBox="0 0 80 30">
    <line x1="5" y1="15" x2="72" y2="15"
      stroke={selected ? '#3B82F6' : '#374151'} strokeWidth="2"
      strokeDasharray="6 4"/>
    <polygon points="68,9 80,15 68,21" fill={selected ? '#3B82F6' : '#374151'}/>
  </svg>
);

// ------ Push Arrow ------
export const PushArrowSymbol: React.FC<SymbolProps> = ({ width = 70, height = 40, selected }) => (
  <svg width={width} height={height} viewBox="0 0 70 40">
    <path d="M2 8 L50 8 L50 2 L68 20 L50 38 L50 32 L2 32 Z"
      fill="#DBEAFE" stroke={selected ? '#3B82F6' : '#1E3A8A'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <text x="30" y="23" textAnchor="middle" fontSize="8" fontWeight="600" fill="#1E3A8A">PUSH</text>
  </svg>
);

// ------ Pull Arrow ------
export const PullArrowSymbol: React.FC<SymbolProps> = ({ width = 70, height = 40, selected }) => (
  <svg width={width} height={height} viewBox="0 0 70 40">
    <path d="M2 20 L20 2 L20 8 L68 8 L68 32 L20 32 L20 38 Z"
      fill="#FCE7F3" stroke={selected ? '#3B82F6' : '#831843'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <text x="42" y="23" textAnchor="middle" fontSize="8" fontWeight="600" fill="#831843">PULL</text>
  </svg>
);

// ------ FIFO Lane ------
export const FIFOLaneSymbol: React.FC<SymbolProps> = ({ width = 80, height = 36, selected }) => (
  <svg width={width} height={height} viewBox="0 0 80 36">
    <rect x="2" y="8" width="76" height="20" rx="2"
      fill="#F0FDF4" stroke={selected ? '#3B82F6' : '#166534'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <text x="40" y="21" textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534">FIFO</text>
    <polygon points="0,2 12,18 0,34" fill={selected ? '#3B82F6' : '#166534'} opacity="0.6"/>
    <polygon points="80,2 68,18 80,34" fill={selected ? '#3B82F6' : '#166534'} opacity="0.6"/>
  </svg>
);

// ------ Truck Shipment ------
export const TruckShipmentSymbol: React.FC<SymbolProps> = ({ width = 80, height = 56, selected }) => (
  <svg width={width} height={height} viewBox="0 0 80 56">
    <rect x="2" y="8" width="52" height="36" rx="2"
      fill="#FEF3C7" stroke={selected ? '#3B82F6' : '#92400E'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <path d="M54 16 L78 16 L78 44 L54 44 Z"
      fill="#FDE68A" stroke={selected ? '#3B82F6' : '#92400E'}
      strokeWidth={selected ? 2.5 : 1.5}/>
    <path d="M54 16 L70 16 L78 28 L78 44 L54 44 Z"
      fill="#FDE68A" stroke={selected ? '#3B82F6' : '#92400E'} strokeWidth="1"/>
    <circle cx="18" cy="46" r="6" fill="#374151"/>
    <circle cx="64" cy="46" r="6" fill="#374151"/>
    <text x="27" y="30" textAnchor="middle" fontSize="8" fontWeight="600" fill="#92400E">TRUCK</text>
  </svg>
);

// ---- Symbol Registry ----
export const SYMBOL_REGISTRY: Record<VSMNodeType, {
  component: React.FC<SymbolProps>;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
  category: 'external' | 'process' | 'flow' | 'inventory' | 'improvement';
}> = {
  supplier:       { component: SupplierSymbol,       label: 'Supplier',           defaultWidth: 100, defaultHeight: 70, category: 'external' },
  customer:       { component: CustomerSymbol,       label: 'Customer',           defaultWidth: 100, defaultHeight: 70, category: 'external' },
  process:        { component: ProcessSymbol,        label: 'Process Box',        defaultWidth: 120, defaultHeight: 80, category: 'process' },
  dataBox:        { component: DataBoxSymbol,        label: 'Data Box',           defaultWidth: 110, defaultHeight: 65, category: 'process' },
  inventory:      { component: InventorySymbol,      label: 'Inventory',          defaultWidth: 70,  defaultHeight: 60, category: 'inventory' },
  supermarket:    { component: SupermarketSymbol,    label: 'Supermarket',        defaultWidth: 80,  defaultHeight: 65, category: 'inventory' },
  kaizenburst:    { component: KaizenBurstSymbol,    label: 'Kaizen Burst',       defaultWidth: 75,  defaultHeight: 75, category: 'improvement' },
  electronicFlow: { component: ElectronicFlowSymbol, label: 'Electronic Flow',    defaultWidth: 80,  defaultHeight: 30, category: 'flow' },
  manualFlow:     { component: ManualFlowSymbol,     label: 'Manual Info Flow',   defaultWidth: 80,  defaultHeight: 30, category: 'flow' },
  pushArrow:      { component: PushArrowSymbol,      label: 'Push Arrow',         defaultWidth: 80,  defaultHeight: 45, category: 'flow' },
  pullArrow:      { component: PullArrowSymbol,      label: 'Pull Arrow',         defaultWidth: 80,  defaultHeight: 45, category: 'flow' },
  fifoLane:       { component: FIFOLaneSymbol,       label: 'FIFO Lane',          defaultWidth: 90,  defaultHeight: 40, category: 'flow' },
  truckShipment:  { component: TruckShipmentSymbol,  label: 'Truck Shipment',     defaultWidth: 90,  defaultHeight: 65, category: 'external' },
};