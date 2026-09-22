const UNITS = ["kg", "g", "L", "ml", "piece", "hour", "minute", "batch"] as const;

export type CostItemUnit = (typeof UNITS)[number];

export type RecipeCostItem = {
  _id: string;
  name: string;
  unit: CostItemUnit;
  costPerUnit: number;
  categoryName: string;
};

export function isCostItemUnit(value: unknown): value is CostItemUnit {
  return typeof value === "string" && UNITS.some((unit) => unit === value);
}

export function toRecipeCostItem(value: unknown): RecipeCostItem | null {
  if (typeof value !== "object" || value === null) return null;
  if (!("_id" in value) || typeof value._id !== "string" || value._id.length === 0) return null;
  if (!("name" in value) || typeof value.name !== "string" || value.name.trim().length === 0) return null;
  if (!("unit" in value) || !isCostItemUnit(value.unit)) return null;
  if (!("costPerUnit" in value) || typeof value.costPerUnit !== "number" || !Number.isFinite(value.costPerUnit)) return null;

  let categoryName = "Other";
  if ("categoryId" in value && typeof value.categoryId === "object" && value.categoryId !== null && "name" in value.categoryId && typeof value.categoryId.name === "string" && value.categoryId.name.trim().length > 0) {
    categoryName = value.categoryId.name;
  }

  return {
    _id: value._id,
    name: value.name,
    unit: value.unit,
    costPerUnit: value.costPerUnit,
    categoryName,
  };
}

export function costItemLabel(item: RecipeCostItem): string {
  return `${item.name} (${item.unit})`;
}

export function selectableCostItems(items: RecipeCostItem[], selectedId: string, takenIds: string[]): RecipeCostItem[] {
  const taken = new Set(takenIds);
  return items.filter((item) => item._id === selectedId || !taken.has(item._id));
}

export function matchingCostItems(items: RecipeCostItem[], query: string): RecipeCostItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) =>
    item.name.toLowerCase().includes(needle) ||
    item.categoryName.toLowerCase().includes(needle) ||
    item.unit.toLowerCase().includes(needle)
  );
}

export function groupCostItems(items: RecipeCostItem[]): { category: string; items: RecipeCostItem[] }[] {
  const grouped = new Map<string, RecipeCostItem[]>();
  for (const item of items) {
    const bucket = grouped.get(item.categoryName) ?? [];
    bucket.push(item);
    grouped.set(item.categoryName, bucket);
  }
  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "en"))
    .map(([category, groupItems]) => ({
      category,
      items: [...groupItems].sort((left, right) => left.name.localeCompare(right.name, "en")),
    }));
}

export type CostItemListPage = {
  items: RecipeCostItem[];
  totalPages: number;
};

export function readCostItemListPage(value: unknown): CostItemListPage {
  if (typeof value !== "object" || value === null) return { items: [], totalPages: 1 };
  const items = "data" in value && Array.isArray(value.data)
    ? value.data.flatMap((row) => {
        const item = toRecipeCostItem(row);
        return item ? [item] : [];
      })
    : [];
  const totalPages = "pagination" in value && typeof value.pagination === "object" && value.pagination !== null && "totalPages" in value.pagination && typeof value.pagination.totalPages === "number" && Number.isInteger(value.pagination.totalPages) && value.pagination.totalPages > 0
    ? value.pagination.totalPages
    : 1;
  return { items, totalPages };
}
