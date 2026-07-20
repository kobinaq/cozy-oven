import apiClient from "./apiClient";
import { Product, PaginationInfo, normalizeProduct, normalizeProductList } from "./productService";

export interface CustomerProductListResponse {
  success: boolean;
  cached?: boolean;
  message: string;
  pagination: PaginationInfo;
  data: Product[];
}

export interface CustomerProductResponse {
  success: boolean;
  message: string;
  cached?: boolean;
  data: Product;
}

export interface SearchProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

export const customerProductService = {
  // GET /api/v1/store/customer/products - Get all products for customers
  getAllProducts: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<CustomerProductListResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const response = await apiClient.get(
      `/api/v1/store/customer/products${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    );
    const data = response.data;
    return {
      ...data,
      data: normalizeProductList(data.data).filter((p) => p.isAvailable !== false),
    };
  },

  // GET /api/v1/store/customer/products/{productId} - Get single product by ID
  getProductById: async (productId: string): Promise<CustomerProductResponse> => {
    const response = await apiClient.get(`/api/v1/store/customer/products/${productId}`);
    const data = response.data;
    return {
      ...data,
      data: normalizeProduct(data.data),
    };
  },

  // GET /api/v1/search/products - Search products by keyword
  searchProducts: async (query: string): Promise<SearchProductsResponse> => {
    const response = await apiClient.get(`/api/v1/search/products?query=${encodeURIComponent(query)}`);
    const data = response.data;
    return {
      ...data,
      data: normalizeProductList(data.data || []).filter((p) => p.isAvailable !== false),
    };
  },

  // GET /api/v1/store/products/best-sellers - Get top 5 best sellers
  getBestSellers: async (): Promise<{ success: boolean; message: string; data: any[] }> => {
    const response = await apiClient.get("/api/v1/store/products/best-sellers");
    const data = response.data;
    return {
      ...data,
      data: normalizeProductList(data.data || []).filter((p) => p.isAvailable !== false),
    };
  },
};

export default customerProductService;
