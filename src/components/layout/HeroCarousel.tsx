"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  { image: "/images/1688-hero/轮播图1.webp", mobileImage: "/images/1688-hero-mobile/手机hero1.webp", title: "The Serenity Collection", subtitle: "Luminous freshwater & saltwater pearls for emotional balance · 20 styles", cta: "Shop Serenity", href: "/collections/pearl-series" },
  { image: "/images/1688-hero/轮播图2.webp", mobileImage: "/images/1688-hero-mobile/手机hero2.webp", title: "The Archetypes", subtitle: "Six stones. Six intentions. No two alike. · 6 styles", cta: "Shop Archetypes", href: "/collections/curated-singles" },
  { image: "/images/1688-hero/轮播图3.webp", mobileImage: "/images/1688-hero-mobile/手机hero3.webp", title: "Balance & Light", subtitle: "Where pearl meets crystal — pieces for those who hold both at once · 4 styles", cta: "Shop Balance", href: "/collections/pearl-crystal-series" },
  { image: "/images/1688-hero/轮播图4.webp", mobileImage: "/images/1688-hero-mobile/手机hero4.webp", title: "The Archetypes", subtitle: "Six stones. Six intentions. No two alike. · 6 styles", cta: "Shop Archetypes", href: "/collections/curated-singles" },
];

const SWIPE_THRESHOLD = 50;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [direction, setDirection] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

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
  }, [isPaused, goNext, prefersReducedMotion, current]);

  // Touch swipe handlers
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        if (deltaX > 0) goPrev();
        else goNext();
      }
      touchStartX.current = null;
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goNext, goPrev]);

  return (
    <div ref={containerRef} className="relative w-full h-[70vh] md:h-screen overflow-hidden bg-[#0A0808]">
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
                  <Image src={s.image} alt={s.title} fill sizes="100vw" className="object-cover" priority={i === 0} />
                </div>
                {/* Mobile: portrait */}
                <div className="block md:hidden absolute inset-0">
                  <Image src={s.mobileImage || s.image} alt={s.title} fill sizes="100vw" className="object-cover" priority={i === 0} />
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-[2]" />
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
            <p className="text-white/75 text-sm md:text-base mb-1 md:mb-1.5 line-clamp-2 md:line-clamp-none">{slides[current].subtitle}</p>
            <p className="text-xs text-white/70 mb-4 md:mb-6 flex items-center gap-1">
              <span className="flex items-center gap-0.5 text-[#D4A84B]">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </span>
              <span>Rated 4.8/5 by 500+ customers</span>
            </p>
            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <Link href={slides[current].href} className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-[var(--accent)] text-[var(--bg)] rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition">
                {slides[current].cta}<ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>


      {/* Progress bar — subtle grey track, white fill on active */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex gap-[8px] px-[8px] pb-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="flex-1 py-2 cursor-pointer group"
          >
            <div className="h-[6px] bg-white/10 relative overflow-hidden rounded-full">
              <div
                key={`progress-${current}`}
                className="absolute inset-0 bg-white rounded-full"
                style={{
                  width: i === current ? "100%" : "0%",
                  animation: i === current ? "progressFill 5s linear forwards" : "none",
                }}
              />
            </div>
          </button>
        ))}
      </div>

    </div>
  );
}
