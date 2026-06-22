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
          className={`px-6 py-2 rounded-full border font-semibold transition-all ${
            selectedSize === size
              ? "border-[#231913] bg-[#231913] text-white"
              : "border-[#eadfce] bg-white text-[#6b5d50] hover:border-[#c79a4b] hover:text-[#231913]"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
