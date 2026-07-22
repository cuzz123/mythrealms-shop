"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { HOMEPAGE_HERO_SLIDES } from "@/lib/homepage-editorial";

export function HomepageHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const hero = HOMEPAGE_HERO_SLIDES[activeSlide];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HOMEPAGE_HERO_SLIDES.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      className="relative -mt-16 [--homepage-category-reveal:10rem] lg:[--homepage-category-reveal:18rem] aspect-[4/5] overflow-hidden bg-[#24312f] text-white sm:aspect-[3/2] lg:aspect-[16/9]"
      aria-labelledby="homepage-hero-title"
    >
      {HOMEPAGE_HERO_SLIDES.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={index === activeSlide ? slide.alt : ""}
          aria-hidden={index !== activeSlide}
          fill
          preload={index === 0}
          sizes="100vw"
          className={`object-cover object-[58%_center] transition-opacity duration-700 sm:object-[65%_center] ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,22,21,.74)_0%,rgba(13,22,21,.28)_48%,rgba(13,22,21,.06)_72%)]" />
      <div className="relative mx-auto flex h-full max-w-7xl items-end px-6 pb-10 pt-24 sm:pb-16 sm:pt-28 lg:pb-20 lg:pt-32">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase text-white/80">{hero.eyebrow}</p>
          <h1 id="homepage-hero-title" className="mt-4 max-w-lg font-serif text-4xl font-medium leading-none sm:text-6xl lg:text-7xl">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/85 md:text-base">
            {hero.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5 sm:mt-8">
            <Link href="/collections/pearl-series" className="inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-[#1d2423] transition-colors hover:bg-[#e9e8df]">
              Shop the Pearl Edit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pearls" className="border-b border-white/70 pb-1 text-sm font-semibold text-white transition-colors hover:border-white">
              Read the Pearl Guide
            </Link>
          </div>
          <div className="mt-8 flex gap-2" aria-label="Homepage editorial slides">
            {HOMEPAGE_HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-1.5 w-7 transition-colors ${index === activeSlide ? "bg-white" : "bg-white/45 hover:bg-white/75"}`}
                aria-label={`Show ${slide.eyebrow}`}
                aria-current={index === activeSlide}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
