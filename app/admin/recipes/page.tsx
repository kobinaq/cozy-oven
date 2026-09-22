"use client";

import {
  Add01Icon,
  AlertCircleIcon,
  Cancel01Icon,
  Delete02Icon,
  PencilEdit02Icon,
} from "@hugeicons/core-free-icons";
import AdminIcon from "../components/AdminIcon";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormEvent, useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { type Product } from "../../services/productService";
import { costingService } from "../../services/costingService";
import CostItemPicker from "./CostItemPicker";
import type { RecipeCostItem } from "./costItemOptions";
import { loadAllCostItems } from "./loadAllCostItems";
import { loadAllProducts } from "./loadAllProducts";
import { isGiftPackageCategory, isLoafOrYogurtCategory } from "./recipeCategories";
import SearchPicker from "./SearchPicker";

type ComponentRow = { costItemId: string; quantity: string };
type ProductRow = { productId: string; variantId: string; quantity: string };
const field = "w-full rounded-md border border-[#b9aca2] bg-white px-3 py-2";

export default function RecipesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<RecipeCostItem[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [yieldQuantity, setYieldQuantity] = useState("1");
  const [components, setComponents] = useState<ComponentRow[]>([{ costItemId: "", quantity: "" }]);
  const [productRows, setProductRows] = useState<ProductRow[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [productRows, costItems, recipeRows] = await Promise.all([
      loadAllProducts(),
      loadAllCostItems(),
      costingService.recipes(),
    ]);
    setProducts(productRows);
    setItems(costItems);
    setRecipes(recipeRows.data || []);
  };
  useEffect(() => { load().catch(() => setMessage("Could not load recipes.")); }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  );
  const productOptions = useMemo(
    () => products.map((product) => ({
      id: product.id,
      label: product.productName,
      category: product.productCategory?.trim() || "Other",
    })),
    [products]
  );
  const isPackageRecipe = isGiftPackageCategory(selectedProduct?.productCategory);
  const recipeCostByKey = useMemo(() => {
    const costs = new Map<string, number>();
    for (const recipe of recipes) {
      const id = String(recipe.productId?._id || recipe.productId || "");
      costs.set(`${id}:${recipe.variantId || ""}`, Number(recipe.costing?.costPerProductUnit || 0));
    }
    return costs;
  }, [recipes]);
  const loafOptions = useMemo(
    () => products.flatMap((product) => {
      if (!isLoafOrYogurtCategory(product.productCategory)) return [];
      const sizes = product.selectOptions || [];
      const hasRecipe = sizes.length
        ? sizes.some((variant) => recipeCostByKey.has(`${product.id}:${variant.variantId || variant.label}`))
        : recipeCostByKey.has(`${product.id}:`);
      if (!hasRecipe) return [];
      return [{
        id: product.id,
        label: product.productName,
        category: product.productCategory?.trim() || "Other",
      }];
    }),
    [products, recipeCostByKey]
  );

  const estimate = useMemo(() => {
    const itemTotal = components.reduce((sum, row) => {
      const item = items.find((candidate) => candidate._id === row.costItemId);
      return sum + Number(row.quantity || 0) * Number(item?.costPerUnit || 0);
    }, 0);
    const productTotal = productRows.reduce((sum, row) => {
      const unit = recipeCostByKey.get(`${row.productId}:${row.variantId}`) || 0;
      return sum + Number(row.quantity || 0) * unit;
    }, 0);
    const total = itemTotal + productTotal;
    const recipeYield = Number(yieldQuantity);
    return { total, perUnit: recipeYield > 0 ? total / recipeYield : 0 };
  }, [components, items, productRows, recipeCostByKey, yieldQuantity]);

  const reset = () => {
    setProductId("");
    setVariantId("");
    setYieldQuantity("1");
    setComponents([{ costItemId: "", quantity: "" }]);
    setProductRows([]);
    setEditingId(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!productId) {
      setMessage("Choose a product.");
      return;
    }
    if (components.some((row) => !row.costItemId)) {
      setMessage("Choose a cost item for each component.");
      return;
    }
    const packageProducts = isPackageRecipe ? productRows : [];
    if (packageProducts.some((row) => !row.productId || !row.quantity)) {
      setMessage("Choose a product and quantity for each package item.");
      return;
    }
    if (packageProducts.some((row) => {
      const product = products.find((candidate) => candidate.id === row.productId);
      return Boolean(product?.selectOptions?.length) && !row.variantId;
    })) {
      setMessage("Choose a size for each banana bread or yogurt in the package.");
      return;
    }
    if (components.length + packageProducts.length === 0) {
      setMessage("Add a cost item or a product.");
      return;
    }
    const productKeys = packageProducts.map((row) => `${row.productId}:${row.variantId}`);
    if (new Set(productKeys).size !== productKeys.length) {
      setMessage("The same product and size cannot appear twice.");
      return;
    }
    setSaving(true);
    setMessage("");
    const payload = {
      productId,
      variantId: variantId || null,
      yieldQuantity: Number(yieldQuantity),
      costComponents: components.map((row) => ({
        costItemId: row.costItemId,
        quantity: Number(row.quantity),
      })),
      productComponents: packageProducts.map((row) => ({
        productId: row.productId,
        variantId: row.variantId || null,
        quantity: Number(row.quantity),
      })),
    };
    try {
      if (editingId) await costingService.updateRecipe(editingId, payload);
      else await costingService.createRecipe(payload);
      reset();
      await load();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Could not save recipe.");
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (recipe: any) => {
    setEditingId(recipe._id);
    setProductId(recipe.productId?._id || recipe.productId);
    setVariantId(recipe.variantId || "");
    setYieldQuantity(String(recipe.yieldQuantity));
    setComponents((recipe.costComponents || []).map((component: any) => ({
      costItemId: component.costItemId?._id || component.costItemId,
      quantity: String(component.quantity),
    })));
    setProductRows((recipe.productComponents || []).map((component: any) => ({
      productId: component.productId?._id || component.productId,
      variantId: component.variantId || "",
      quantity: String(component.quantity),
    })));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AdminLayout>
      <main className="space-y-6 p-4 md:p-8">
        <header>
          <h1 className="text-2xl font-bold">Recipes</h1>
          <p className="text-sm text-[#5d6043]">Combine measurable cost items into the cost of each product or variant.</p>
        </header>

        <section className="border-y border-[#b9aca2]/60 bg-white/60 px-4 py-4">
          <div className="flex gap-3">
            <AdminIcon icon={AlertCircleIcon} size={20} className="mt-0.5 text-[#5d6043]" />
            <div className="text-sm text-[#5d6043]">
              <p className="font-semibold text-[#222]">The yield is how many sellable units this batch produces.</p>
              <p>For 2,000 g flour producing 10 cakes, enter a yield of 10 and flour quantity of 2,000 g. Do not add rent or general marketing here; those belong under Overhead Costs.</p>
            </div>
          </div>
        </section>

        <form onSubmit={submit} className="space-y-4 border-b border-[#b9aca2]/60 pb-6">
          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-sm font-medium">Product<div className="mt-1"><SearchPicker options={productOptions} value={productId} placeholder="Search products" emptyLabel="No products yet" noMatchLabel="No matching products" onChange={(id) => { setProductId(id); setVariantId(""); if (!isGiftPackageCategory(products.find((product) => product.id === id)?.productCategory)) setProductRows([]); }} /></div></label>
            <label className="text-sm font-medium">Variant<select className={`${field} mt-1`} value={variantId} onChange={(e) => setVariantId(e.target.value)} disabled={!selectedProduct?.selectOptions?.length}><option value="">Base product</option>{(selectedProduct?.selectOptions || []).map((variant: any) => <option key={variant.variantId} value={variant.variantId}>{variant.label}</option>)}</select></label>
            <label className="text-sm font-medium">Recipe yield<input className={`${field} mt-1`} type="number" min="0.000001" step="any" value={yieldQuantity} onChange={(e) => setYieldQuantity(e.target.value)} required /></label>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Cost components</h2><button type="button" onClick={() => setComponents([...components, { costItemId: "", quantity: "" }])} className="inline-flex items-center gap-1 text-sm text-[#5d6043]"><AdminIcon icon={Add01Icon} size={16} />Add component</button></div>
            <div className="space-y-2">{components.map((row, index) => {
              const selected = items.find((item) => item._id === row.costItemId);
              const takenIds = components.flatMap((candidate, candidateIndex) => candidateIndex !== index && candidate.costItemId ? [candidate.costItemId] : []);
              return <div key={index} className="grid grid-cols-[1fr_130px_40px] gap-2">
                <CostItemPicker items={items} value={row.costItemId} takenIds={takenIds} onChange={(costItemId) => setComponents(components.map((candidate, candidateIndex) => candidateIndex === index ? { ...candidate, costItemId } : candidate))} />
                <input className={field} type="number" min="0.000001" step="any" placeholder={selected ? `Qty in ${selected.unit}` : "Quantity"} value={row.quantity} onChange={(e) => setComponents(components.map((candidate, candidateIndex) => candidateIndex === index ? { ...candidate, quantity: e.target.value } : candidate))} required />
                <button type="button" title="Remove component" disabled={components.length === 1 && !isPackageRecipe} onClick={() => setComponents(components.filter((_, candidateIndex) => candidateIndex !== index))} className="p-2 text-red-700 disabled:opacity-30"><AdminIcon icon={Delete02Icon} size={17} /></button>
              </div>;
            })}</div>
          </div>

          {isPackageRecipe && (
            <div>
              <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Products in this package</h2><button type="button" onClick={() => setProductRows([...productRows, { productId: "", variantId: "", quantity: "1" }])} className="inline-flex items-center gap-1 text-sm text-[#5d6043]"><AdminIcon icon={Add01Icon} size={16} />Add product</button></div>
              <p className="mb-2 text-sm text-[#5d6043]">Add banana bread and yogurt sizes that already have recipes. Their cost items are included in this package.</p>
              <div className="space-y-2">{productRows.map((row, index) => {
                const product = products.find((candidate) => candidate.id === row.productId);
                const takenKeys = new Set(productRows.flatMap((candidate, candidateIndex) => candidateIndex !== index && candidate.productId ? [`${candidate.productId}:${candidate.variantId}`] : []));
                const sizes = (product?.selectOptions || []).filter((variant) => {
                  const variantKey = variant.variantId || variant.label;
                  const key = `${row.productId}:${variantKey}`;
                  return recipeCostByKey.has(key) && (variantKey === row.variantId || !takenKeys.has(key));
                });
                return <div key={index} className="grid grid-cols-[1fr_160px_130px_40px] gap-2">
                  <SearchPicker options={loafOptions} value={row.productId} placeholder="Search banana bread or yogurt" emptyLabel="No products with recipes yet" noMatchLabel="No matching products" onChange={(id) => {
                    const nextProduct = products.find((candidate) => candidate.id === id);
                    const nextSizes = (nextProduct?.selectOptions || []).filter((variant) => recipeCostByKey.has(`${id}:${variant.variantId || variant.label}`));
                    const onlySize = nextSizes.length === 1 ? (nextSizes[0].variantId || nextSizes[0].label) : "";
                    const onlySizeTaken = productRows.some((candidate, candidateIndex) => candidateIndex !== index && `${candidate.productId}:${candidate.variantId}` === `${id}:${onlySize}`);
                    setProductRows(productRows.map((candidate, candidateIndex) => candidateIndex === index ? { ...candidate, productId: id, variantId: onlySizeTaken ? "" : onlySize } : candidate));
                  }} />
                  <select className={field} value={row.variantId} disabled={!sizes.length} onChange={(event) => setProductRows(productRows.map((candidate, candidateIndex) => candidateIndex === index ? { ...candidate, variantId: event.target.value } : candidate))} required={sizes.length > 0}><option value="">{sizes.length ? "Select size" : "Base product"}</option>{sizes.map((variant) => <option key={variant.variantId || variant.label} value={variant.variantId || variant.label}>{variant.label}</option>)}</select>
                  <input className={field} type="number" min="0.000001" step="any" placeholder="Quantity" value={row.quantity} onChange={(event) => setProductRows(productRows.map((candidate, candidateIndex) => candidateIndex === index ? { ...candidate, quantity: event.target.value } : candidate))} required />
                  <button type="button" title="Remove product" onClick={() => setProductRows(productRows.filter((_, candidateIndex) => candidateIndex !== index))} className="p-2 text-red-700"><AdminIcon icon={Delete02Icon} size={17} /></button>
                </div>;
              })}</div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#b9aca2]/60 pt-4">
            <div><p className="text-xs text-[#5d6043]">Estimated direct cost</p><p className="font-semibold">GHS {estimate.total.toFixed(2)} per batch · GHS {estimate.perUnit.toFixed(2)} per unit</p></div>
            <div className="flex gap-2">{editingId && <button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-md border px-4 py-2"><AdminIcon icon={Cancel01Icon} size={17} />Cancel</button>}<button disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-[#5d6043] px-4 py-2 text-white disabled:opacity-60">{editingId ? <AdminIcon icon={PencilEdit02Icon} size={17} /> : <AdminIcon icon={Add01Icon} size={17} />}{editingId ? "Save new version" : "Create recipe"}</button></div>
          </div>
        </form>

        {message && <p className="text-sm text-red-700">{message}</p>}
        <div className="grid gap-3 md:grid-cols-2">{recipes.map((recipe) => <article key={recipe._id} className="rounded-md border border-[#b9aca2]/60 bg-white p-4">
          <div className="flex justify-between gap-3"><div><h2 className="font-semibold">{recipe.productId?.productName}</h2><p className="text-sm text-[#5d6043]">{recipe.variantId ? recipe.productId?.selectOptions?.find((option: any) => option.variantId === recipe.variantId)?.label || "Variant" : "Base product"} · Version {recipe.version} · Yield {recipe.yieldQuantity}</p></div><div className="flex"><button title="Edit recipe" onClick={() => beginEdit(recipe)} className="p-2"><AdminIcon icon={PencilEdit02Icon} size={17} /></button><button title="Archive recipe" onClick={async () => { if (confirm("Archive this recipe?")) { await costingService.archiveRecipe(recipe._id); await load(); } }} className="p-2 text-red-700"><AdminIcon icon={Delete02Icon} size={17} /></button></div></div>
          <div className="mt-3 space-y-1 text-sm">{(recipe.productComponents || []).map((component: any) => <div key={`${component.productId?._id || component.productId}:${component.variantId || ""}`} className="flex justify-between"><span>{component.productId?.productName}{component.variantId ? ` · ${component.productId?.selectOptions?.find((option: any) => (option.variantId || option.label) === component.variantId)?.label || "Size"}` : ""}</span><span>{component.quantity}</span></div>)}{(recipe.costComponents || []).map((component: any) => <div key={component.costItemId?._id || component.costItemId} className="flex justify-between"><span>{component.costItemId?.name}</span><span>{component.quantity} {component.costItemId?.unit}</span></div>)}</div>
          <p className="mt-3 border-t pt-3 font-semibold">GHS {Number(recipe.costing?.costPerProductUnit || 0).toFixed(2)} per sellable unit</p>
        </article>)}</div>
      </main>
    </AdminLayout>
  );
}
