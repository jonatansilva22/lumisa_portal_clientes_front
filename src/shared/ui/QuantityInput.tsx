import { useState } from "react";

type QuantityInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}: QuantityInputProps) {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };
  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={`flex items-center border-2 border-orange-500 rounded-xl px-3 py-1 select-none ${className}`}
    >
      <button
        className="text-xl px-2 focus:outline-none hover:bg-orange-100 cursor-pointer"
        onClick={handleDecrease}
        disabled={value <= min}
        type="button"
      >
        -
      </button>
      <span className="mx-3 w-4 text-center">{value}</span>
      <button
        className="text-xl px-2 focus:outline-none hover:bg-orange-100 cursor-pointer"
        onClick={handleIncrease}
        disabled={value >= max}
        type="button"
      >
        +
      </button>
    </div>
  );
}