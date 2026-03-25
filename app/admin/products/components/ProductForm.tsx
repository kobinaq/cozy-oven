import { X, Upload, Plus } from "lucide-react";
import Image from "next/image";
import { SelectOption } from "../../../services/productService";

interface ProductFormProps {
  productName: string;
  productCategory: string;
  price: number;
  productDetails: string;
  imageFile: File | null;
  imagePreview: string;
  selectOptions: SelectOption[];
  selectOptionInput: { label: string; additionalPrice: number };
  loading: boolean;
  categories: string[];
  onProductNameChange: (value: string) => void;
  onProductCategoryChange: (value: string) => void;
  onPriceChange: (value: number) => void;
  onProductDetailsChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage?: (index: number) => void;
  onSelectOptionInputChange: (field: "label" | "additionalPrice", value: string | number) => void;
  onAddSelectOption: () => void;
  onRemoveSelectOption: (index: number) => void;
  onToggleOptionAvailable?: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  isEdit?: boolean;
}

export default function ProductForm({
  productName,
  productCategory,
  price,
  productDetails,
  imageFile,
  imagePreview,
  selectOptions,
  selectOptionInput,
  loading,
  categories,
  onProductNameChange,
  onProductCategoryChange,
  onPriceChange,
  onProductDetailsChange,
  onImageChange,
  onRemoveImage,
  onSelectOptionInputChange,
  onAddSelectOption,
  onRemoveSelectOption,
  onToggleOptionAvailable,
  onSubmit,
  onCancel,
  submitLabel,
  isEdit = false,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Name {!isEdit && "*"}
        </label>
        <input
          type="text"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A2C22] focus:border-transparent"
          placeholder="Enter product name"
          required={!isEdit}
        />
      </div>

      {/* Category and Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category {!isEdit && "*"}
          </label>
          <input
            list="categories-list"
            value={productCategory}
            onChange={(e) => onProductCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A2C22] focus:border-transparent"
            placeholder="Select existing or type new category"
            required={!isEdit}
          />
          <datalist id="categories-list">
            {categories.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price (GHS) {!isEdit && "*"}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price || ""}
            onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A2C22] focus:border-transparent"
            placeholder="0.00"
            required={!isEdit}
          />
        </div>
      </div>

      {/* Product Details */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Details {!isEdit && "*"}
        </label>
        <textarea
          value={productDetails}
          onChange={(e) => onProductDetailsChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A2C22] focus:border-transparent"
          placeholder="Enter product description"
          rows={3}
          required={!isEdit}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Images (Select multiple)
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            {isEdit ? "Add/Change Images" : "Choose Images"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        </div>
        
        {/* Image Previews */}
        {imagePreview && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(Array.isArray(imagePreview) ? imagePreview : [imagePreview]).map((preview, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage && onRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-1 text-center font-bold">
                    MAIN THUMBNAIL
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Select Options */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Options (e.g., Size variations)
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={selectOptionInput.label}
              onChange={(e) => onSelectOptionInputChange("label", e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A2C22] focus:border-transparent"
              placeholder="Option label (e.g., Large)"
            />
            <input
              type="number"
              step="0.01"
              value={selectOptionInput.additionalPrice || ""}
              onChange={(e) => onSelectOptionInputChange("additionalPrice", parseFloat(e.target.value) || 0)}
              className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A2C22] focus:border-transparent"
              placeholder="+ Price"
            />
            <button
              type="button"
              onClick={onAddSelectOption}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {selectOptions.map((option, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg gap-2">
              <span className={`text-sm flex-1 ${option.isAvailable === false ? "text-gray-400 line-through" : ""}`}>
                {option.label} (+GHS {option.additionalPrice.toFixed(2)})
              </span>
              {onToggleOptionAvailable && (
                <button
                  type="button"
                  onClick={() => onToggleOptionAvailable(index)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    option.isAvailable !== false ? "bg-green-500" : "bg-gray-300"
                  }`}
                  title={option.isAvailable !== false ? "Mark as unavailable" : "Mark as available"}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      option.isAvailable !== false ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              )}
              <button
                type="button"
                onClick={() => onRemoveSelectOption(index)}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-[#2A2C22] text-white rounded-lg hover:bg-[#1a1c12] transition-colors disabled:opacity-50"
        >
          {loading ? `${isEdit ? "Updating" : "Adding"}...` : submitLabel}
        </button>
      </div>
    </form>
  );
}
