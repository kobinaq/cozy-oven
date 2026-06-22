"use client";

import { ArrowRight, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#231913] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: "url('/cozy4.PNG')" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="premium-kicker mb-3 text-[#c79a4b]">Stay in the loop</p>
            <h2 className="mb-4 max-w-xl text-2xl font-bold sm:text-3xl">
              Gift notes, flavor drops, and bakery updates.
            </h2>

            <div className="flex max-w-xl">
              <input
                type="email"
                placeholder="Email"
                className="min-w-0 flex-1 rounded-l-full bg-white/95 px-4 py-3 text-sm text-[#231913] focus:outline-none"
              />
              <button className="rounded-r-full bg-[#c79a4b] px-4 py-3 transition-colors hover:cursor-pointer">
                <ArrowRight className="h-5 w-5 text-white transition-transform duration-200 hover:translate-x-1" />
              </button>
            </div>

            <p className="mt-4 text-xs text-white/60">
              By subscribing you agree to the{" "}
              <a href="#" className="underline hover:no-underline">
                Terms of Use
              </a>{" "}
              &{" "}
              <a href="#" className="underline hover:no-underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">About</h3>
            <ul className="space-y-3">
              <li>
                <a href="/contact" className="text-white/70 transition-colors hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/70 transition-colors hover:text-white">
                  Our Story
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@cozyoven.store"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  info@cozyoven.store
                </a>
              </li>
              <li>
                <span className="text-white/70">Tema community 22, Nhmf Estates</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative border-t border-white/10 pt-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="text-sm text-white/55">
              © {new Date().getFullYear()} Cozy Oven. All rights reserved.
            </div>
            <div className="ml-auto flex gap-4">
              <a
                href="https://www.tiktok.com/@cozyovengh?_r=1&_t=ZM-933sQOzBXiK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition-colors hover:text-[#c79a4b]"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/cozyoven.gh?igsh=NWd0bXcxczk5aGsy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition-colors hover:text-[#c79a4b]"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
