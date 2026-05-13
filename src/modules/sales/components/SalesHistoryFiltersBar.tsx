import { Card } from "../../../shared/ui/Card";

interface SalesHistoryFiltersBarProps {
  period: string;
  setPeriod: (v: string) => void;
  startDate?: string;
  setStartDate: (v: string) => void;
  endDate?: string;
  setEndDate: (v: string) => void;
  showCustom: boolean;
  setShowCustom: (v: boolean) => void;
  onFilter: () => void;
}

const PERIODS = [
  { label: 'Todo', value: '' },
  { label: 'Mensual', value: 'monthly' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Anual', value: 'yearly' },
];

export function SalesHistoryFiltersBar({
  period, setPeriod, startDate, setStartDate, endDate, setEndDate, showCustom, setShowCustom, onFilter
}: SalesHistoryFiltersBarProps) {
  return (
    <div className="w-full flex justify-center">
      <Card className="mb-2 py-3 px-2 sm:px-4 flex flex-col max-w-5xl w-full bg-linear-to-br from-gray-50 to-white border-0 shadow-md">
        <div className="w-full flex flex-wrap gap-2 md:gap-4 items-center justify-center md:justify-start">
          {PERIODS.map(p => (
            <button
              key={p.value}
              className={`px-4 py-2 rounded-lg font-semibold cursor-pointer border transition-all duration-150 whitespace-nowrap ${period === p.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
              onClick={() => { setPeriod(p.value); setShowCustom(false); }}
            >
              {p.label}
            </button>
          ))}
          <button
            className={`px-4 py-2 rounded-lg font-semibold cursor-pointer border transition-all duration-150 whitespace-nowrap ${showCustom ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
            onClick={() => {
              if (!showCustom) {
                setPeriod('');
                setStartDate('');
                setEndDate('');
              }
              setShowCustom(!showCustom);
            }}
          >
            Personalizado
          </button>
          {showCustom && (
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <input type="date" value={startDate || ''} onChange={e => setStartDate(e.target.value)} className="border rounded px-2 py-1 w-full sm:w-auto" />
              <span className="mx-1">a</span>
              <input type="date" value={endDate || ''} onChange={e => setEndDate(e.target.value)} className="border rounded px-2 py-1 w-full sm:w-auto" />
              <button className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer w-full sm:w-auto" onClick={onFilter}>Filtrar</button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
