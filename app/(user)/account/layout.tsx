"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Heart,
  MapPin,
  User,
  Lock,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { ReactNode, useEffect } from "react";

const sidebarLinks = [
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/address", label: "Address", icon: MapPin },
  { href: "/account/details", label: "Account Details", icon: User },
  { href: "/account/password", label: "Password", icon: Lock },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <Navbar />
      <div className="editorial-shell min-h-screen pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <aside className="md:w-64 flex-shrink-0">
              <div className="sticky top-28 rounded-[28px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/86 p-4 shadow-[0_12px_40px_rgba(34,34,34,0.10)]">
                <nav className="space-y-1">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 rounded-full px-4 py-3 transition-colors ${
                          isActive
                            ? "bg-[#222222] text-[#faf9f5]"
                            : "text-[#5d6043] hover:bg-[#b9aca2]/50"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            </aside>

            <main className="flex-1">
              <div className="rounded-[28px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/86 p-6 shadow-[0_12px_40px_rgba(34,34,34,0.10)] md:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
