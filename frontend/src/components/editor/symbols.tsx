import React from 'react';
import type { VSMNodeType } from '../../types/vsm.types';

interface SymbolProps {
  width: number;
  height: number;
  selected?: boolean;
}

const ShapeBox: React.FC<SymbolProps> = ({ width, height, selected }) => (
  <svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="12" width="48" height="40" rx="10" fill={selected ? '#3B82F6' : '#2563EB'} opacity="0.14" />
    <rect x="12" y="16" width="40" height="32" rx="8" fill={selected ? '#3B82F6' : '#3B82F6'} />
  </svg>
);

const ShapeCircle: React.FC<SymbolProps> = ({ width, height, selected }) => (
  <svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="20" fill={selected ? '#10B981' : '#14B8A6'} opacity="0.18" />
    <circle cx="32" cy="32" r="16" fill={selected ? '#047857' : '#059669'} />
  </svg>
);

const ShapeStack: React.FC<SymbolProps> = ({ width, height }) => (
  <svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="14" width="44" height="12" rx="4" fill="#F59E0B" />
    <rect x="10" y="26" width="44" height="12" rx="4" fill="#FBBF24" />
    <rect x="10" y="38" width="44" height="12" rx="4" fill="#FCD34D" />
  </svg>
);

const ShapeBurst: React.FC<SymbolProps> = ({ width, height }) => (
  <svg width={width} height={height} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <polygon points="32,8 38,26 58,26 42,38 48,56 32,44 16,56 22,38 6,26 26,26" fill="#F472B6" opacity="0.95" />
  </svg>
);

const ShapeArrow: React.FC<SymbolProps> = ({ width, height, selected }) => (
  <svg width={width} height={height} viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 16 H48 L40 8 M48 16 L40 24" stroke={selected ? '#2563EB' : '#1D4ED8'} strokeWidth="5" strokeLinecap="round" />
    <path d="M12 16 H56" stroke={selected ? '#2563EB' : '#1D4ED8'} strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const ShapeTruck: React.FC<SymbolProps> = ({ width, height }) => (
  <svg width={width} height={height} viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="16" width="36" height="18" rx="4" fill="#0EA5E9" />
    <rect x="38" y="6" width="16" height="16" rx="3" fill="#0284C7" />
    <circle cx="20" cy="34" r="6" fill="#1E3A8A" />
    <circle cx="44" cy="34" r="6" fill="#1E3A8A" />
  </svg>
);

const ShapeFifo: React.FC<SymbolProps> = ({ width, height }) => (
  <svg width={width} height={height} viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 26 H56" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 10 L32 22 L46 10" fill="none" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
    <path d="M18 10 H46" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export interface SymbolRegistryEntry {
  label: string;
  category: 'external' | 'process' | 'inventory' | 'flow' | 'improvement';
  defaultWidth: number;
  defaultHeight: number;
  component: React.FC<SymbolProps>;
}

export const SYMBOL_REGISTRY: Record<VSMNodeType, SymbolRegistryEntry> = {
  supplier: {
    label: 'Fournisseur',
    category: 'external',
    defaultWidth: 64,
    defaultHeight: 64,
    component: ShapeTruck,
  },
  customer: {
    label: 'Client',
    category: 'external',
    defaultWidth: 64,
    defaultHeight: 64,
    component: ShapeBox,
  },
  process: {
    label: 'Processus',
    category: 'process',
    defaultWidth: 64,
    defaultHeight: 64,
    component: ShapeBox,
  },
  dataBox: {
    label: 'Boîte de données',
    category: 'process',
    defaultWidth: 64,
    defaultHeight: 64,
    component: ShapeCircle,
  },
  inventory: {
    label: 'Stock',
    category: 'inventory',
    defaultWidth: 64,
    defaultHeight: 64,
    component: ShapeStack,
  },
  supermarket: {
    label: 'Supermarché',
    category: 'inventory',
    defaultWidth: 64,
    defaultHeight: 64,
    component: ShapeStack,
  },
  kaizenburst: {
    label: 'Kaizen Burst',
    category: 'improvement',
    defaultWidth: 64,
    defaultHeight: 64,
    component: ShapeBurst,
  },
  electronicFlow: {
    label: 'Flux électronique',
    category: 'flow',
    defaultWidth: 64,
    defaultHeight: 32,
    component: ShapeArrow,
  },
  manualFlow: {
    label: 'Flux manuel',
    category: 'flow',
    defaultWidth: 64,
    defaultHeight: 32,
    component: ShapeArrow,
  },
  pushArrow: {
    label: 'Flèche poussée',
    category: 'flow',
    defaultWidth: 64,
    defaultHeight: 32,
    component: ShapeArrow,
  },
  pullArrow: {
    label: 'Flèche tirée',
    category: 'flow',
    defaultWidth: 64,
    defaultHeight: 32,
    component: ShapeArrow,
  },
  fifoLane: {
    label: 'FIFO',
    category: 'flow',
    defaultWidth: 64,
    defaultHeight: 32,
    component: ShapeFifo,
  },
  truckShipment: {
    label: 'Expédition camion',
    category: 'external',
    defaultWidth: 64,
    defaultHeight: 40,
    component: ShapeTruck,
  },
};
