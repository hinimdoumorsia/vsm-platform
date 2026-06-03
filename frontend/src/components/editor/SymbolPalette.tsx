// ============================================================
// VSM Platform — Symbol Palette (Drag & Drop sidebar)
// ============================================================
import React, { useState } from 'react';
import { SYMBOL_REGISTRY } from './symbols';
import type { VSMNodeType } from '../../types/vsm.types';

const CATEGORIES = [
  { key: 'external',     label: 'Externes',     icon: '🏭' },
  { key: 'process',      label: 'Processus',    icon: '⚙️' },
  { key: 'inventory',    label: 'Stocks',       icon: '📦' },
  { key: 'flow',         label: 'Flux',         icon: '→' },
  { key: 'improvement',  label: 'Amélioration', icon: '💡' },
] as const;

type Category = typeof CATEGORIES[number]['key'];

interface PaletteItemProps {
  type: VSMNodeType;
  label: string;
  category: string;
}

const PaletteItem: React.FC<PaletteItemProps> = ({ type, label }) => {
  const registry = SYMBOL_REGISTRY[type];
  if (!registry) return null;
  const { component: Symbol, defaultWidth, defaultHeight } = registry;

  const scale = Math.min(56 / defaultWidth, 40 / defaultHeight);
  const w = Math.round(defaultWidth * scale);
  const h = Math.round(defaultHeight * scale);

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/vsmtype', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="
        flex flex-col items-center gap-1 p-2 rounded-lg cursor-grab active:cursor-grabbing
        hover:bg-blue-50 hover:border-blue-200 border border-transparent
        transition-all duration-150 select-none
      "
      title={`Glisser : ${label}`}
    >
      <div style={{ width: w, height: h }} className="flex items-center justify-center">
        <Symbol width={w} height={h} />
      </div>
      <span className="text-[9px] text-gray-500 text-center leading-tight max-w-[64px]">
        {label}
      </span>
    </div>
  );
};

export const SymbolPalette: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('process');
  const [search, setSearch] = useState('');

  const filtered = Object.entries(SYMBOL_REGISTRY).filter(([, v]) => {
    const matchCat = v.category === activeCategory;
    const matchSearch = search === '' || v.label.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="w-[100px] flex-shrink-0 h-full bg-white border-r border-gray-100 flex flex-col overflow-hidden">
      {/* Search */}
      <div className="p-2 border-b border-gray-100">
        <input
          type="text"
          placeholder="Chercher…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-[10px] border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-blue-300 bg-gray-50"
        />
      </div>

      {/* Category tabs */}
      <div className="flex flex-col border-b border-gray-100">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => { setActiveCategory(cat.key); setSearch(''); }}
            className={`
              flex items-center gap-1.5 px-2 py-1.5 text-[10px] text-left transition-colors
              ${activeCategory === cat.key
                ? 'bg-blue-50 text-blue-600 font-semibold border-r-2 border-blue-400'
                : 'text-gray-500 hover:bg-gray-50'}
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Symbol grid */}
      <div className="flex-1 overflow-y-auto p-1">
        {filtered.length === 0 ? (
          <p className="text-[9px] text-gray-400 text-center mt-4">Aucun résultat</p>
        ) : (
          <div className="grid grid-cols-1 gap-0.5">
            {filtered.map(([type, def]) => (
              <PaletteItem
                key={type}
                type={type as VSMNodeType}
                label={def.label}
                category={def.category}
              />
            ))}
          </div>
        )}
      </div>

      {/* Drag hint */}
      <div className="p-2 border-t border-gray-100 text-center">
        <p className="text-[8px] text-gray-400 leading-tight">
          Glisser sur le canvas pour ajouter
        </p>
      </div>
    </div>
  );
};