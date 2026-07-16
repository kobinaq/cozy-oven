"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  Heart, 
  MapPin, 
  User, 
  Lock, 
  LogOut 
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
      <div className="min-h-screen bg-[#faf9f5] pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="bg-[#faf9f5] rounded-lg shadow-sm p-4 sticky top-28">
                <nav className="space-y-1">
                  {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-[#5d6043] text-[#faf9f5]"
                            : "text-[#5d6043] hover:bg-[#b9aca2]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="bg-[#faf9f5] rounded-lg shadow-sm p-6 md:p-8">
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
