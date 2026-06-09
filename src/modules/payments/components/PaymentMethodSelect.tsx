import { Select } from '../../../shared/ui/Select';
import type { PaymentMethod } from '../types/payment';


interface PaymentMethodSelectProps {
  methods: PaymentMethod[];
  value: number | '';
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function PaymentMethodSelect({ methods, value, onChange, disabled: _disabled }: PaymentMethodSelectProps) {
  const options = methods.map((method) => ({ value: String(method.id), label: method.name }));
  return (
    <Select
      label="Método de pago"
      value={String(value)}
      onChange={val => onChange(Number(val))}
      options={options}
      placeholder="Selecciona un método"
      className=""
      // El prop disabled se puede agregar si el Select lo soporta
    />
  );
}
