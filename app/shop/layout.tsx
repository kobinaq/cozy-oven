import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop Cozy Oven banana bread, yoghurt, gift boxes, and premium baked treats.",
  alternates: {
    canonical: "/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
