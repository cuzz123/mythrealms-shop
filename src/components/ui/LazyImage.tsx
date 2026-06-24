"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export function LazyImage({
  src, alt, fill, sizes, priority, className, containerClassName,
}: {
  src: string; alt: string; fill?: boolean; sizes?: string;
  priority?: boolean; className?: string; containerClassName?: string;
}) {
  const [ready, setReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setReady(false);
    // Preload via JavaScript Image() — only show after FULL download
    const img = new window.Image();
    img.onload = () => { if (mounted.current) setReady(true); };
    img.onerror = () => { if (mounted.current) setReady(true); };
    img.src = src;
    return () => { mounted.current = false; };
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${containerClassName || ""}`}>
      {!ready && <div className="absolute inset-0 bg-[#1A1816]" />}
      {ready && (
        <Image
          src={src} alt={alt} fill={fill} sizes={sizes} priority={priority}
          className={`animate-fade-in ${className || ""}`}
        />
      )}
    </div>
  );
}
