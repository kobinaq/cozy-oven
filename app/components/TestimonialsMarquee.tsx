"use client";

import { motion } from "framer-motion";

interface Testimonial {
  id: string;
  message: string;
}

interface TestimonialsMarqueeProps {
  testimonials: Testimonial[];
  speed?: number;
}

function MarqueeRow({
  testimonials,
  speed,
  reverse = false,
}: {
  testimonials: Testimonial[];
  speed: number;
  reverse?: boolean;
}) {
  const duplicated = [...testimonials, ...testimonials];
  const cardWidth = 360;
  const gap = 24;
  const totalWidth = (cardWidth + gap) * testimonials.length;

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6"
        animate={{ x: reverse ? [-totalWidth, 0] : [0, -totalWidth] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {duplicated.map((testimonial, index) => (
          <article
            key={`${testimonial.id}-${index}`}
            className="h-56 w-[360px] flex-shrink-0 rounded-[30px] border border-[rgba(48,23,15,0.09)] bg-[#FFFDF7]/80 p-7 shadow-[0_12px_40px_rgba(48,23,15,0.10)]"
          >
            <p className="font-editorial text-4xl leading-tight text-[#C97D35]">&quot;</p>
            <p className="mt-2 line-clamp-5 text-lg font-semibold leading-8 text-[#30170F]">
              {testimonial.message}
            </p>
          </article>
        ))}
      </motion.div>
    </div>
  );
}

export default function TestimonialsMarquee({ testimonials, speed = 34 }: TestimonialsMarqueeProps) {
  const midpoint = Math.ceil(testimonials.length / 2);
  const firstRow = testimonials.slice(0, midpoint);
  const secondRow = testimonials.slice(midpoint);

  return (
    <section className="overflow-hidden py-20 lg:py-28">
      <div className="mx-auto mb-12 max-w-4xl px-4 text-center">
        <p className="editorial-eyebrow mb-3">Customer Notes</p>
        <h2 className="font-editorial text-5xl leading-[0.92] tracking-[-0.055em] sm:text-6xl">
          Kind words from people who made room for a slice.
        </h2>
      </div>
      <div className="space-y-6">
        <MarqueeRow testimonials={firstRow.length ? firstRow : testimonials} speed={speed} />
        <MarqueeRow testimonials={secondRow.length ? secondRow : testimonials} speed={speed + 8} reverse />
      </div>
    </section>
  );
}
