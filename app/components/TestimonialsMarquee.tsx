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
            className="editorial-card h-56 w-[360px] flex-shrink-0 p-7"
          >
            <p className="font-editorial text-2xl leading-tight text-[#C8863A]">“</p>
            <p className="font-editorial mt-2 line-clamp-5 text-lg italic leading-8 text-[#1A1410]">
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
    <section className="overflow-hidden bg-[#FAF6F1] py-20 lg:py-28">
      <div className="mx-auto mb-12 max-w-4xl px-4 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
          Customer Notes
        </p>
        <h2 className="font-editorial text-4xl leading-tight sm:text-5xl">
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
