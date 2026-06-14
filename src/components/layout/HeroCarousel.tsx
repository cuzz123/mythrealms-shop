"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  { image:"/images/hero/hero-mansions.webp", title:"28 Mansions · 二十八宿", subtitle:"28 crystal bracelets — each mapped to a star in the ancient Chinese sky", cta:"Shop Now", href:"/collections/28-mansions" },
  { image:"/images/products/water-element-bracelet.png", title:"Five Elements · 五行", subtitle:"Wood · Fire · Earth · Metal · Water — the ancient Chinese philosophy in gemstone form", cta:"Shop Now", href:"/collections/five-elements" },
  { image:"/images/products/moon-full-medallion.png", title:"Moon Phases · 月相", subtitle:"From crescent to full — each phase a moment in the moon goddess journey across the sky", cta:"Shop Now", href:"/collections/moon-phases" },
  { image:"/images/products/pearl-aquamarine-bracelet.png", title:"Ocean Pearls · 海珠", subtitle:"Akoya pearls and aquamarine — each pearl a crystallized tear from ancient merfolk legend", cta:"Shop Now", href:"/collections/ocean-pearls" },
  { image:"/images/products/spring-cherry-necklace.png", title:"Cherry Blossom · 春樱", subtitle:"Rose gold — pink sapphire petals with diamond center, Four Seasons collection", cta:"Shop Now", href:"/collections/four-seasons" },
  { image:"/images/products/butterfly-bracelet.png", title:"Butterfly Dream · 蝶梦", subtitle:"Rose gold and diamond — Zhuangzi's dream of the butterfly, captured in precious metal", cta:"Shop Now", href:"/collections/butterfly-dream" },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [direction, setDirection] = useState(1); // 1=forward, -1=backward

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
    <div className="relative w-full min-h-[85vh] overflow-hidden bg-[#0A0808]">
      {/* Preload adjacent image for snappier transitions */}
      <div className="absolute inset-0" style={{ visibility: "hidden" }}>
        <Image
          src={slides[(current + 1) % slides.length].image}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
      </div>

      {/* Slides with horizontal slide transition */}
      {slides.map((s, i) => {
        const isActive = i === current;
        const enterFromRight = direction === 1;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              transform: isActive ? "translateX(0)" : enterFromRight ? "translateX(100%)" : "translateX(-100%)",
              transition: isActive ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
              zIndex: isActive ? 10 : 0,
              pointerEvents: isActive ? "auto" : "none",
            }}
            aria-hidden={!isActive}
          >
            {s.image && (
              <Image src={s.image} alt={s.title} fill sizes="100vw" priority={isActive} className="object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        );
      })}

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center z-20">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div
            key={current}
            className="max-w-lg"
            style={{ animation: "slideInContent 0.5s ease-out" }}
          >
            <span className="inline-block text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold mb-3">MythRealms</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-4">{slides[current].title}</h2>
            <p className="text-white/75 text-base mb-6">{slides[current].subtitle}</p>
            <Link href={slides[current].href} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition">
              {slides[current].cta}<ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Arrow controls */}
      <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur-sm z-30">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur-sm z-30">
        <ChevronRight className="w-6 h-6" />
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

      <style jsx>{`
        @keyframes slideInContent {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
