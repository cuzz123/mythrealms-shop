"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";

const slides = [
  { image: "/images/1688-hero/ChatGPT_Image_2026年6月24日_22_03_37.png", title: "Blush Rose Bracelet", subtitle: "Soft rose-toned natural stone · hand-selected", cta: "Shop This Piece", href: "/products/blush-rose-single" },
  { image: "/images/1688-hero/ChatGPT_Image_2026年6月24日_22_08_34.png", title: "Copper Elegance Bracelet", subtitle: "Refined copper · intricate detailing", cta: "Shop This Piece", href: "/products/copper-elegance-single" },
  { image: "/images/1688-hero/ChatGPT_Image_2026年6月24日_22_15_17.png", title: "Golden Accent Bracelet", subtitle: "Warm gold-accent · sophisticated layering", cta: "Shop This Piece", href: "/products/golden-accent-single" },
  { image: "/images/1688-hero/ChatGPT_Image_2026年6月24日_22_30_53.png", title: "Crystal Bling Bracelet", subtitle: "Sparkling crystal facets · pure brilliance", cta: "Shop This Piece", href: "/products/crystal-bling-single" },
  { image: "/images/1688-hero/ChatGPT_Image_2026年6月24日_22_42_20.png", title: "Dark Stone Bracelet", subtitle: "Deep mineral stone · grounded protection", cta: "Shop This Piece", href: "/products/dark-stone-single" },
  { image: "/images/1688-hero/ChatGPT_Image_2026年6月24日_22_42_43.png", title: "Turquoise Dream Bracelet", subtitle: "Vibrant turquoise · desert sky spirit", cta: "Shop This Piece", href: "/products/turquoise-single" },
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
    <div className="relative w-full h-screen overflow-hidden bg-[#0A0808]">
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
            <div className={`absolute inset-0 overflow-hidden ${isActive ? "animate-subtle-zoom" : ""}`}>
                <LazyImage
                  src={s.image}
                  alt={s.title}
                  fill
                  sizes="100vw"
                  priority={isActive}
                  className="object-cover"
                  containerClassName="absolute inset-0"
                />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent md:from-black/60 md:via-black/30" />
          </Link>
        );
      })}

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-end md:items-center z-20 pb-24 md:pb-0 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full">
          <div
            key={current}
            className="animate-slideInContent max-w-xs sm:max-w-md md:max-w-lg"
          >
            <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold mb-2 md:mb-3">Curated Gemstones</span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-white leading-tight mb-2 md:mb-4">{slides[current].title}</h2>
            <p className="text-white/75 text-sm md:text-base mb-4 md:mb-6 line-clamp-2 md:line-clamp-none">{slides[current].subtitle}</p>
            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <Link href={slides[current].href} className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition">
                {slides[current].cta}<ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/guardian-quiz" className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 border border-white/30 text-white rounded-full font-semibold text-sm hover:bg-white/10 transition">
                Find Your Stone<ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow controls */}
      <button onClick={goPrev} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur-sm z-30">
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      <button onClick={goNext} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur-sm z-30">
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      {/* Bottom bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
        <button onClick={() => setIsPaused(!isPaused)} className="text-white/60 hover:text-white transition">
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
        <div className="flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`rounded-full transition-all ${i === current ? "w-8 h-2 bg-[var(--accent)]" : "w-2 h-2 bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
