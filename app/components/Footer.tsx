"use client";

import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PHONE = "0249612035";
const WHATSAPP_URL = "https://api.whatsapp.com/message/QAOMJAY7KI7WP1";

export default function Footer() {
  return (
    <footer className="editorial-shell border-t border-[rgba(34,34,34,0.12)]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-4 py-12 sm:px-6 lg:flex-row lg:px-8">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Cozy Oven home">
            <Image src="/cozy3.png" alt="Cozy Oven" width={58} height={58} className="rounded-full" />
            <span>
              <strong className="block leading-none text-[#222222]">Cozy Oven</strong>
              <small className="mt-1 block text-xs text-[#5d6043]">Fresh banana bread & gift boxes</small>
            </span>
          </Link>
          <p className="mt-5 text-sm leading-7 text-[#5d6043]">
            Handcrafted banana bread, yoghurt, and gift-ready packages made fresh with care in Tema.
          </p>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold text-[#222222]">Explore</h3>
          <div className="grid gap-3 text-sm font-black text-[#5d6043]">
            <Link href="/" className="hover:text-[#bd6325]">Home</Link>
            <Link href="/shop" className="hover:text-[#bd6325]">Shop</Link>
            <Link href="/about" className="hover:text-[#bd6325]">Our Story</Link>
            <Link href="/contact" className="hover:text-[#bd6325]">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-sm font-semibold text-[#222222]">Contact</h3>
          <div className="grid gap-3 text-sm text-[#5d6043]">
            <a href="mailto:info@cozyoven.store" className="font-black text-[#5d6043] hover:text-[#bd6325]">
              info@cozyoven.store
            </a>
            <a href={`tel:${PHONE}`} className="font-black text-[#5d6043] hover:text-[#bd6325]">
              {PHONE}
            </a>
            <p>Tema Community 22, Nhmf Estates</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a
                href={`tel:${PHONE}`}
                className="grid h-11 w-11 place-items-center rounded-full bg-[#faf9f5] text-[#222222] shadow-[inset_0_0_0_1px_rgba(34,34,34,0.09)] transition hover:text-[#bd6325]"
                aria-label="Call Cozy Oven"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full bg-[#2F855A] text-[#faf9f5] shadow-[0_8px_20px_rgba(47,133,90,0.28)] transition hover:bg-[#276749]"
                aria-label="WhatsApp Cozy Oven"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@cozyovengh?_r=1&_t=ZM-933sQOzBXiK"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full bg-[#faf9f5] text-[#222222] shadow-[inset_0_0_0_1px_rgba(34,34,34,0.09)] transition hover:text-[#bd6325]"
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
                className="grid h-11 w-11 place-items-center rounded-full bg-[#faf9f5] text-[#222222] shadow-[inset_0_0_0_1px_rgba(34,34,34,0.09)] transition hover:text-[#bd6325]"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@cozyoven.store"
                className="grid h-11 w-11 place-items-center rounded-full bg-[#faf9f5] text-[#222222] shadow-[inset_0_0_0_1px_rgba(34,34,34,0.09)] transition hover:text-[#bd6325]"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(34,34,34,0.1)] px-4 py-5 text-center text-xs text-[#5d6043]">
        Copyright {new Date().getFullYear()} Cozy Oven. All rights reserved.
      </div>
    </footer>
  );
}
