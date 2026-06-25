"use client";

import { Instagram, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#211712] text-[#FAF6F1]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
            Cozy Oven
          </p>
          <h2 className="font-editorial mt-4 text-4xl leading-tight">
            Premium banana bread, made with warmth.
          </h2>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#E8DDD0]">
            Handcrafted banana bread, yoghurt, and gift boxes made fresh with care.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#C8863A]">
            Explore
          </h3>
          <div className="grid gap-3 text-sm text-[#E8DDD0]">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/shop" className="hover:text-white">Shop</Link>
            <Link href="/about" className="hover:text-white">Our Story</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#C8863A]">
            Contact
          </h3>
          <div className="grid gap-3 text-sm text-[#E8DDD0]">
            <a href="mailto:info@cozyoven.store" className="hover:text-white">info@cozyoven.store</a>
            <p>Tema Community 22, Nhmf Estates</p>
            <div className="mt-3 flex gap-4">
              <a
                href="https://www.tiktok.com/@cozyovengh?_r=1&_t=ZM-933sQOzBXiK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8DDD0] transition-colors hover:text-white"
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
                className="text-[#E8DDD0] transition-colors hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:info@cozyoven.store" className="text-[#E8DDD0] transition-colors hover:text-white" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-[#BDAE9D]">
        © {new Date().getFullYear()} Cozy Oven. All rights reserved.
      </div>
    </footer>
  );
}
