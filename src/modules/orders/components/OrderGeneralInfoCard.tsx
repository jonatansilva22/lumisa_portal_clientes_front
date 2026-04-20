import { Card } from "../../../shared/ui/Card";
import type { Order } from "../types/order";

interface OrderGeneralInfoCardProps {
  order: Order;
  clientName: string;
  companyName: string;
  advisorName: string;
  formatDate: (value?: string) => string;
}

export function OrderGeneralInfoCard({ order, clientName, companyName, advisorName, formatDate }: OrderGeneralInfoCardProps) {
  return (
    <Card className="shadow-md!">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Informacion general</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-base text-gray-700">
        <div>
          <span className="font-semibold">ID Pedido:</span> {order.id}
        </div>
        <div>
          <span className="font-semibold">Cliente:</span> {clientName}
        </div>
        <div>
          <span className="font-semibold">Empresa:</span> {companyName}
        </div>
        <div>
          <span className="font-semibold">Asesor:</span> {advisorName}
        </div>
        <div>
          <span className="font-semibold">Creado:</span> {formatDate(order.created_at)}
        </div>
        <div>
          <span className="font-semibold">Actualizado:</span> {formatDate(order.updated_at)}
        </div>
      </div>
    </Card>
  );
}
