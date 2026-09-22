"use client";

import { useMemo } from "react";
import { costItemLabel, type RecipeCostItem } from "./costItemOptions";
import SearchPicker from "./SearchPicker";

type CostItemPickerProps = {
  items: RecipeCostItem[];
  value: string;
  takenIds: string[];
  onChange: (costItemId: string) => void;
};

export default function CostItemPicker({ items, value, takenIds, onChange }: CostItemPickerProps) {
  const options = useMemo(
    () => items.map((item) => ({
      id: item._id,
      label: costItemLabel(item),
      category: item.categoryName,
    })),
    [items]
  );

  return (
    <SearchPicker
      options={options}
      value={value}
      takenIds={takenIds}
      placeholder="Search cost items"
      emptyLabel="No cost items yet"
      noMatchLabel="No matching cost items"
      onChange={onChange}
    />
  );
}
