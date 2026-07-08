import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://cozy-oven-bakery-backend.onrender.com";
const RETRYABLE_METHODS = new Set(["get", "head", "options"]);
const RETRYABLE_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_GET_RETRIES = 2;
const RETRY_DELAYS_MS = [1500, 3500];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableApiError = (error: any) => {
  const config = error.config || {};
  const method = String(config.method || "get").toLowerCase();

  if (!RETRYABLE_METHODS.has(method)) {
    return false;
  }

  if (config.__skipRetry) {
    return false;
  }

  const status = error.response?.status;
  return (
    error.code === "ECONNABORTED" ||
    error.code === "ERR_NETWORK" ||
    !error.response ||
    RETRYABLE_STATUS_CODES.has(status)
  );
};

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 75000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    config.__retryCount = config.__retryCount || 0;

    if (isRetryableApiError(error) && config.__retryCount < MAX_GET_RETRIES) {
      config.__retryCount += 1;
      await wait(RETRY_DELAYS_MS[config.__retryCount - 1] || 3500);
      return apiClient(config);
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        // Clear all auth-related data from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        
        // Redirect to home page (not logged in)
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export const warmUpApi = async () => {
  const response = await apiClient.get("/api/v1/health", {
    timeout: 75000,
  });
  return response.data;
};

export default apiClient;
