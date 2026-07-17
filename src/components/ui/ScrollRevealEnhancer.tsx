"use client";

import { useEffect } from "react";

export function ScrollRevealEnhancer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      return;
    }

    const observers = new Set<IntersectionObserver>();
    const animationFrame = window.requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal-ready]").forEach((element) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              element.dataset.revealVisible = "true";
              observer.disconnect();
              observers.delete(observer);
            }
          },
          { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
        );

        element.dataset.revealReady = "true";
        element.dataset.revealVisible = "false";
        observers.add(observer);
        observer.observe(element);
      });
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return null;
}
