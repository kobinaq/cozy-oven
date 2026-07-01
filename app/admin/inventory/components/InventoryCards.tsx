import { Package, Edit2, Plus, Minus, TrendingUp, AlertCircle, TrendingDown } from "lucide-react";

interface InventoryItem {
  id: number;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  unitCost: number;
  status: string;
}

interface InventoryCardsProps {
  items: InventoryItem[];
  onAdjustStock: (itemId: number) => void;
  selectedItem: number | null;
  setSelectedItem: (id: number | null) => void;
  adjustmentType: "add" | "remove";
  setAdjustmentType: (type: "add" | "remove") => void;
  adjustmentAmount: number;
  setAdjustmentAmount: (amount: number) => void;
}

export default function InventoryCards({
  items,
  onAdjustStock,
  selectedItem,
  setSelectedItem,
  adjustmentType,
  setAdjustmentType,
  adjustmentAmount,
  setAdjustmentAmount,
}: InventoryCardsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-700";
      case "low_stock":
        return "bg-yellow-100 text-yellow-700";
      case "out_of_stock":
        return "bg-red-100 text-red-700";
      default:
        return "bg-[#b9aca2] text-[#5d6043]";
    }
  };

  const getStockIcon = (status: string) => {
    switch (status) {
      case "in_stock":
        return <TrendingUp className="w-4 h-4" />;
      case "low_stock":
        return <AlertCircle className="w-4 h-4" />;
      case "out_of_stock":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-[#faf9f5] rounded-xl shadow-sm border border-[#b9aca2]/40 p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#b9aca2] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[#5d6043]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#222222]">{item.productName}</h3>
                <p className="text-sm text-[#5d6043]">{item.category}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                item.status
              )}`}
            >
              {getStockIcon(item.status)}
              {item.status === "in_stock"
                ? "In Stock"
                : item.status === "low_stock"
                ? "Low Stock"
                : "Out of Stock"}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs text-[#5d6043] mb-1">SKU</p>
              <p className="text-sm font-medium text-[#222222]">{item.sku}</p>
            </div>
            <div>
              <p className="text-xs text-[#5d6043] mb-1">Current Stock</p>
              <p className="text-sm font-semibold text-[#222222]">
                {item.currentStock} <span className="text-xs text-[#5d6043]">/ {item.maxStock}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5d6043] mb-1">Reorder Point</p>
              <p className="text-sm font-medium text-[#222222]">{item.reorderPoint}</p>
            </div>
            <div>
              <p className="text-xs text-[#5d6043] mb-1">Unit Cost</p>
              <p className="text-sm font-semibold text-[#222222]">GHS {item?.unitCost?.toFixed(2)}</p>
            </div>
          </div>

          {/* Actions */}
          {selectedItem === item.id ? (
            <div className="border-t border-[#b9aca2]/40 pt-3">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setAdjustmentType("add")}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      adjustmentType === "add"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-[#b9aca2] text-[#5d6043] hover:bg-[#faf9f5]"
                    }`}
                  >
                    <Plus className="w-4 h-4 inline mr-1" /> Add
                  </button>
                  <button
                    onClick={() => setAdjustmentType("remove")}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      adjustmentType === "remove"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-[#b9aca2] text-[#5d6043] hover:bg-[#faf9f5]"
                    }`}
                  >
                    <Minus className="w-4 h-4 inline mr-1" /> Remove
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                  placeholder="Amount"
                  className="w-full px-3 py-2 border border-[#b9aca2] rounded-lg focus:ring-2 focus:ring-[#5d6043] focus:border-transparent"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setAdjustmentAmount(0);
                    }}
                    className="flex-1 px-3 py-2 border border-[#b9aca2] rounded-lg hover:bg-[#faf9f5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onAdjustStock(item.id)}
                    className="flex-1 px-3 py-2 bg-[#5d6043] text-[#faf9f5] rounded-lg hover:bg-[#222222] transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setSelectedItem(item.id)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#b9aca2] rounded-lg hover:bg-[#faf9f5] transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Adjust Stock
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
