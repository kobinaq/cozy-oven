"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { signupSchema, SignupFormData } from "../schemas/authSchema";
import authService from "../services/authService";
import {
  clearGuestOrderProfile,
  getGuestOrderProfile,
} from "../utils/guestOrderProfile";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/account/orders";
  }
  return value;
}

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const nextPath = safeNextPath(searchParams.get("next"));
  const isGuestOrderFlow = searchParams.get("source") === "guest-order";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  useEffect(() => {
    const guestProfile = getGuestOrderProfile();
    if (!guestProfile) return;

    reset({
      fullName: guestProfile.fullName || "",
      email: guestProfile.email || "",
      phoneNumber: guestProfile.phoneNumber || "",
      password: "",
    });
  }, [reset]);

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const signupData = { ...data };

    try {
      const signupResponse = await authService.signup(signupData);

      if (!signupResponse.success) {
        throw new Error(signupResponse.message || "Signup failed. Please try again.");
      }

      if (signupResponse.accessToken && signupResponse.data) {
        await login(signupResponse.data, signupResponse.accessToken);
      } else {
        const loginResponse = await authService.login({
          email: signupData.email,
          password: signupData.password,
        });

        if (!loginResponse.success || !loginResponse.data) {
          throw new Error("Account created. Please sign in to view your orders.");
        }

        await login(loginResponse.data);
      }

      clearGuestOrderProfile();
      setSuccess("Account created. Loading your orders...");
      router.push(nextPath);
    } catch (err: unknown) {
      const typedError = err as {
        message?: string;
        response?: { data?: { message?: string } };
      };
      setError(
        typedError.response?.data?.message ||
          typedError.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#faf9f5] px-4 pb-16 pt-32">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl bg-[#faf9f5] p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#222222]">
                {isGuestOrderFlow ? "Create an account to track your order" : "Create Account"}
              </h1>
              <p className="mt-2 text-sm text-[#5d6043]">
                {isGuestOrderFlow
                  ? "Use the same email from checkout so we can attach your guest order."
                  : "Join Cozy Oven and manage your orders."}
              </p>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#5d6043]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b9aca2]" />
                  <input
                    type="text"
                    {...register("fullName")}
                    className="w-full rounded-lg border border-[#b9aca2] py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-[#5d6043]"
                    placeholder="Jane Doe"
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#5d6043]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b9aca2]" />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-lg border border-[#b9aca2] py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-[#5d6043]"
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#5d6043]">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b9aca2]" />
                  <input
                    type="tel"
                    {...register("phoneNumber")}
                    className="w-full rounded-lg border border-[#b9aca2] py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-[#5d6043]"
                    placeholder="0205345678"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#5d6043]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#b9aca2]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full rounded-lg border border-[#b9aca2] py-3 pl-10 pr-12 focus:border-transparent focus:ring-2 focus:ring-[#5d6043]"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#b9aca2] hover:text-[#5d6043]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#5d6043] px-6 py-3 font-semibold text-[#faf9f5] transition hover:bg-[#222222] disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#faf9f5] pt-32 text-center text-[#5d6043]">
          Loading...
        </main>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
