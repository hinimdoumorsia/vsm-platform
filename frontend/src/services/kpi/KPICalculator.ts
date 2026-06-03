// ============================================================
// VSM Platform — KPI Calculator (Lean Manufacturing)
// ============================================================
import type { VSMDiagram, KPIResult, ProcessKPI, VSMNode } from '../../types/vsm.types';

const VALUE_ADDED_TYPES = new Set(['process']);
const NON_VSM_TYPES = new Set(['supplier', 'customer', 'electronicFlow', 'manualFlow', 'pushArrow', 'pullArrow']);

export class KPICalculator {
  private diagram: VSMDiagram;

  constructor(diagram: VSMDiagram) {
    this.diagram = diagram;
  }

  compute(): KPIResult {
    const processNodes = this.diagram.nodes.filter(
      n => !NON_VSM_TYPES.has(n.type) && n.data.processData
    );

    const taktTime = this.computeTaktTime();
    const processKPIs = processNodes.map(n => this.computeProcessKPI(n, taktTime));

    const bottleneck = processKPIs.reduce((prev, curr) =>
      curr.cycleTime > prev.cycleTime ? curr : prev,
      processKPIs[0]
    );

    const totalCycleTime = processKPIs.reduce((s, p) => s + p.cycleTime, 0);
    const valueAddedTime = processKPIs
      .filter(p => p.isValueAdded)
      .reduce((s, p) => s + p.cycleTime, 0);

    const inventoryTime = this.computeInventoryTime(taktTime);
    const leadTime = totalCycleTime + inventoryTime;
    const nonValueAddedTime = leadTime - valueAddedTime;
    const PCE = leadTime > 0 ? (valueAddedTime / leadTime) * 100 : 0;
    const totalWIP = this.computeTotalWIP();

    return {
      diagramId: this.diagram.id,
      computedAt: new Date().toISOString(),
      leadTime,
      totalCycleTime,
      valueAddedTime,
      nonValueAddedTime,
      processCycleEfficiency: Math.round(PCE * 10) / 10,
      taktTime,
      totalWIP,
      bottleneckNodeId: bottleneck?.nodeId,
      processDetails: processKPIs,
    };
  }

  private computeTaktTime(): number {
    const { workingTime, customerDemand } = this.diagram;
    if (!workingTime || !customerDemand || customerDemand === 0) return 0;
    return workingTime / customerDemand;
  }

  private computeProcessKPI(node: VSMNode, taktTime: number): ProcessKPI {
    const pd = node.data.processData!;
    const uptime = pd.uptime / 100;
    const availableCapacity = uptime > 0 ? pd.cycleTime / uptime : pd.cycleTime;
    const utilizationRate = taktTime > 0 ? (pd.cycleTime / taktTime) * 100 : 0;

    return {
      nodeId: node.id,
      nodeLabel: node.label,
      cycleTime: pd.cycleTime,
      changeoverTime: pd.changeoverTime,
      uptime: pd.uptime,
      operators: pd.operators,
      availableCapacity,
      utilizationRate: Math.round(utilizationRate * 10) / 10,
      isBottleneck: false,      // updated after all nodes computed
      isValueAdded: VALUE_ADDED_TYPES.has(node.type),
    };
  }

  private computeInventoryTime(taktTime: number): number {
    if (taktTime === 0) return 0;
    const inventoryNodes = this.diagram.nodes.filter(
      n => n.type === 'inventory' || n.type === 'supermarket'
    );
    return inventoryNodes.reduce((sum, n) => {
      const qty = n.data.processData?.inventory ?? 0;
      return sum + qty * taktTime;
    }, 0);
  }

  private computeTotalWIP(): number {
    return this.diagram.nodes
      .filter(n => n.type === 'inventory' || n.type === 'supermarket')
      .reduce((sum, n) => sum + (n.data.processData?.inventory ?? 0), 0);
  }
}

// ---- Formatting helpers ----
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}min`;
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return `${h}h ${m}min`;
}

export function formatPCE(pce: number): string {
  return `${pce.toFixed(1)}%`;
}