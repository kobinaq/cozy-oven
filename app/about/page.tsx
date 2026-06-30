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

const locationIconImage = "https://res.cloudinary.com/daljxj4yl/image/upload/v1782836487/ChatGPT_Image_Jun_30_2026_04_19_56_PM_dqpipy.png";
const binocularsImage = "https://res.cloudinary.com/daljxj4yl/image/upload/v1782836487/ChatGPT_Image_Jun_30_2026_04_21_09_PM_pzhaav.png";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="editorial-shell">
        <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <p className="editorial-eyebrow mb-4">
            Our Story
          </p>
          <h1 className="font-editorial text-6xl leading-[0.9] tracking-[-0.07em] sm:text-7xl">
            We&apos;re so glad you&apos;re here.
          </h1>
          <div className="mx-auto mt-8 max-w-[680px] space-y-5 text-lg leading-8 text-[#80634F]">
            <p>
              Cozy Oven is built by a small but passionate team—warm, creative, and committed to giving you fresh, comforting baked goodness that truly makes your day better.
            </p>
            <p>
              Every loaf, every mini, every moment with Cozy Oven is crafted with one goal in mind: to bring comfort, joy, and quality you can taste.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="relative min-h-[360px] overflow-hidden rounded-[36px] border border-[rgba(48,23,15,0.10)] bg-[#F2DEC3] shadow-[0_18px_55px_rgba(48,23,15,0.14)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,238,189,0.75),transparent_15rem),linear-gradient(135deg,#FFF6E7_0%,#F2D3A7_46%,#C9833B_100%)] opacity-95" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(255,255,255,0.50),transparent_11rem),radial-gradient(circle_at_86%_82%,rgba(48,23,15,0.18),transparent_12rem)]" />
            <svg
              className="absolute inset-x-8 bottom-14 h-40 w-[calc(100%-4rem)] text-[#A9612A]"
              viewBox="0 0 520 180"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M108 30 C 182 8, 228 120, 304 92 S 418 78, 468 142"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="2 24"
                opacity="0.48"
              />
            </svg>
            <div className="absolute left-[3.6rem] top-[2.5rem] h-60 w-60 drop-shadow-[0_30px_45px_rgba(48,23,15,0.25)]">
              <Image
                src={locationIconImage}
                alt="Location marker"
                fill
                sizes="240px"
                className="object-contain"
                priority={false}
              />
            </div>
            <div className="absolute left-[9.85rem] top-[17.25rem] h-5 w-5 rounded-full bg-[#F3C667] shadow-[0_0_0_10px_rgba(255,248,236,0.40)]" />
            <div className="absolute bottom-16 right-16 h-7 w-7 rounded-full bg-[#30170F] shadow-[0_0_0_11px_rgba(48,23,15,0.10),0_8px_18px_rgba(48,23,15,0.24)]" />
            <div className="absolute bottom-24 right-28 h-4 w-4 rounded-full bg-[#F3C667] shadow-[0_8px_18px_rgba(169,97,42,0.22)]" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="editorial-eyebrow mb-3">
              How It Started
            </p>
            <h2 className="font-editorial text-5xl leading-[0.95] tracking-[-0.055em] sm:text-6xl">How It Started</h2>
            <div className="mt-7 space-y-4 text-lg leading-8 text-[#80634F]">
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

        <section className="bg-gradient-to-br from-[#30170F] via-[#5B3322] to-[#C97D35] px-4 py-20 text-[#FFF8EC] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#FFE8B0]">
                Why Cozy?
              </p>
              <h2 className="font-editorial text-5xl tracking-[-0.055em] sm:text-6xl">Because comfort is powerful.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {cozyReasons.map((reason) => (
                <div key={reason} className="rounded-[24px] border border-white/10 bg-white/10 p-6 text-[#FFF8EC]">
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
          <div className="relative min-h-[360px] overflow-hidden rounded-[36px] border border-[rgba(48,23,15,0.10)] bg-[#F2DEC3] shadow-[0_18px_55px_rgba(48,23,15,0.14)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(255,238,189,0.72),transparent_15rem),linear-gradient(135deg,#FFF6E7_0%,#F2D3A7_44%,#B36E35_100%)] opacity-95" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.42),transparent_14rem),radial-gradient(circle_at_82%_80%,rgba(48,23,15,0.22),transparent_13rem)]" />
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_30px_48px_rgba(48,23,15,0.24)] sm:h-80 sm:w-80">
              <Image
                src={binocularsImage}
                alt="Binoculars"
                fill
                sizes="(min-width: 640px) 320px, 288px"
                className="object-contain"
              />
            </div>
            <div className="absolute left-12 top-12 h-3 w-3 rounded-full bg-[#FFF4D7] shadow-[0_0_0_10px_rgba(255,244,215,0.18)]" />
            <div className="absolute bottom-14 right-16 h-5 w-5 rounded-full bg-[#30170F] shadow-[0_0_0_12px_rgba(48,23,15,0.08)]" />
            <div className="absolute bottom-24 left-20 h-4 w-4 rounded-full bg-[#F3C667]" />
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
