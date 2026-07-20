"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import EditorialProductCard from "./EditorialProductCard";
import { testimonials } from "../data/testimonials";
import useCustomerProducts from "../hooks/useCustomerProducts";
import faqService, { Faq } from "../services/faqService";
import { Product } from "../services/productService";
import subscriberService from "../services/subscriberService";

type HomeClientProps = {
  initialProducts?: Product[];
  initialFaqs?: Faq[];
};

export default function HomeClient({
  initialProducts = [],
  initialFaqs = [],
}: HomeClientProps) {
  const { products, loading, error } = useCustomerProducts({
    limit: 100,
    autoFetch: initialProducts.length === 0,
  });
  const resolvedProducts = products.length > 0 ? products : initialProducts;
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);
  const bestSellers = resolvedProducts.slice(0, 4);
  const bananaProducts = resolvedProducts.filter((product) =>
    product.productCategory?.toLowerCase().includes("banana")
  );
  const yogurtProducts = resolvedProducts.filter((product) =>
    product.productCategory?.toLowerCase().includes("yog")
  );
  const packageProducts = resolvedProducts.filter(
    (product) =>
      product.productType === "package" ||
      product.productCategory?.toLowerCase().includes("package")
  );
  const signature = bananaProducts[0] || resolvedProducts[0];
  const giftPackage =
    packageProducts.find((product) =>
      product.packageConfig?.groups?.some((group) => group.type === "selection")
    ) || packageProducts[0];
  const heroImage =
    signature?.thumbnail ||
    "https://res.cloudinary.com/daljxj4yl/image/upload/v1782461961/cozyoven/products_thumbnails/urzdqfzt92jqdnhx0mef.jpg";
  const giftImage = giftPackage?.thumbnail || "/gift.png";
  const previewFaqs = faqs.slice(0, 4);

  useEffect(() => {
    if (initialFaqs.length > 0) return;
    faqService.getPublicFaqs().then(setFaqs);
  }, [initialFaqs.length]);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus(null);
    try {
      const fullName = newsletterEmail.split("@")[0] || "Subscriber";
      await subscriberService.addSubscriber({
        fullName,
        email: newsletterEmail.trim(),
      });
      setNewsletterStatus("Thanks for subscribing!");
      setNewsletterEmail("");
    } catch (err: unknown) {
      const typed = err as { response?: { data?: { message?: string } } };
      setNewsletterStatus(
        typed.response?.data?.message || "Could not subscribe. Please try again."
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className="editorial-shell">
        <section className="relative min-h-[calc(100vh-100px)] overflow-hidden">
          <Image
            src={heroImage}
            alt={signature?.productName || "Cozy Oven banana bread"}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#222222]/78 via-[#222222]/55 to-[#222222]/25" />
          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
            <h1 className="prototype-heading max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] text-[#faf9f5]">
              Cozy Oven
            </h1>
            <p className="mt-4 max-w-xl text-[clamp(1.15rem,2.4vw,1.65rem)] font-medium leading-snug text-[#faf9f5]">
              Moist banana bread, baked fresh by Anita.
            </p>
            <p className="mt-4 max-w-lg text-base leading-7 text-[#faf9f5]/85">
              Homemade loaves and gift boxes for cravings, family tables, and moments worth remembering.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="editorial-button bg-[#faf9f5] px-7 py-3.5 text-[#222222] hover:bg-[#faf9f5]">
                Shop now
              </Link>
              <Link
                href={giftPackage ? `/product/${giftPackage.id}` : "/shop#package"}
                className="inline-flex items-center justify-center rounded-full border border-[#faf9f5]/40 px-7 py-3.5 font-semibold text-[#faf9f5] transition hover:bg-[#faf9f5]/10"
              >
                Send a gift box
              </Link>
            </div>
            {signature && (
              <Link
                href={`/product/${signature.id}`}
                className="mt-6 text-sm font-medium text-[#faf9f5]/80 underline-offset-4 transition hover:text-[#faf9f5] hover:underline"
              >
                Shop {signature.productName}
              </Link>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="prototype-heading text-3xl sm:text-4xl">
                Customer favourites, freshly baked.
              </h2>
              <p className="mt-3 text-[#5d6043]">
                Shop our most loved loaves, boxes, and creamy yoghurt treats.
              </p>
            </div>
            <Link href="/shop" className="editorial-button-outline px-5 py-2.5 text-sm">
              View all
            </Link>
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

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="relative grid overflow-hidden rounded-[36px] bg-gradient-to-br from-[#222222] via-[#5d6043] to-[#73765a] text-[#faf9f5] shadow-[0_26px_80px_rgba(34,34,34,0.16)] md:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10 p-7 md:p-12 lg:p-14">
              <h2 className="prototype-heading text-3xl sm:text-4xl">
                Send a Cozy Oven gift box.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#faf9f5]/82">
                Build a warm gift for birthdays, thank-yous, office teams, and just-because surprises.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Birthday", "Thank you", "Office treat", "Get well soon"].map((occasion) => (
                  <span
                    key={occasion}
                    className="rounded-full border border-[#faf9f5]/20 bg-[#faf9f5]/10 px-4 py-2 text-sm font-medium text-[#faf9f5]"
                  >
                    {occasion}
                  </span>
                ))}
              </div>
              <Link
                href={giftPackage ? `/product/${giftPackage.id}` : "/shop#package"}
                className="mt-8 inline-flex rounded-full bg-[#faf9f5] px-7 py-3.5 font-semibold text-[#222222] shadow-[0_16px_30px_rgba(34,34,34,0.18)] transition hover:-translate-y-0.5"
              >
                {giftPackage ? "Build a gift box" : "Shop packages"}
              </Link>
            </div>
            <div className="relative min-h-[280px] md:min-h-full">
              <Image
                src={giftImage}
                alt={giftPackage?.productName || "Cozy Oven gift box"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </div>
        </section>

        {(yogurtProducts.length > 0 || resolvedProducts.length > 0) && (
          <section className="border-y border-[rgba(34,34,34,0.1)] bg-[#faf9f5]/60">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
              <div>
                <h2 className="prototype-heading text-3xl sm:text-4xl">Yoghurt</h2>
                <p className="mt-4 leading-7 text-[#5d6043]">
                  Made with real fruit, live cultures and absolutely no preservatives.
                </p>
                <Link href="/shop" className="editorial-button-outline mt-6 px-6 py-3">
                  Shop Yoghurt
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(yogurtProducts.length ? yogurtProducts.slice(0, 2) : resolvedProducts.slice(0, 2)).map(
                  (product) => (
                    <EditorialProductCard key={product.id} product={product} compact />
                  )
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-8 max-w-2xl">
            <h2 className="prototype-heading text-3xl sm:text-4xl">
              WhatsApp praise from Tema and beyond.
            </h2>
            <p className="mt-3 text-[#5d6043]">
              1,300+ deliveries, quick drop-offs, and messages that keep us baking.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[36px] bg-[#222222] p-5 shadow-[0_26px_80px_rgba(34,34,34,0.16)]">
              <div className="flex items-center gap-3 px-3 pb-4 text-[#faf9f5]">
                <span className="h-3 w-3 rounded-full bg-[#20C05C]" />
                <strong className="font-semibold">Cozy Oven reviews</strong>
              </div>
              <div className="relative h-[420px] overflow-hidden rounded-[28px] bg-[#b9aca2] p-5">
                <div className="whatsapp-review-track space-y-4">
                  {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map(
                    (testimonial, index) => (
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
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="grid content-start gap-4">
              {testimonials.slice(0, 3).map((testimonial) => (
                <article
                  key={testimonial.id}
                  className="rounded-[28px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/80 p-6 shadow-[0_12px_40px_rgba(34,34,34,0.10)]"
                >
                  <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em] text-[#222222] sm:text-2xl">
                    &quot;{testimonial.message}&quot;
                  </h3>
                </article>
              ))}
              <a
                href="https://api.whatsapp.com/message/QAOMJAY7KI7WP1"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#2F855A] px-6 py-3.5 font-semibold text-[#faf9f5] shadow-[0_16px_30px_rgba(34,34,34,0.18)] transition hover:-translate-y-0.5"
              >
                <MessageCircle className="h-5 w-5" />
                Reach out on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="grid items-center gap-8 rounded-[36px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/78 p-7 shadow-[0_12px_40px_rgba(34,34,34,0.10)] md:grid-cols-[260px_1fr] md:p-10">
            <div className="grid aspect-square w-full max-w-[220px] place-items-center rounded-[32px] bg-gradient-to-br from-[#b9aca2] via-[#73765a] to-[#5d6043] shadow-[0_26px_80px_rgba(34,34,34,0.16)] md:-rotate-2">
              <span className="text-7xl font-semibold text-[#faf9f5]">A</span>
            </div>
            <div>
              <h2 className="prototype-heading text-3xl sm:text-4xl">
                Baked by Anita, trusted by repeat customers.
              </h2>
              <p className="mt-4 max-w-3xl leading-7 text-[#5d6043]">
                A small Tema team — warm, creative, and committed to fresh banana bread that makes the day better.
              </p>
              <Link href="/about" className="editorial-button-outline mt-6 px-6 py-3">
                Meet Anita
              </Link>
            </div>
          </div>
        </section>

        {previewFaqs.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
            <div className="mb-6 max-w-2xl">
              <h2 className="prototype-heading text-3xl sm:text-4xl">
                Delivery, freshness and gifting.
              </h2>
            </div>
            <div className="grid max-w-3xl gap-3">
              {previewFaqs.map((faq, index) => (
                <details
                  key={faq.id}
                  open={index === 0}
                  className="rounded-[22px] border border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/78 p-5 shadow-[0_12px_40px_rgba(34,34,34,0.10)]"
                >
                  <summary className="cursor-pointer text-base font-semibold text-[#222222]">
                    {faq.question}
                  </summary>
                  <p className="mt-3 leading-7 text-[#5d6043]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="bg-gradient-to-br from-[#222222] via-[#5d6043] to-[#73765a] px-4 py-16 text-[#faf9f5] sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col gap-6 text-center">
            <h2 className="prototype-heading text-3xl sm:text-4xl">
              New flavours, fresh bakes and special offers.
            </h2>
            <form
              onSubmit={handleNewsletter}
              className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="home-newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="home-newsletter-email"
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="min-h-12 flex-1 rounded-full border border-[#faf9f5]/15 bg-[#faf9f5]/10 px-5 text-[#faf9f5] outline-none placeholder:text-[#b9aca2]/70 focus:border-[#b9aca2]"
              />
              <button type="submit" className="editorial-button min-h-12 px-8">
                Subscribe
              </button>
            </form>
            {newsletterStatus && (
              <p className="text-sm text-[#faf9f5]/85" role="status" aria-live="polite">
                {newsletterStatus}
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
