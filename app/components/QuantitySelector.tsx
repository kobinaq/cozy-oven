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
        className="w-10 h-10 flex items-center justify-center border-2 border-[#b9aca2] rounded-lg hover:border-[#5d6043] hover:bg-[#5d6043] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span className="text-xl font-semibold">−</span>
      </button>
      
      <span className="text-xl font-semibold min-w-[3rem] text-center">
        {quantity}
      </span>
      
      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        className="w-10 h-10 flex items-center justify-center border-2 border-[#b9aca2] rounded-lg hover:border-[#5d6043] hover:bg-[#222222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span className="text-xl font-semibold">+</span>
      </button>
    </div>
  );
}
