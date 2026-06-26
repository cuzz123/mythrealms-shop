"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";

const slides = [
  { image: "/images/1688-hero/cover-pearl.webp", title: "Pearl Collection", subtitle: "Luminous freshwater & saltwater pearls · 20 styles", cta: "Shop Pearls", href: "/collections/pearl-series" },
  { image: "/images/1688-hero/cover-crystal.webp", title: "Pearl & Crystal", subtitle: "Luminous crystal with delicate shimmer · 9 styles", cta: "Shop Pearl & Crystal", href: "/collections/pearl-crystal-series" },
  { image: "/images/1688-hero/单品1.webp", mobileImage: "/images/1688-hero-mobile/单品1.webp", title: "Blush Rose Bracelet", subtitle: "Soft rose-toned natural stone", cta: "Shop This Piece", href: "/products/blush-rose-single" },
  { image: "/images/1688-hero/单品3.webp", mobileImage: "/images/1688-hero-mobile/单品3.webp", title: "Golden Accent Bracelet", subtitle: "Warm gold-accent · sophisticated layering", cta: "Shop This Piece", href: "/products/golden-accent-single" },
  { image: "/images/1688-hero/单品4.webp", mobileImage: "/images/1688-hero-mobile/单品4.webp", title: "Crystal Bling Bracelet", subtitle: "Sparkling crystal facets · pure brilliance", cta: "Shop This Piece", href: "/products/crystal-bling-single" },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [direction, setDirection] = useState(1);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);
  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [isPaused, goNext, prefersReducedMotion]);

  return (
    <div className="relative w-full h-[70vh] md:h-screen overflow-hidden bg-[#0A0808]">
      {/* Preload adjacent image */}
      <div className="absolute inset-0" style={{ visibility: "hidden" }}>
        <LazyImage
          src={slides[(current + 1) % slides.length].image}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
          containerClassName="absolute inset-0"
        />
      </div>

      {/* Slides with fade transition + Ken Burns zoom */}
      {slides.map((s, i) => {
        const isActive = i === current;
        return (
          <Link
            key={i}
            href={s.href}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            <div className={`absolute inset-0 overflow-hidden ${isActive ? "animate-kenburns" : ""}`}>
                {/* Desktop: landscape */}
                <div className="hidden md:block absolute inset-0">
                  <LazyImage src={s.image} alt={s.title} fill sizes="100vw" priority={isActive} className="object-cover" containerClassName="absolute inset-0" />
                </div>
                {/* Mobile: portrait */}
                <div className="block md:hidden absolute inset-0">
                  <LazyImage src={s.mobileImage || s.image} alt={s.title} fill sizes="100vw" priority={isActive} className="object-cover" containerClassName="absolute inset-0" />
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent md:from-black/60 md:via-black/30" />
          </Link>
        );
      })}

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center z-20 pb-16 md:pb-0 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div
            key={current}
            className="animate-slideInContent max-w-xs sm:max-w-md md:max-w-lg"
          >
            <h2 className="font-serif text-3xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-2 md:mb-4">{slides[current].title}</h2>
            <p className="text-white/75 text-sm md:text-base mb-4 md:mb-6 line-clamp-2 md:line-clamp-none">{slides[current].subtitle}</p>
            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <Link href={slides[current].href} className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition">
                {slides[current].cta}<ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/collections/curated-singles" className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 border border-white/30 text-white rounded-full font-semibold text-sm hover:bg-white/10 transition">
                Browse All Singles<ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>


      {/* Progress bar — subtle grey track, white fill on active */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex gap-[8px]">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="flex-1 h-[4px] bg-white/10 cursor-pointer relative overflow-hidden"
          >
            <div
              key={`progress-${current}`}
              className="absolute inset-0 bg-white"
              style={{
                width: i === current ? "100%" : "0%",
                animation: i === current ? "progressFill 5s linear forwards" : "none",
              }}
            />
          </button>
        ))}
      </div>

    </div>
  );
}
