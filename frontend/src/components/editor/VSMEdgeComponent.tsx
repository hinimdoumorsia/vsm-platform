// ============================================================
// VSM Platform — Custom React Flow Edge Component
// ============================================================
import React, { memo } from 'react';
import {
  EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge,
} from 'reactflow';
import type { VSMEdgeType } from '../../types/vsm.types';

const EDGE_STYLES: Record<VSMEdgeType, {
  stroke: string; strokeWidth: number; strokeDasharray?: string; animated?: boolean;
}> = {
  pushFlow:       { stroke: '#1E40AF', strokeWidth: 2 },
  pullFlow:       { stroke: '#831843', strokeWidth: 2, strokeDasharray: '6 3' },
  electronicInfo: { stroke: '#2563EB', strokeWidth: 2 },
  manualInfo:     { stroke: '#374151', strokeWidth: 1.5, strokeDasharray: '8 4' },
  fifo:           { stroke: '#065F46', strokeWidth: 2.5 },
};

interface VSMEdgeData {
  edgeType: VSMEdgeType;
  frequency?: string;
  quantity?: number;
}

export const VSMEdgeComponent = memo(({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected, markerEnd,
}: EdgeProps<VSMEdgeData>) => {
  const edgeType = data?.edgeType ?? 'pushFlow';
  const style = EDGE_STYLES[edgeType] ?? EDGE_STYLES.pushFlow;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const isElectronic = edgeType === 'electronicInfo';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? '#3B82F6' : style.stroke,
          strokeWidth: selected ? style.strokeWidth + 1 : style.strokeWidth,
          strokeDasharray: style.strokeDasharray,
        }}
      />

      {/* Electronic info flow: lightning bolt symbol */}
      {isElectronic && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'none',
            }}
          >
            <svg width="16" height="22" viewBox="0 0 16 22">
              <path d="M9 1L1 13h6l-1 8 9-12H9l1-8z"
                fill={style.stroke} opacity={0.9}/>
            </svg>
          </div>
        </EdgeLabelRenderer>
      )}

      {/* Optional label (frequency / quantity) */}
      {(data?.frequency || data?.quantity) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${(labelY - 14)}px)`,
              pointerEvents: 'none',
            }}
            className="bg-white border border-gray-200 text-[9px] text-gray-500 px-1 rounded shadow-sm"
          >
            {data.frequency && <span>{data.frequency}</span>}
            {data.quantity && <span> · {data.quantity} pcs</span>}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

VSMEdgeComponent.displayName = 'VSMEdgeComponent';