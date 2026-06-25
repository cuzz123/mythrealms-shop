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
    const img = new window.Image();
    const timeout = setTimeout(() => { if (mounted.current) setReady(true); }, 10000);
    img.onload = () => { clearTimeout(timeout); if (mounted.current) setReady(true); };
    img.onerror = () => { clearTimeout(timeout); if (mounted.current) setReady(true); };
    img.src = src;
    return () => { mounted.current = false; clearTimeout(timeout); };
  }, [src]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName || ""}`}>
      {/* Image always in DOM — maintains correct dimensions, no CLS */}
      <Image
        src={src} alt={alt} fill={fill} sizes={sizes} priority={priority}
        className={`transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"} ${className || ""}`}
      />
      {/* Dark overlay covers image while loading, fades out on ready */}
      <div
        className={`absolute inset-0 bg-[#1A1816] transition-opacity duration-300 pointer-events-none ${ready ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
}
