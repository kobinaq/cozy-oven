"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EditorialProductCard from "./components/EditorialProductCard";
import TestimonialsMarquee from "./components/TestimonialsMarquee";
import { testimonials } from "./data/testimonials";
import useCustomerProducts from "./hooks/useCustomerProducts";

const fallbackImages = ["/gift.png", "/flightbox.png", "/cozy2.png"];

export default function Home() {
  const { products, loading, error } = useCustomerProducts({ limit: 100 });
  const bestSellers = products.slice(0, 4);
  const bananaProducts = products.filter((product) =>
    product.productCategory?.toLowerCase().includes("banana")
  );
  const yogurtProducts = products.filter((product) =>
    product.productCategory?.toLowerCase().includes("yog")
  );
  const signature = bananaProducts[0] || products[0];
  const heroImage = "https://res.cloudinary.com/daljxj4yl/image/upload/v1782411696/hero_reoa6c.png";

  return (
    <>
      <Navbar />
      <main className="bg-[#FAF6F1] text-[#1A1410]">
        <section className="relative overflow-hidden lg:min-h-[calc(100vh-80px)]">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56vw] lg:block">
            <Image
              src={heroImage}
              alt={signature?.productName || "Cozy Oven baked goods"}
              fill
              priority
              className="object-cover"
              sizes="56vw"
            />
            <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#FAF6F1] via-[#FAF6F1]/80 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FAF6F1] to-transparent" />
          </div>

          <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:min-h-[calc(100vh-80px)] lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#C8863A]">
                Handcrafted with love
              </p>
              <h1 className="font-editorial text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Banana bread, the way it should be.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#5D4A3D]">
                Moist, flavourful and made from the finest natural ingredients.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link href="/shop" className="editorial-button px-7 py-4">
                  Shop Banana Bread
                </Link>
                <Link href="/about" className="editorial-button-outline px-7 py-4">
                  Our Story
                </Link>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#E8DDD0] bg-[#F3E9DD] shadow-2xl lg:hidden">
              <Image
                src={heroImage}
                alt={signature?.productName || "Cozy Oven baked goods"}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-[#E8DDD0] bg-[#FFFDF8]">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 text-center sm:px-6 md:grid-cols-4 lg:px-8">
            {["1,300+ Deliveries", "Quick Delivery", "Satisfaction Guarantee", "Secure Payments"].map((item) => (
              <p key={item} className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5D4A3D]">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
              Best Sellers
            </p>
            <h2 className="font-editorial text-4xl leading-tight sm:text-5xl">
              Customer favourites, freshly baked.
            </h2>
            <p className="mt-4 text-[#5D4A3D]">
              Shop our most loved loaves, boxes, and creamy yoghurt treats.
            </p>
          </div>
          {loading ? (
            <div className="editorial-card p-10 text-center text-[#5D4A3D]">Loading products...</div>
          ) : error ? (
            <div className="editorial-card p-10 text-center text-[#8C2F1E]">{error}</div>
          ) : bestSellers.length === 0 ? (
            <div className="editorial-card p-10 text-center text-[#5D4A3D]">
              No products are available right now.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {bestSellers.map((product) => (
                <EditorialProductCard key={product.id} product={product} compact />
              ))}
            </div>
          )}
        </section>

        {signature && (
          <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-28">
            <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-[#E8DDD0] bg-[#F3E9DD]">
              <Image src={signature.thumbnail || "/gift.png"} alt={signature.productName} fill className="object-cover" />
            </div>
            <div className="editorial-card flex flex-col justify-center p-8 lg:p-12">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
                Our Signature
              </p>
              <h2 className="font-editorial text-4xl leading-tight sm:text-5xl">{signature.productName}</h2>
              <p className="mt-5 leading-8 text-[#5D4A3D]">{signature.productDetails}</p>
              <Link href={`/product/${signature.id}`} className="editorial-button mt-8 w-fit px-7 py-4">
                Shop {signature.productName}
              </Link>
            </div>
          </section>
        )}

        <section className="border-y border-[#E8DDD0] bg-[#FFFDF8]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
                Creamy & delicious
              </p>
              <h2 className="font-editorial text-4xl">Yoghurt</h2>
              <p className="mt-4 leading-7 text-[#5D4A3D]">
                Made with real fruit, live cultures and absolutely no preservatives.
              </p>
              <Link href="/shop" className="editorial-button-outline mt-7 px-6 py-3">
                Shop Yoghurt
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(yogurtProducts.length ? yogurtProducts.slice(0, 2) : products.slice(0, 2)).length > 0 ? (
                (yogurtProducts.length ? yogurtProducts.slice(0, 2) : products.slice(0, 2)).map((product) => (
                  <EditorialProductCard key={product.id} product={product} compact />
                ))
              ) : (
                <div className="editorial-card col-span-full p-8 text-center text-[#5D4A3D]">
                  Yoghurt products will appear here once they are available.
                </div>
              )}
            </div>
          </div>
        </section>

        <TestimonialsMarquee testimonials={testimonials} speed={36} />

        <section className="bg-[#211712] px-4 py-20 text-[#FAF6F1] sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">Stay in the loop</p>
            <h2 className="font-editorial text-4xl leading-tight sm:text-5xl">
              Be the first to know about new flavours, fresh bakes and special offers.
            </h2>
            <form className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="min-h-14 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-white outline-none placeholder:text-[#BDAE9D] focus:border-[#C8863A]"
              />
              <button type="submit" className="editorial-button min-h-14 px-8">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
