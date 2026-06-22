"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
  };

  return (
    <section className="premium-shell py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="premium-kicker mb-3">Bakery notes</p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#231913] mb-4">
          Flavor drops, gifting ideas, and sweet updates.
        </h2>
        <p className="text-lg text-[#6b5d50] mb-8">
          Subscribe for seasonal boxes, new flavors, and special offers delivered straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 rounded-full border border-[#eadfce] bg-white focus:border-[#c79a4b] focus:outline-none text-[#231913]"
            required
          />
          <button
            type="submit"
            className="premium-button px-8 py-4 flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
