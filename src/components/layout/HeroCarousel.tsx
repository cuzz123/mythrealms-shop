"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const slides = [
  { image:"/images/hero/nine-tailed-fox.png", title:"Nine-Tailed Fox · 九尾狐", subtitle:"Wisdom earned through centuries — sterling silver pendant", cta:"Shop Beast Pendants", href:"/collections/beast-pendants" },
  { image:"/images/hero/azure-dragon.png", title:"Azure Dragon · 青龙", subtitle:"Guardian of the Eastern sky — constellation ring set", cta:"Shop Dragons", href:"/collections/beast-pendants" },
  { image:"/images/hero/qilin.png", title:"Qilin · 麒麟", subtitle:"Peace and prosperity — jade protection bracelet", cta:"Discover Qilin", href:"/collections/beast-pendants" },
  { image:"/images/hero/phoenix.png", title:"Phoenix · 凤凰", subtitle:"Rebirth and renewal in gold and vermillion crystal", cta:"Shop Phoenix", href:"/collections/beast-pendants" },
  { image:"/images/hero/white-tiger.png", title:"White Tiger · 白虎", subtitle:"Guardian of the West — silver guardian cuff", cta:"Shop Guardians", href:"/collections/four-symbols" },
  { image:"/images/hero/black-tortoise.png", title:"Black Tortoise · 玄武", subtitle:"Endurance and longevity — onyx & hematite bracelet", cta:"Shop Tortoise", href:"/collections/four-symbols" },
  { image:"/images/hero/bai-ze.png", title:"Bai Ze · 白泽", subtitle:"The beast who knows all 11,520 creatures — wisdom talisman", cta:"Shop Talismans", href:"/collections/talismans" },
  { image:"/images/hero/kun-peng.png", title:"Kun Peng · 鲲鹏", subtitle:"Fish to bird — the ultimate transformation pendant set", cta:"Discover Kun Peng", href:"/collections/beast-pendants" },
  { image:"/images/hero/yinglong.png", title:"Yinglong · 应龙", subtitle:"The only winged dragon — bronze cufflinks of power", cta:"Shop Yinglong", href:"/collections/beast-pendants" },
  { image:"/images/hero/taotie.png", title:"Taotie · 饕餮", subtitle:"Shang dynasty power — ancient bronze protection amulet", cta:"Shop Taotie", href:"/collections/talismans" },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const next = useCallback(() => setCurrent((prev) => (prev + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length), []);
  useEffect(() => { if (isPaused) return; const timer = setInterval(next, 5000); return () => clearInterval(timer); }, [isPaused, next]);
  const slide = slides[current];
  return (
    <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden bg-[#2C1810]">
      {slides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {s.image && <img src={s.image} alt={s.title} className="w-full h-full object-cover" />}
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
