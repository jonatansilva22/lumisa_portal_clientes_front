interface Props {
  incidents: Array<Record<string, any>>;
}

export default function DashboardIncidents({ incidents }: Props) {
  if (!incidents.length) return null;
  return (
    <div className="bg-white rounded shadow p-4 mt-4">
      <div className="font-semibold mb-2">Incidencias recientes</div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Estado</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((inc, i) => (
            <tr key={i} className="border-t">
              <td>{inc.folio}</td>
              <td>{inc.status}</td>
              <td>${inc.total_payment?.toLocaleString?.() ?? inc.total_payment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
