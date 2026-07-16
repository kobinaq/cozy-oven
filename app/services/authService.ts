import apiClient from "./apiClient";
import {
  SignupFormData,
  LoginFormData,
  ForgotPasswordFormData,
  VerifyOtpFormData,
  ResetPasswordFormData,
} from "../schemas/authSchema";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  tempToken?: string;
  resetToken?: string;
  data?: User;
}

export const authService = {
  signup: async (data: SignupFormData): Promise<AuthResponse> => {
    const response = await apiClient.post("/api/v1/auth/signup", data);
    return response.data;
  },

  /** BFF login — sets httpOnly cookie; does not return accessToken to the client. */
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const json = await response.json();
    if (!response.ok) {
      const err: any = new Error(json.message || "Login failed");
      err.response = { data: json, status: response.status };
      throw err;
    }
    return json;
  },

  forgotPassword: async (data: ForgotPasswordFormData): Promise<AuthResponse> => {
    const response = await apiClient.post("/api/v1/auth/forgot-password", data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpFormData, tempToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post(
      "/api/v1/auth/forgot-password/verify-otp",
      data,
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      }
    );
    return response.data;
  },

  resetPassword: async (
    data: ResetPasswordFormData,
    resetToken: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.put("/api/v1/auth/otp/reset", data, {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    });
    return response.data;
  },

  resendOtp: async (email: string): Promise<AuthResponse> => {
    const response = await apiClient.post("/api/v1/auth/forgot-password/otp/resend", {
      email,
    });
    return response.data;
  },

  logout: async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },
};

export default authService;
