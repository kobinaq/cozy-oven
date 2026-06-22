"use client";

import { Truck, ShieldCheck, CreditCard, Gift } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Qualities() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const qualities = [
    { icon: Gift, title: "Gift-ready packaging", body: "Boxes arrive polished, protective, and ready to hand over." },
    { icon: Truck, title: "Pickup or delivery", body: "Choose store pickup or delivery details during checkout." },
    { icon: CreditCard, title: "Secure Paystack checkout", body: "Pay safely with mobile money, cards, and supported payment methods." },
    { icon: ShieldCheck, title: "Freshness promise", body: "Every order is prepared with care and tracked by the Cozy Oven team." },
  ];

  return (
    <section ref={sectionRef} className="md:py-20 py-16 bg-[#231913]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="premium-kicker mb-3 text-[#c79a4b]">The premium details</p>
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            Made to feel considered from checkout to unboxing.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
          {qualities.map((quality, index) => {
            const Icon = quality.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-white/10 bg-white/[0.06] py-6 px-5 transition-colors hover:bg-white/[0.09]"
              >
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="bg-[#c79a4b] p-3 rounded-full flex w-fit items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-6 h-6 text-[#231913]" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-0">
                    {quality.title}
                  </h3>
                  <p className="text-sm leading-6 text-white/70">{quality.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#c79a4b] mb-2">
            1,300+
          </p>
          <p className="text-lg sm:text-xl text-white/75 font-medium">
            Deliveries Made Successfully
          </p>
        </motion.div>
      </div>
    </section>
  );
}
