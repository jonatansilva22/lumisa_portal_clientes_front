import { Card } from '../../../shared/ui/Card';
import type { Order } from '../../orders/types/order';
import type { Product } from '../../products/types/product';

interface OrderProductsTablePayCardProps {
  order: Order;
  products: Record<number, Product>;
}

export function OrderProductsTablePayCard({ order, products }: OrderProductsTablePayCardProps) {
  return (
    <Card className="shadow-lg overflow-hidden mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Productos a comprar</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-base">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="text-left px-4 py-3 font-semibold">Producto ID</th>
              <th className="text-left px-4 py-3 font-semibold">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold">Descripción</th>
              <th className="text-right px-4 py-3 font-semibold">Cantidad</th>
              <th className="text-right px-4 py-3 font-semibold">Precio unitario</th>
              <th className="text-right px-4 py-3 font-semibold">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.order_details.map((detail) => {
              const product = products[detail.product_id];
              const unitPrice = Number(detail.unit_price);
              const subtotal = unitPrice * detail.quantity;
              return (
                <tr key={detail.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">{detail.product_id}</td>
                  <td className="px-4 py-3">{product?.name ?? 'Sin nombre'}</td>
                  <td className="px-4 py-3">{product?.description ?? '-'}</td>
                  <td className="px-4 py-3 text-right">{detail.quantity}</td>
                  <td className="px-4 py-3 text-right">${unitPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-medium">${subtotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 border-t border-gray-200">
              <td colSpan={5} className="px-4 py-3 text-right font-bold text-gray-700">
                Total
              </td>
              <td className="px-4 py-3 text-right font-bold text-gray-800">${Number(order.total_payment).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
