"use client";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleDecrement}
        disabled={quantity <= min}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-white transition-colors hover:border-[#c79a4b] hover:bg-[#fff8e8] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <span className="text-xl font-semibold">-</span>
      </button>

      <span className="min-w-[3rem] text-center text-xl font-semibold text-[#231913]">
        {quantity}
      </span>

      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfce] bg-white transition-colors hover:border-[#c79a4b] hover:bg-[#fff8e8] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <span className="text-xl font-semibold">+</span>
      </button>
    </div>
  );
}
