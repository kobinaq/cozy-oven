import { InventoryItem } from "../../services/inventoryService";

export interface PurchaseList {
  data: InventoryItem[];
  totalPages: number;
  matchingTotal: number;
  vendors: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const text = (value: unknown) => (typeof value === "string" ? value : undefined);

const readInventoryItem = (value: unknown): InventoryItem | null => {
  if (!isRecord(value)) return null;
  if (
    typeof value._id !== "string" ||
    typeof value.itemName !== "string" ||
    typeof value.itemSKU !== "string" ||
    typeof value.vendorName !== "string" ||
    typeof value.itemCategory !== "string" ||
    typeof value.quantityPurchased !== "number" ||
    typeof value.costPrice !== "number" ||
    typeof value.totalCost !== "number"
  ) {
    return null;
  }
  return {
    _id: value._id,
    itemName: value.itemName,
    itemSKU: value.itemSKU,
    vendorName: value.vendorName,
    itemCategory: value.itemCategory,
    quantityPurchased: value.quantityPurchased,
    costPrice: value.costPrice,
    totalCost: value.totalCost,
    vendorContact: text(value.vendorContact),
    purchasePurpose: text(value.purchasePurpose),
    purchasedAt: text(value.purchasedAt),
    paymentMethod: text(value.paymentMethod),
    paymentReference: text(value.paymentReference),
    costItemId: text(value.costItemId),
    createdAt: text(value.createdAt),
  };
};

export const readPurchaseList = (value: unknown): PurchaseList => {
  if (!isRecord(value)) return { data: [], totalPages: 1, matchingTotal: 0, vendors: [] };
  const totalPages = typeof value.totalPages === "number" && value.totalPages > 0
    ? Math.floor(value.totalPages)
    : 1;
  const matchingTotal = typeof value.matchingTotal === "number" && Number.isFinite(value.matchingTotal)
    ? value.matchingTotal
    : 0;
  const vendors = Array.isArray(value.vendors)
    ? value.vendors.filter((name): name is string => typeof name === "string" && name.trim().length > 0)
    : [];
  const data = Array.isArray(value.data)
    ? value.data.flatMap((row) => {
        const item = readInventoryItem(row);
        return item ? [item] : [];
      })
    : [];
  return { data, totalPages, matchingTotal, vendors };
};

export const purchaseDetail = (row: InventoryItem, paymentLabels: Record<string, string>) =>
  [row.purchasePurpose, paymentLabels[row.paymentMethod || ""], row.paymentReference]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join(" · ");
