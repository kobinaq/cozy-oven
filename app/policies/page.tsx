import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  policiesClosing,
  policiesIntro,
  policySections,
} from "../lib/policiesContent";

export const metadata: Metadata = {
  title: "Ordering Policies | Cozy Oven",
  description:
    "Cozy Oven ordering, delivery, and customer policies for Accra and beyond.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesPage() {
  return (
    <>
      <Navbar />
      <main className="editorial-shell min-h-screen pb-20 pt-24">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#bd6325]">
            Terms & policies
          </p>
          <h1 className="font-editorial mt-3 text-3xl tracking-[-0.03em] text-[#222222] sm:text-4xl">
            Ordering, delivery & customer policies
          </h1>
          <p className="mt-6 text-base leading-8 text-[#5d6043]">{policiesIntro}</p>

          <div className="mt-12 space-y-10">
            {policySections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-t border-[rgba(34,34,34,0.1)] pt-8"
              >
                <h2 className="font-editorial text-2xl tracking-[-0.02em] text-[#222222]">
                  {section.title}
                </h2>
                {section.intro ? (
                  <p className="mt-4 text-sm leading-7 text-[#5d6043]">{section.intro}</p>
                ) : null}
                <div className="mt-5 space-y-6">
                  {section.blocks.map((block, blockIndex) => (
                    <div key={`${section.id}-${blockIndex}`}>
                      {block.heading ? (
                        <h3 className="mb-3 text-sm font-semibold text-[#222222]">
                          {block.heading}
                        </h3>
                      ) : null}
                      {block.paragraphs?.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="mb-3 text-sm leading-7 text-[#5d6043] last:mb-0"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {block.bullets ? (
                        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5d6043]">
                          {block.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 text-sm leading-7 text-[#5d6043]">{policiesClosing}</p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/checkout" className="editorial-button px-6 py-3">
              Continue to checkout
            </Link>
            <Link href="/contact" className="editorial-button-outline px-6 py-3">
              Contact us
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
