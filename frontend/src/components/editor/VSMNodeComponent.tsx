// ============================================================
// VSM Platform — Custom React Flow Node Component
// ============================================================
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { SYMBOL_REGISTRY } from './symbols';
import type { VSMNodeType } from '../../types/vsm.types';

interface VSMNodeData {
  vsmType: VSMNodeType;
  label: string;
  selected?: boolean;
  processData?: {
    cycleTime: number;
    uptime: number;
    operators: number;
  };
  properties?: Record<string, unknown>;
}

export const VSMNodeComponent = memo(({ data, selected }: NodeProps<VSMNodeData>) => {
  const registry = SYMBOL_REGISTRY[data.vsmType];
  if (!registry) return null;

  const { component: SymbolComponent, defaultWidth, defaultHeight } = registry;
  const isProcess = data.vsmType === 'process';
  const isFlow = ['electronicFlow', 'manualFlow', 'pushArrow', 'pullArrow', 'fifoLane'].includes(data.vsmType);

  return (
    <div className="relative group" style={{ width: defaultWidth, height: defaultHeight }}>
      {/* Source / Target handles */}
      {!isFlow && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="!w-3 !h-3 !bg-blue-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!w-3 !h-3 !bg-blue-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Handle
            type="target"
            position={Position.Top}
            id="top"
            className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="bottom"
            className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </>
      )}

      {isFlow && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="!w-2 !h-2 !bg-transparent !border-0"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!w-2 !h-2 !bg-transparent !border-0"
          />
        </>
      )}

      {/* Symbol SVG */}
      <div
        className={`transition-all duration-150 ${selected ? 'drop-shadow-lg scale-105' : ''}`}
        style={{ width: defaultWidth, height: defaultHeight }}
      >
        <SymbolComponent
          width={defaultWidth}
          height={defaultHeight}
          selected={selected}
        />
      </div>

      {/* Process metrics overlay (only for process nodes) */}
      {isProcess && data.processData && (
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
          <div className="flex gap-1.5 bg-white border border-gray-200 rounded-md px-2 py-0.5 shadow-sm text-[9px] text-gray-500 whitespace-nowrap">
            <span>CT:{data.processData.cycleTime}s</span>
            <span className="text-gray-300">|</span>
            <span>Up:{data.processData.uptime}%</span>
            <span className="text-gray-300">|</span>
            <span>Ops:{data.processData.operators}</span>
          </div>
        </div>
      )}

      {/* Label below */}
      {!isProcess && (
        <div className="absolute -bottom-5 left-0 right-0 text-center">
          <span className="text-[10px] text-gray-600 font-medium leading-tight">{data.label}</span>
        </div>
      )}

      {/* Selected ring */}
      {selected && (
        <div
          className="absolute inset-0 rounded pointer-events-none"
          style={{ boxShadow: '0 0 0 2px #3B82F6', borderRadius: 4 }}
        />
      )}
    </div>
  );
});

VSMNodeComponent.displayName = 'VSMNodeComponent';