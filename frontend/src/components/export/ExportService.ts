// ============================================================
// VSM Platform — Export Service
// ============================================================
import type { VSMDiagram, KPIResult, ExportOptions } from '../../types/vsm.types';
import { formatDuration } from '../../lib/kpi/KPICalculator';

export class ExportService {
  private diagram: VSMDiagram;
  private kpi: KPIResult | null;

  constructor(diagram: VSMDiagram, kpi: KPIResult | null = null) {
    this.diagram = diagram;
    this.kpi = kpi;
  }

  // ---- JSON Export ----
  exportJSON(): void {
    const payload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      diagram: this.diagram,
      kpi: this.kpi,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    this.download(blob, `vsm-${this.slug()}.json`);
  }

  // ---- SVG Export (from React Flow container) ----
  exportSVG(svgElement: SVGSVGElement): void {
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgElement);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    this.download(blob, `vsm-${this.slug()}.svg`);
  }

  // ---- PNG Export (canvas snapshot) ----
  async exportPNG(element: HTMLElement): Promise<void> {
    // Dynamic import to keep bundle light
    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    });
    canvas.toBlob(blob => {
      if (blob) this.download(blob, `vsm-${this.slug()}.png`);
    }, 'image/png', 1.0);
  }

  // ---- Excel Export (KPI report) ----
  async exportExcel(): Promise<void> {
    const XLSX = await import('xlsx');

    const wb = XLSX.utils.book_new();

    // ---- Sheet 1: Summary ----
    const summary = [
      ['VSM Platform — Rapport KPI', '', ''],
      ['Diagramme', this.diagram.name, ''],
      ['Type', this.diagram.type, ''],
      ['Exporté le', new Date().toLocaleString('fr-FR'), ''],
      ['', '', ''],
      ['KPI Global', 'Valeur', 'Unité'],
      ['Lead Time', this.kpi ? formatDuration(this.kpi.leadTime) : 'N/A', 'secondes'],
      ['Value Added Time', this.kpi ? formatDuration(this.kpi.valueAddedTime) : 'N/A', 'secondes'],
      ['Non Value Added Time', this.kpi ? formatDuration(this.kpi.nonValueAddedTime) : 'N/A', 'secondes'],
      ['Process Cycle Efficiency', this.kpi ? `${this.kpi.processCycleEfficiency}%` : 'N/A', '%'],
      ['Takt Time', this.kpi ? formatDuration(this.kpi.taktTime) : 'N/A', 'secondes'],
      ['WIP Total', this.kpi ? String(this.kpi.totalWIP) : 'N/A', 'pièces'],
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(summary);
    ws1['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws1, 'Résumé');

    // ---- Sheet 2: Process Details ----
    if (this.kpi?.processDetails?.length) {
      const headers = [
        'Processus', 'Cycle Time (s)', 'Changeover (s)',
        'Uptime (%)', 'Opérateurs', 'Utilisation (%)', 'Goulet', 'VA',
      ];
      const rows = this.kpi.processDetails.map(p => [
        p.nodeLabel,
        p.cycleTime,
        p.changeoverTime,
        p.uptime,
        p.operators,
        p.utilizationRate,
        p.isBottleneck ? 'OUI' : 'non',
        p.isValueAdded ? 'OUI' : 'non',
      ]);

      const ws2 = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      ws2['!cols'] = headers.map(() => ({ wch: 18 }));
      XLSX.utils.book_append_sheet(wb, ws2, 'Processus');
    }

    // ---- Sheet 3: Nodes inventory ----
    const nodeHeaders = ['ID', 'Type', 'Label', 'Pos X', 'Pos Y'];
    const nodeRows = this.diagram.nodes.map(n => [
      n.id, n.type, n.label,
      Math.round(n.position.x), Math.round(n.position.y),
    ]);
    const ws3 = XLSX.utils.aoa_to_sheet([nodeHeaders, ...nodeRows]);
    XLSX.utils.book_append_sheet(wb, ws3, 'Nœuds');

    XLSX.writeFile(wb, `vsm-kpi-${this.slug()}.xlsx`);
  }

  // ---- PDF Export (browser print API) ----
  exportPDF(): void {
    // Build a hidden printable div and trigger window.print()
    const kpi = this.kpi;
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>VSM Report — ${this.diagram.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #1F2937; }
          h1 { font-size: 22px; color: #1E40AF; margin-bottom: 4px; }
          h2 { font-size: 14px; color: #374151; margin-top: 24px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; }
          .meta { font-size: 11px; color: #6B7280; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 11px; }
          th { background: #1E40AF; color: white; padding: 6px 10px; text-align: left; }
          td { padding: 5px 10px; border-bottom: 1px solid #F3F4F6; }
          tr:nth-child(even) td { background: #F9FAFB; }
          .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
          .kpi-card { border: 1px solid #E5E7EB; border-radius: 8px; padding: 12px; }
          .kpi-label { font-size: 10px; color: #6B7280; text-transform: uppercase; }
          .kpi-value { font-size: 18px; font-weight: bold; color: #1E40AF; margin-top: 4px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <h1>Value Stream Map — ${this.diagram.name}</h1>
        <p class="meta">
          Type: ${this.diagram.type} &nbsp;|&nbsp;
          Nœuds: ${this.diagram.nodes.length} &nbsp;|&nbsp;
          Généré le ${new Date().toLocaleString('fr-FR')}
        </p>

        ${kpi ? `
        <h2>KPI Globaux</h2>
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Lead Time</div>
            <div class="kpi-value">${formatDuration(kpi.leadTime)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">PCE</div>
            <div class="kpi-value">${kpi.processCycleEfficiency}%</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Takt Time</div>
            <div class="kpi-value">${formatDuration(kpi.taktTime)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Value Added Time</div>
            <div class="kpi-value">${formatDuration(kpi.valueAddedTime)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">WIP Total</div>
            <div class="kpi-value">${kpi.totalWIP} pcs</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Non-VA Time</div>
            <div class="kpi-value">${formatDuration(kpi.nonValueAddedTime)}</div>
          </div>
        </div>

        ${kpi.processDetails?.length ? `
        <h2>Détail par Processus</h2>
        <table>
          <thead>
            <tr>
              <th>Processus</th><th>CT (s)</th><th>CO (s)</th>
              <th>Uptime</th><th>Opérateurs</th><th>Utilisation</th><th>VA</th>
            </tr>
          </thead>
          <tbody>
            ${kpi.processDetails.map(p => `
              <tr>
                <td>${p.nodeLabel}</td>
                <td>${p.cycleTime}</td>
                <td>${p.changeoverTime}</td>
                <td>${p.uptime}%</td>
                <td>${p.operators}</td>
                <td style="color:${p.utilizationRate > 100 ? '#DC2626' : '#059669'};font-weight:600">
                  ${p.utilizationRate}%${p.isBottleneck ? ' ⚠' : ''}
                </td>
                <td>${p.isValueAdded ? '✓' : '✗'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}
        ` : '<p>Aucun KPI calculé. Lancez le calcul KPI avant l\'export.</p>'}
      </body>
      </html>
    `;

    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(printContent);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 500);
  }

  // ---- Helpers ----
  private slug(): string {
    return this.diagram.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .slice(0, 30);
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}