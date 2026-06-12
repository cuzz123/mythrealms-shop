"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  { image:"/images/hero/hero-ninefox.webp", title:"Nine-Tailed Fox · 九尾狐", subtitle:"14k gold · diamond pavé · nine arcs of ancient wisdom", cta:"Shop Now", href:"/products/nine-tailed-fox-pendant" },
  { image:"/images/products/phoenix.png", title:"Phoenix · 凤凰", subtitle:"Rose gold necklace — graduating fire opals capture the moment of rebirth", cta:"Shop Now", href:"/products/phoenix-rebirth-necklace" },
  { image:"/images/products/summer-sun-ring.png", title:"Summer Sun · 夏至", subtitle:"Gold sunburst ring — citrine center surrounded by diamond rays, Four Seasons collection", cta:"Shop Now", href:"/products/summer-sun-ring" },
  { image:"/images/hero/hero-mansions.webp", title:"28 Mansions · 二十八宿", subtitle:"28 crystal bracelets — each mapped to a star in the ancient Chinese sky", cta:"Explore", href:"/collections/28-mansions" },
  { image:"/images/products/spring-cherry-necklace.png", title:"Cherry Blossom · 春樱", subtitle:"Rose gold necklace — pink sapphire petals with diamond center, Four Seasons collection", cta:"Shop Now", href:"/products/spring-cherry-necklace" },
  { image:"/images/products/artist-collab-jade-minimal.png", title:"Jade Minimal · 原石麒麟", subtitle:"Artist Collaboration — raw Burmese jadeite, one-of-a-kind collector piece, limited to 30", cta:"Shop Limited Edition", href:"/collections/artist-collabs" },
  { image:"/images/products/artist-collab-porcelain-phoenix.png", title:"Porcelain Phoenix · 青花凤凰", subtitle:"Artist Collaboration — Ming dynasty cobalt blue porcelain, limited to 75 pieces", cta:"Shop Limited Edition", href:"/collections/artist-collabs" },
  { image:"/images/products/winter-snowflake-pendant.png", title:"Winter Snowflake · 冬至", subtitle:"White gold pendant with brilliant diamonds — each snowflake unique, like you", cta:"Shop Now", href:"/products/winter-snowflake-pendant" },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const next = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length), []);
  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  useEffect(() => { if (isPaused || prefersReducedMotion) return; const timer = setInterval(next, 5000); return () => clearInterval(timer); }, [isPaused, next, prefersReducedMotion]);
  const slide = slides[current];
  return (
    <div className="relative w-full aspect-[16/9] max-h-[75vh] overflow-hidden bg-[#0A0808]">
      {slides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {s.image && (
            <Image src={s.image} alt={s.title} fill sizes="100vw" priority={i === current} className="object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
      ))}
      <div className="absolute inset-0 flex items-center"><div className="max-w-7xl mx-auto px-6 w-full"><div className="max-w-lg animate-slide-up" key={current}>
        <span className="inline-block text-xs uppercase tracking-[0.15em] text-[var(--accent)] font-semibold mb-3">MythRealms</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-4">{slide.title}</h2>
        <p className="text-white/75 text-base mb-6">{slide.subtitle}</p>
        <Link href={slide.href} className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white rounded-full font-semibold text-sm hover:bg-[var(--accent-hover)] transition">{slide.cta}<ChevronRight className="w-4 h-4" /></Link>
      </div></div></div>
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur-sm"><ChevronLeft className="w-5 h-5" /></button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition backdrop-blur-sm"><ChevronRight className="w-5 h-5" /></button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button onClick={() => setIsPaused(!isPaused)} className="text-white/60 hover:text-white transition">{isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}</button>
        <div className="flex gap-2">{slides.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`rounded-full transition-all ${i === current ? "w-6 h-2 bg-[var(--accent)]" : "w-2 h-2 bg-white/30 hover:bg-white/50"}`} />))}</div>
      </div>
    </div>
  );
}
