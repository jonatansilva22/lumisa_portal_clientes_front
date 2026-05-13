import { saveAs } from '../../../shared/utils/fileSaver';
import type { SaleHistory } from '../types/salesHistory';

function toCSV(sales: SaleHistory[]): string {
  const title = 'Historial de Ventas - Lumisa Comercializadora';
  const header = ['Folio', 'Cliente', 'Empresa', 'Total', 'Pagado en'];
  const rows = sales.map(sale => [
    sale.folio,
    (sale.client?.name ?? (sale as any).client_name ?? '-'),
    (sale.company?.name ?? (sale as any).company_name ?? '-'),
    sale.total_payment,
    new Date(sale.paid_at).toLocaleDateString('es-MX'),
  ]);
  return [title, '', header.join(','), ...rows.map(r => r.join(','))].join('\n');
}

async function handleExportPDF(sales: SaleHistory[]) {
  const [{ default: jsPDF }, autoTable] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable').then(m => m.default || m)
  ]);
  const doc = new jsPDF();
  const title = 'Historial de Ventas - Lumisa Comercializadora';
  doc.setFontSize(16);
  doc.text(title, 14, 16);
  const tableColumn = ['Folio', 'Cliente', 'Empresa', 'Total', 'Pagado en'];
  const tableRows = sales.map(sale => [
    sale.folio,
    (sale.client?.name ?? (sale as any).client_name ?? '-'),
    (sale.company?.name ?? (sale as any).company_name ?? '-'),
    `$${sale.total_payment.toLocaleString('es-MX', {minimumFractionDigits:2})}`,
    new Date(sale.paid_at).toLocaleDateString('es-MX'),
  ]);
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235] },
    margin: { top: 24 },
  });
  doc.save(`historial_ventas_${new Date().toISOString().slice(0,10)}.pdf`);
}

export function ExportSalesHistoryButton({ sales }: { sales: SaleHistory[] }) {
  const handleExportCSV = () => {
    const csv = toCSV(sales);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `historial_ventas_${new Date().toISOString().slice(0,10)}.csv`);
  };

  return (
    <div className="w-full flex flex-col sm:flex-row sm:justify-end gap-2 mt-4 sm:mt-0">
      <button
        onClick={handleExportCSV}
        className="flex items-center justify-center cursor-pointer gap-2 bg-linear-to-r from-green-500 to-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all text-base min-w-45 w-full sm:w-auto"
        disabled={!sales.length}
        title={!sales.length ? 'No hay ventas para exportar' : 'Exportar historial a CSV'}
      >
        {/* Icono correcto para CSV */}
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M6 4h12v16H6z"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h6"/></svg>
        Exportar CSV
      </button>
      <button
        onClick={() => handleExportPDF(sales)}
        className="flex items-center justify-center cursor-pointer gap-2 bg-linear-to-r from-blue-500 to-blue-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all text-base min-w-45 w-full sm:w-auto"
        disabled={!sales.length}
        title={!sales.length ? 'No hay ventas para exportar' : 'Exportar historial a PDF'}
      >
        {/* Icono correcto para PDF */}
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M12 16V4m0 12l-4-4m4 4l4-4"/><rect x="4" y="18" width="16" height="2" rx="1"/></svg>
        Exportar PDF
      </button>
    </div>
  );
}