import { Product, normalizeProductList } from "../services/productService";
import { Faq } from "../services/faqService";

const getApiBase = () =>
  (
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://cozy-oven-bakery-backend.onrender.com"
      : "http://localhost:5000")
  ).replace(/\/$/, "");

export async function fetchHomeProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${getApiBase()}/api/v1/store/customer/products?page=1&limit=100`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return normalizeProductList(Array.isArray(json.data) ? json.data : []).filter(
      (p) => p.isAvailable !== false
    );
  } catch {
    return [];
  }
}

export async function fetchHomeFaqs(): Promise<Faq[]> {
  try {
    const res = await fetch(`${getApiBase()}/api/v1/faqs`, {
      next: { revalidate: 600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}
