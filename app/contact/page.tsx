"use client";

import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import contactService from "../services/contactService";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitStatus(null);

    try {
      const response = await contactService.submitMessage(formData);
      if (!response?.success) {
        throw new Error(response?.message || "Failed to send message");
      }

      setSubmitMessage("Thank you for reaching out! We'll get back to you soon.");
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitMessage("We couldn't send your message. Please try WhatsApp or email us directly.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactRows = [
    { icon: Mail, label: "Email", value: "info@cozyoven.store", href: "mailto:info@cozyoven.store" },
    { icon: Phone, label: "Phone", value: "0249612035", href: "tel:0249612035" },
    { icon: MessageCircle, label: "WhatsApp", value: "Message us directly", href: "https://api.whatsapp.com/message/QAOMJAY7KI7WP1" },
    { icon: MapPin, label: "Location", value: "Tema community 22 Nhmf Estates", href: "#" },
  ];

  return (
    <>
      <Navbar />
      <main className="editorial-shell">
        <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <h1 className="font-editorial text-3xl tracking-[-0.03em] sm:text-4xl">Get in Touch</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5d6043]">
            Have questions about our products or want to place a custom order? We&apos;d love to hear from you!
          </p>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div className="space-y-4">
            {contactRows.map((row) => {
              const Icon = row.icon;
              const isWhatsapp = row.label === "WhatsApp";
              return (
                <a
                  key={row.label}
                  href={row.href}
                  target={isWhatsapp ? "_blank" : undefined}
                  rel={isWhatsapp ? "noopener noreferrer" : undefined}
                  className={`flex items-start gap-4 rounded-2xl border p-5 transition ${
                    isWhatsapp
                      ? "rounded-[26px] border-[#2F855A] bg-[#2F855A] text-[#faf9f5] shadow-[0_12px_40px_rgba(34,34,34,0.10)] hover:bg-[#276749]"
                      : "rounded-[26px] border-[rgba(34,34,34,0.09)] bg-[#faf9f5]/82 text-[#222222] shadow-[0_12px_40px_rgba(34,34,34,0.10)] hover:border-[#bd6325]"
                  }`}
                >
                  <Icon className="mt-1 h-5 w-5 shrink-0" />
                  <span>
                    <span className="block text-sm font-medium opacity-75">
                      {row.label}
                    </span>
                    <span className="mt-1 block font-semibold">{row.value}</span>
                  </span>
                </a>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="editorial-card p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-[#5d6043]">
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="editorial-input px-4 py-3"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[#5d6043]">
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="editorial-input px-4 py-3"
                  required
                />
              </label>
            </div>
            <label className="mt-5 grid gap-2 text-sm font-semibold text-[#5d6043]">
              Subject
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="editorial-input px-4 py-3"
                required
              />
            </label>
            <label className="mt-5 grid gap-2 text-sm font-semibold text-[#5d6043]">
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="editorial-input px-4 py-3"
                required
              />
            </label>

            {submitMessage && (
              <div
                className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
                  submitStatus === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {submitMessage}
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="editorial-button mt-6 min-h-14 w-full px-8 disabled:bg-[#b9aca2]">
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
