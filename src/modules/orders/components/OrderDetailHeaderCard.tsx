import { Card } from "../../../shared/ui/Card";
import type { Order } from "../types/order";

interface OrderDetailHeaderCardProps {
  order: Order;
  statusName: string;
  statusClassName: string;
}

export function OrderDetailHeaderCard({ order, statusName, statusClassName }: OrderDetailHeaderCardProps) {
  return (
    <Card className="shadow-md!">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Pedido</p>
          <h2 className="text-2xl font-bold text-gray-800">{order.folio}</h2>
          {order.description ? <p className="text-gray-600 mt-1">{order.description}</p> : null}
        </div>

        <div className={`px-4 py-2 rounded-full border text-sm md:text-base font-semibold ${statusClassName}`}>
          Estado: {statusName}
        </div>
      </div>
    </Card>
  );
}
