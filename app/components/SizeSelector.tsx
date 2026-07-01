"use client";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map((size, index) => (
        <button
          key={`${size}-${index}`}
          onClick={() => onSizeChange(size)}
          className={`px-6 py-2 rounded-full border-2 font-semibold transition-all ${
            selectedSize === size
              ? "border-[#bd6325] bg-[#bd6325] text-[#faf9f5]"
              : "border-[#b9aca2] bg-[#faf9f5] text-[#5d6043] hover:border-[#bd6325]"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
