import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Header, SidebarClient } from '../../../shared/components/Index';
import { BackButton } from '../../../shared/ui/BackButton';
import { LoadingSpinner } from '../../../shared/ui/LoadingSpinner';
// import { PaymentMethodSelect } from '../components/PaymentMethodSelect';
import { PaymentSummary } from '../components/PaymentSummary';
import { OrderProductsTablePayCard } from '../components/OrderProductsTablePayCard';
import { fetchProducts } from '../../products/services/products';
import { PaymentButton } from '../components/PaymentButton';
import { usePaymentMethods, useCreatePayment } from '../hooks/usePayments';
import { useOrders } from '../../orders/hooks/useOrders';
import type { Order } from '../../orders/types/order';


export default function PaymentsPayPage() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const { methods, fetchMethods, loading: loadingMethods } = usePaymentMethods();
  const { submitPayment, loading: loadingPay } = useCreatePayment();

  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [errorOrder, setErrorOrder] = useState<string | null>(null);
  const [methodId, setMethodId] = useState<number | ''>('');
  const [products, setProducts] = useState<Record<number, any>>({});
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Solo permitir pago si el pedido está autorizado (status_id === 3) y no está pagado (status_id !== 4)
  const isOrderAuthorized = order?.status_id === 3;
  const isOrderPaid = order?.status_id === 4;

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  useEffect(() => {
    if (!orderId) return;
    setLoadingOrder(true);
    setErrorOrder(null);
    getOrderById(Number(orderId))
      .then((data) => setOrder(data))
      .catch((err) => {
        setErrorOrder(err?.message || 'Error al cargar el pedido');
        setOrder(null);
      })
      .finally(() => setLoadingOrder(false));
  }, [orderId, getOrderById]);

  useEffect(() => {
    if (!order) return;
    setLoadingProducts(true);
    fetchProducts()
      .then((allProducts) => {
        const map: Record<number, any> = {};
        allProducts.forEach((p) => {
          map[p.id] = p;
        });
        setProducts(map);
      })
      .finally(() => setLoadingProducts(false));
  }, [order]);

  const handlePay = async () => {
    if (!order || !methodId) return;
    try {
      const payment = {
        amount: typeof order.total_payment === 'string' ? parseFloat(order.total_payment) : order.total_payment,
        order_id: order.id,
        method_id: methodId,
      };
      const result = await submitPayment(payment);
      // console.log('RESULTADO DEL PAGO:', result); // Eliminado para producción
      // Solo redirigir a MercadoPago si el método es tarjeta (id === 1)
      if (methodId === 1 && result && result.mp_init_point) {
        window.location.href = result.mp_init_point;
      } else {
        toast.success('Pago registrado correctamente.');
        navigate('/orders/me');
      }
    } catch (err: any) {
      // Extrae el mensaje del backend si existe
      const backendMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Error al procesar el pago';
      toast.error(backendMsg);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 min-h-0">
        <SidebarClient />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <BackButton onClick={() => navigate(-1)} />
            <h1 className="text-2xl font-bold text-gray-800">Pagar pedido</h1>
          </div>
          {loadingOrder || loadingProducts ? (
            <LoadingSpinner className="my-12" />
          ) : errorOrder ? (
            <div className="text-red-500 text-center py-8">{errorOrder}</div>
          ) : !order ? (
            <div className="text-gray-500 text-center py-12">No se encontró el pedido.</div>
          ) : isOrderPaid ? (
            <div className="text-green-600 text-center py-12">Este pedido ya está pagado y no puede modificarse.</div>
          ) : !isOrderAuthorized ? (
            <div className="text-red-500 text-center py-12">Este pedido solo puede pagarse cuando está autorizado.</div>
          ) : (
            <div className="space-y-5">
              <PaymentSummary order={order} />
              <OrderProductsTablePayCard order={order} products={products} />
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 px-6 py-6 m-2">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Método de pago</h3>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handlePay();
                  }}
                  className="space-y-4"
                >
                  {/* Select personalizado solo para esta página */}
                  <div>
                    <label className="block mb-1 font-semibold text-blue-800">Selecciona un método</label>
                    <div className="relative">
                      <select
                        value={methodId}
                        onChange={e => setMethodId(Number(e.target.value))}
                        disabled={loadingMethods}
                        className="w-full appearance-none border-2 border-blue-200 rounded-xl px-4 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm font-medium"
                      >
                        <option value="" disabled hidden>Selecciona un método</option>
                        {methods.map(method => (
                          <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                      </select>
                      <svg className="w-5 h-5 text-blue-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <PaymentButton loading={loadingPay} disabled={!methodId} onClick={handlePay}>
                      Pagar ahora
                    </PaymentButton>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
