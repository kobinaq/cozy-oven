"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import subscriberService from "../services/subscriberService";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const fullName = email.split("@")[0] || "Subscriber";
      await subscriberService.addSubscriber({
        fullName,
        email: email.trim(),
      });
      setStatus("Thanks for subscribing!");
      setEmail("");
    } catch (err: unknown) {
      const typed = err as { response?: { data?: { message?: string } } };
      setStatus(
        typed.response?.data?.message || "Could not subscribe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-16 ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4">
          Want tips on how to make these tasty delicacies???
        </h2>
        <p className="text-lg text-[#5d6043] mb-8">
          Subscribe to our newsletter and get exclusive baking tips, recipes, and special offers delivered straight to your inbox!
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 rounded-full border-2 border-[#b9aca2] focus:border-[#bd6325] focus:outline-none text-[#222222]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#5d6043] text-[#faf9f5] px-8 py-4 rounded-full font-semibold hover:bg-[#222222] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Send className="w-5 h-5" />
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
        {status && (
          <p className="mt-4 text-sm text-[#5d6043]" role="status" aria-live="polite">
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
