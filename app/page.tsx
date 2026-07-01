"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EditorialProductCard from "./components/EditorialProductCard";
import { testimonials } from "./data/testimonials";
import useCustomerProducts from "./hooks/useCustomerProducts";
import faqService, { Faq } from "./services/faqService";

export default function Home() {
  const { products, loading, error } = useCustomerProducts({ limit: 100 });
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const bestSellers = products.slice(0, 4);
  const bananaProducts = products.filter((product) =>
    product.productCategory?.toLowerCase().includes("banana")
  );
  const yogurtProducts = products.filter((product) =>
    product.productCategory?.toLowerCase().includes("yog")
  );
  const packageProducts = products.filter((product) =>
    product.productType === "package" || product.productCategory?.toLowerCase().includes("package")
  );
  const signature = bananaProducts[0] || products[0];
  const giftPackage = packageProducts.find((product) => product.packageConfig?.groups?.some((group) => group.type === "selection")) || packageProducts[0];
  const heroImage = "https://res.cloudinary.com/daljxj4yl/image/upload/v1782461961/cozyoven/products_thumbnails/urzdqfzt92jqdnhx0mef.jpg";

  useEffect(() => {
    faqService.getPublicFaqs().then(setFaqs);
  }, []);

  return (
    <>
      <Navbar />
      <main className="editorial-shell">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:min-h-[calc(100vh-100px)] lg:grid-cols-[0.95fr_1fr] lg:px-8 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="editorial-eyebrow mb-5">
              Tema-baked - Ghana-loved - Gift-ready
            </p>
            <h1 className="prototype-heading max-w-3xl text-[clamp(3.8rem,8.5vw,7.6rem)] text-[#222222]">
              Moist banana bread, baked fresh by Anita.
            </h1>
            <p className="mt-7 max-w-2xl text-[clamp(1.08rem,2vw,1.42rem)] leading-[1.55] text-[#5d6043]">
              A premium homemade loaf experience for cravings, family tables, office treats, and gift boxes worth remembering.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/shop" className="editorial-button px-7 py-4">
                Order banana bread
              </Link>
              <Link href={giftPackage ? `/product/${giftPackage.id}` : "/shop#package"} className="editorial-button-outline px-7 py-4">
                Send a gift box
              </Link>
            </div>
          </div>

          <div className="relative grid min-h-[560px] -translate-y-6 place-items-center lg:min-h-[650px] lg:-translate-y-14">
            <div className="soft-glow absolute h-[88%] w-[88%] rounded-full" />
            <article className="float-card relative w-[min(440px,88vw)] overflow-hidden rounded-[44px] border border-[rgba(34,34,34,0.1)] bg-gradient-to-b from-[#faf9f5]/95 to-[#b9aca2]/95 p-5 shadow-[0_26px_80px_rgba(34,34,34,0.16)]">
              <span className="absolute left-6 top-6 z-10 rounded-full bg-[#222222] px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-[#faf9f5]">
                Best seller
              </span>
              <div className="relative h-[360px] overflow-hidden rounded-[34px]">
                <Image
                  src={heroImage}
                  alt={signature?.productName || "Cozy Oven baked goods"}
                  fill
                  priority
                  className="scale-[1.08] object-cover drop-shadow-[0_34px_34px_rgba(34,34,34,0.3)]"
                  sizes="(max-width: 1024px) 88vw, 440px"
                />
              </div>
              <div className="px-2 pb-2">
                <h2 className="text-2xl font-black tracking-[-0.04em] text-[#222222]">
                  Chocolate Banana Bread
                </h2>
                <p className="mt-2 leading-6 text-[#5d6043]">
                  Soft, rich, moist and baked in small batches.
                </p>
                <Link href="/shop" className="mt-5 inline-flex rounded-full bg-[#bd6325] px-5 py-3 font-black text-[#faf9f5]">
                  Add to cart
                </Link>
              </div>
            </article>
            <aside className="absolute right-0 top-14 hidden max-w-[220px] rounded-[22px_22px_22px_6px] border border-[rgba(34,34,34,0.08)] bg-[#faf9f5] p-4 shadow-[0_12px_40px_rgba(34,34,34,0.10)] md:block">
              <strong className="block leading-5 text-[#222222]">&quot;The bread melts in your mouth.&quot;</strong>
              <span className="mt-2 block text-xs text-[#5d6043]">Family order review</span>
            </aside>
            <aside className="absolute bottom-56 left-0 hidden max-w-[220px] rounded-[22px_22px_22px_6px] border border-[rgba(34,34,34,0.08)] bg-[#faf9f5] p-4 shadow-[0_12px_40px_rgba(34,34,34,0.10)] md:block lg:bottom-60">
              <strong className="block leading-5 text-[#222222]">&quot;Saved the day, Anita.&quot;</strong>
              <span className="mt-2 block text-xs text-[#5d6043]">Customer message</span>
            </aside>
          </div>
        </section>

        <section className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 text-center md:grid-cols-4">
            {["1,300+ Deliveries", "Quick Delivery", "Satisfaction Guarantee", "Secure Payments"].map((item) => (
              <p key={item} className="rounded-full border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/75 px-5 py-4 text-sm font-black text-[#5d6043] shadow-[0_12px_40px_rgba(34,34,34,0.10)]">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-10 max-w-2xl">
            <p className="editorial-eyebrow mb-3">
              Best Sellers
            </p>
            <h2 className="prototype-heading text-5xl sm:text-6xl">
              Customer favourites, freshly baked.
            </h2>
            <p className="mt-4 text-[#5d6043]">
              Shop our most loved loaves, boxes, and creamy yoghurt treats.
            </p>
          </div>
          {loading ? (
            <div className="editorial-card p-10 text-center text-[#5d6043]">Loading products...</div>
          ) : error ? (
            <div className="editorial-card p-10 text-center text-[#bd6325]">{error}</div>
          ) : bestSellers.length === 0 ? (
            <div className="editorial-card p-10 text-center text-[#5d6043]">
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


        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-10 max-w-3xl">
            <p className="editorial-eyebrow mb-3">Simple ordering</p>
            <h2 className="prototype-heading text-5xl sm:text-6xl">
              Freshness should feel obvious before checkout.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["01", "Choose your loaf", "Pick banana bread, yoghurt, or a gift box built around the occasion."],
              ["02", "Confirm your details", "Add delivery or pickup details before Paystack so the order is clear."],
              ["03", "Receive it fresh", "Your order confirmation keeps the experience calm and easy to track."],
            ].map(([number, title, copy]) => (
              <article key={number} className="rounded-[30px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/78 p-7 shadow-[0_12px_40px_rgba(34,34,34,0.10)]">
                <span className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-[#b9aca2] font-black text-[#222222]">
                  {number}
                </span>
                <h3 className="mb-3 text-xl font-black text-[#222222]">{title}</h3>
                <p className="leading-7 text-[#5d6043]">{copy}</p>
              </article>
            ))}
          </div>
        </section>
        {signature && (

          <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-28">
            <div className="relative min-h-[360px] overflow-hidden rounded-[36px] border border-[rgba(34,34,34,0.09)] bg-[#b9aca2] shadow-[0_12px_40px_rgba(34,34,34,0.10)]">
              <Image src={signature.thumbnail || "/gift.png"} alt={signature.productName} fill className="object-cover" />
            </div>
            <div className="editorial-card flex flex-col justify-center p-8 lg:p-12">
              <p className="editorial-eyebrow mb-3">
                Our Signature
              </p>
              <h2 className="prototype-heading text-4xl sm:text-5xl">{signature.productName}</h2>
              <p className="mt-5 leading-8 text-[#5d6043]">{signature.productDetails}</p>
              <Link href={`/product/${signature.id}`} className="editorial-button mt-8 w-fit px-7 py-4">
                Shop {signature.productName}
              </Link>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="relative grid overflow-hidden rounded-[46px] bg-gradient-to-br from-[#222222] via-[#5d6043] to-[#73765a] p-7 text-[#faf9f5] shadow-[0_26px_80px_rgba(34,34,34,0.16)] md:grid-cols-[1fr_0.8fr] md:p-12 lg:p-16">
            <div className="relative z-10">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-[#faf9f5]">
                Not just a loaf. A thoughtful gesture.
              </p>
              <h2 className="prototype-heading text-5xl sm:text-6xl">
                Send a Cozy Oven gift box.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#faf9f5]/82">
                Build a warm, premium gift for birthdays, thank-you moments, office teams, family visits and just because surprises.
              </p>
              <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {["Birthday", "Thank you", "Office treat", "Get well soon"].map((occasion) => (
                  <span
                    key={occasion}
                    className="rounded-full border border-[#faf9f5]/20 bg-[#faf9f5]/10 px-4 py-3 text-center text-sm font-black text-[#faf9f5]"
                  >
                    {occasion}
                  </span>
                ))}
              </div>
              <Link
                href={giftPackage ? `/product/${giftPackage.id}` : "/shop#package"}
                className="mt-8 inline-flex rounded-full bg-[#faf9f5] px-7 py-4 font-black text-[#222222] shadow-[0_16px_30px_rgba(34,34,34,0.18)] transition hover:-translate-y-1"
              >
                {giftPackage ? "Build a gift box" : "Shop packages"}
              </Link>
            </div>

            <div className="slow-float relative z-10 mt-12 min-h-[330px] md:mt-0">
              <div className="absolute left-1/2 top-7 h-20 w-72 -translate-x-1/2 -rotate-6 rounded-[24px] bg-gradient-to-br from-[#b9aca2] to-[#73765a] shadow-[0_20px_44px_rgba(0,0,0,0.18)]" />
              <div className="absolute left-1/2 top-24 h-60 w-[min(360px,92%)] -translate-x-1/2 rotate-3 rounded-[34px] bg-gradient-to-br from-[#faf9f5] to-[#898c6d] shadow-[0_30px_70px_rgba(0,0,0,0.22)] ring-[12px] ring-[#faf9f5]/20">
                <span className="absolute left-9 top-12 h-20 w-28 -rotate-12 rounded-[28px_28px_20px_20px] bg-gradient-to-br from-[#898c6d] to-[#5d6043] shadow-lg" />
                <span className="absolute left-36 top-20 h-20 w-28 rotate-6 rounded-[28px_28px_20px_20px] bg-gradient-to-br from-[#5d6043] to-[#222222] shadow-lg" />
                <span className="absolute right-8 top-12 h-20 w-28 rotate-12 rounded-[28px_28px_20px_20px] bg-gradient-to-br from-[#b9aca2] to-[#73765a] shadow-lg" />
                <span className="absolute bottom-9 left-20 grid h-20 w-44 -rotate-3 place-items-center rounded-2xl bg-[#faf9f5] font-[Georgia,serif] text-2xl text-[#222222]">
                  For you
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[rgba(34,34,34,0.1)] bg-[#faf9f5]/60">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
            <div>
              <p className="editorial-eyebrow mb-3">
                Creamy & delicious
              </p>
              <h2 className="prototype-heading text-5xl">Yoghurt</h2>
              <p className="mt-4 leading-7 text-[#5d6043]">
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
                <div className="editorial-card col-span-full p-8 text-center text-[#5d6043]">
                  Yoghurt products will appear here once they are available.
                </div>
              )}
            </div>
          </div>
        </section>


        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-10 max-w-3xl">
            <p className="editorial-eyebrow mb-3">Real customer voice</p>
            <h2 className="prototype-heading text-5xl sm:text-6xl">
              WhatsApp praise belongs in the product experience.
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[42px] bg-[#222222] p-5 shadow-[0_26px_80px_rgba(34,34,34,0.16)]">
              <div className="flex items-center gap-3 px-3 pb-4 text-[#faf9f5]">
                <span className="h-3 w-3 rounded-full bg-[#20C05C]" />
                <strong>Cozy Oven reviews</strong>
              </div>
              <div className="relative h-[520px] overflow-hidden rounded-[30px] bg-[#b9aca2] p-5">
                <div className="whatsapp-review-track space-y-4">
                  {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                    <p
                      key={`${testimonial.id}-${index}`}
                      className={`max-w-[86%] rounded-[20px] px-4 py-3 leading-6 text-[#222222] shadow-[0_10px_24px_rgba(34,34,34,0.08)] ${
                        index % 2 === 0
                          ? "rounded-bl-md bg-[#faf9f5]"
                          : "ml-auto rounded-br-md bg-[#DFF5D7]"
                      }`}
                    >
                      {testimonial.message}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid content-start gap-4">
              {testimonials.slice(0, 3).map((testimonial) => (
                <article key={testimonial.id} className="rounded-[30px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/80 p-7 shadow-[0_12px_40px_rgba(34,34,34,0.10)]">
                  <h3 className="text-3xl font-black leading-[1] tracking-[-0.05em] text-[#222222]">
                    &quot;{testimonial.message}&quot;
                  </h3>
                </article>
              ))}
              <a
                href="https://api.whatsapp.com/message/QAOMJAY7KI7WP1"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#2F855A] px-6 py-4 font-black text-[#faf9f5] shadow-[0_16px_30px_rgba(34,34,34,0.18)] transition hover:-translate-y-1"
              >
                <MessageCircle className="h-5 w-5" />
                Reach out on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="grid items-center gap-10 rounded-[44px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/78 p-7 shadow-[0_12px_40px_rgba(34,34,34,0.10)] md:grid-cols-[300px_1fr] md:p-12">
            <div className="grid aspect-square w-full max-w-[260px] place-items-center rounded-[38px] bg-gradient-to-br from-[#b9aca2] via-[#73765a] to-[#5d6043] shadow-[0_26px_80px_rgba(34,34,34,0.16)] md:-rotate-3">
              <span className="text-8xl font-black text-[#faf9f5]">A</span>
            </div>
            <div>
              <p className="editorial-eyebrow mb-3">Meet the baker</p>
              <h2 className="prototype-heading text-5xl sm:text-6xl">
                Baked by Anita, trusted by repeat customers.
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5d6043]">
                Cozy Oven is built by a small but passionate team, warm, creative, and committed to giving you fresh, comforting baked goodness that truly makes your day better.
              </p>
              <Link href="/about" className="editorial-button-outline mt-7 px-7 py-4">
                Meet Anita
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
          <div className="mb-8 max-w-3xl">
            <p className="editorial-eyebrow mb-3">Before you order</p>
            <h2 className="prototype-heading text-5xl sm:text-6xl">
              Delivery, freshness and gifting questions.
            </h2>
          </div>
          <div className="grid max-w-4xl gap-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.id}
                open={index === 0}
                className="rounded-[22px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/78 p-5 shadow-[0_12px_40px_rgba(34,34,34,0.10)]"
              >
                <summary className="cursor-pointer text-lg font-black text-[#222222]">
                  {faq.question}
                </summary>
                <p className="mt-3 leading-7 text-[#5d6043]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-[#222222] via-[#5d6043] to-[#73765a] px-4 py-20 text-[#faf9f5] sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-8 text-center">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#faf9f5]">Stay in the loop</p>
            <h2 className="prototype-heading text-4xl sm:text-5xl">
              Be the first to know about new flavours, fresh bakes and special offers.
            </h2>
            <form className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="min-h-14 flex-1 rounded-full border border-[#faf9f5]/15 bg-[#faf9f5]/10 px-5 text-[#faf9f5] outline-none placeholder:text-[#b9aca2]/70 focus:border-[#b9aca2]"
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
