interface Props {
  company: Record<string, any>;
}

export default function DashboardCompanyInfo({ company }: Props) {
  if (!company || !company.id) return null;
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <div className="font-semibold mb-2">Empresa asociada</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div><span className="text-gray-500">Nombre: </span>{company.name}</div>
        <div><span className="text-gray-500">RFC: </span>{company.rfc}</div>
        <div><span className="text-gray-500">Dirección: </span>{company.address}</div>
        <div><span className="text-gray-500">Teléfono: </span>{company.phone || '-'}</div>
        <div><span className="text-gray-500">Email: </span>{company.email || '-'}</div>
        <div><span className="text-gray-500">Estatus: </span>{company.active ? 'Activa' : 'Inactiva'}</div>
        {company.observations && <div className="md:col-span-2"><span className="text-gray-500">Observaciones: </span>{company.observations}</div>}
      </div>
    </div>
  );
}
