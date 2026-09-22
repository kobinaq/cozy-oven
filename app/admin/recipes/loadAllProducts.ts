import productService, { type Product } from "../../services/productService";

const PAGE_SIZE = 100;

export async function loadAllProducts(): Promise<Product[]> {
  const first = await productService.getProducts({ page: 1, limit: PAGE_SIZE, sortBy: "productName", order: "asc" });
  const totalPages = Number.isInteger(first.pagination?.totalPages) && first.pagination.totalPages > 0
    ? first.pagination.totalPages
    : 1;
  if (totalPages <= 1) return first.data || [];

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      productService.getProducts({ page: index + 2, limit: PAGE_SIZE, sortBy: "productName", order: "asc" })
    )
  );
  return [first.data || [], ...rest.map((page) => page.data || [])].flat();
}
