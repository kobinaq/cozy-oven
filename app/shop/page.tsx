"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EditorialProductCard from "../components/EditorialProductCard";
import useCustomerProducts from "../hooks/useCustomerProducts";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function ShopPage() {
  const { products, loading, error } = useCustomerProducts({ limit: 200 });
  const groups = products.reduce<Record<string, typeof products>>((acc, product) => {
    const category = product.productCategory || "Bakery";
    acc[category] = acc[category] || [];
    acc[category].push(product);
    return acc;
  }, {});
  const categories = Object.keys(groups).sort();

  return (
    <>
      <Navbar />
      <main className="bg-[#FAF6F1] text-[#1A1410]">
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#C8863A]">
            The Bakery Counter
          </p>
          <h1 className="font-editorial text-5xl leading-tight sm:text-6xl">Shop fresh bakes by category.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5D4A3D]">
            Banana bread, creamy yoghurt, and gift-ready packages, grouped so you can browse with ease.
          </p>

          {categories.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <a key={category} href={`#${slugify(category)}`} className="editorial-button-outline px-5 py-2 text-sm">
                  {category}
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          {loading && <div className="editorial-card p-10 text-center text-[#5D4A3D]">Loading products...</div>}
          {error && <div className="editorial-card p-10 text-center text-red-700">{error}</div>}

          {!loading && !error && (
            <div className="space-y-20">
              {categories.map((category) => (
                <section key={category} id={slugify(category)} className="scroll-mt-28">
                  <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#E8DDD0] pb-5 sm:flex-row sm:items-end">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
                        Category
                      </p>
                      <h2 className="font-editorial text-4xl">{category}</h2>
                    </div>
                    <p className="text-sm text-[#5D4A3D]">{groups[category].length} items</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                    {groups[category].map((product) => (
                      <EditorialProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
