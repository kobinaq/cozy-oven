import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const cozyReasons = [
  "Warmth after a long day",
  "A sweet treat that lifts your mood",
  "Something familiar, trustworthy, and made with love",
  "A reminder that God knows how to use simple things to bless others",
];

const values = ["Excellence", "Simplicity", "Thoughtfulness", "God-led creativity", "Serving our customers with joy"];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#FAF6F1] text-[#1A1410]">
        <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#C8863A]">
            Our Story
          </p>
          <h1 className="font-editorial text-5xl leading-tight sm:text-6xl">
            We&apos;re so glad you&apos;re here.
          </h1>
          <div className="mx-auto mt-8 max-w-[680px] space-y-5 text-lg leading-8 text-[#5D4A3D]">
            <p>
              Cozy Oven is built by a small but passionate team—warm, creative, and committed to giving you fresh, comforting baked goodness that truly makes your day better.
            </p>
            <p>
              Every loaf, every mini, every moment with Cozy Oven is crafted with one goal in mind: to bring comfort, joy, and quality you can taste.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-[#E8DDD0] bg-[#F3E9DD]">
            <Image src="/cozy4.PNG" alt="How it started" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
              How It Started
            </p>
            <h2 className="font-editorial text-4xl leading-tight sm:text-5xl">How It Started</h2>
            <div className="mt-7 space-y-4 text-lg leading-8 text-[#5D4A3D]">
              <p>Cozy Oven was born in a season that tested everything.</p>
              <p>
                During a time of change and uncertainty, when life felt overwhelming and plans seemed to fall apart, I found myself leaning deeper into prayer and quieting my heart to hear God&apos;s direction.
              </p>
              <p>
                In that stillness, the idea of Cozy Oven came to life—simple, comforting, nourishing banana bread that warms homes and hearts. It didn&apos;t feel forced; it felt like purpose. Like something I was being gently guided into.
              </p>
              <p>
                What started as a small home baking project soon became a way to bring joy, convenience and comfort to families, students, parents, and dessert lovers across Ghana.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#211712] px-4 py-20 text-[#FAF6F1] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
                Why Cozy?
              </p>
              <h2 className="font-editorial text-4xl sm:text-5xl">Because comfort is powerful.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {cozyReasons.map((reason) => (
                <div key={reason} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-[#E8DDD0]">
                  {reason}
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-3xl border-t border-white/10 pt-8 text-center text-lg leading-8 text-[#E8DDD0]">
              Every loaf is a small piece of comfort—fresh, wholesome, and thoughtfully made.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
              The Vision
            </p>
            <h2 className="font-editorial text-4xl leading-tight sm:text-5xl">The Vision</h2>
            <div className="mt-7 space-y-4 text-lg leading-8 text-[#5D4A3D]">
              <p className="font-semibold text-[#1A1410]">Our mission is simple:</p>
              <p>
                To bring comfort, ease, and joy to your everyday moments through high-quality, delicious banana bread.
              </p>
              <p>
                Whether you&apos;re hosting guests, treating your family, sending a gift, or grabbing a snack on the go, Cozy Oven is here to make life a little easier and a lot sweeter.
              </p>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-[#E8DDD0] bg-[#F3E9DD]">
            <Image src="/cozy2.png" alt="The vision" fill className="object-cover" />
          </div>
        </section>

        <section className="border-y border-[#E8DDD0] bg-[#FFFDF8] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-3">
            {values.map((value) => (
              <span key={value} className="rounded-full border border-[#E8DDD0] px-5 py-3 text-sm font-semibold text-[#5D4A3D]">
                {value}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <div className="editorial-card p-8 sm:p-12">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#C8863A]">
              From the Baker
            </p>
            <h2 className="font-editorial text-4xl">From the Baker</h2>
            <div className="font-editorial mx-auto mt-8 max-w-2xl space-y-5 text-xl italic leading-9 text-[#5D4A3D]">
              <p>Thank you for being here.</p>
              <p>Thank you for choosing Cozy Oven.</p>
              <p>And thank you for letting our little bakery become a part of your home and your story.</p>
              <p>
                May every loaf remind you of God&apos;s love, His provision, and His ability to use even the simplest ingredients to create something beautiful.
              </p>
            </div>
            <div className="mt-10 border-t border-[#E8DDD0] pt-8">
              <p className="text-lg font-semibold">With love & gratitude,</p>
              <p className="font-editorial mt-2 text-4xl text-[#C8863A]">Anita</p>
              <p className="mt-1 text-sm text-[#5D4A3D]">Creator of Cozy Oven</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
