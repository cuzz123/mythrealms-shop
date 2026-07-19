"use client";

import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  delay?: number;
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className" | "style">;

export function ScrollReveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
  ...props
}: ScrollRevealProps) {
  const revealDelay = Math.min(Math.max(delay, 0), 240);

  return (
    <Tag
      {...props}
      className={`scroll-reveal ${className || ""}`}
      data-reveal-ready="false"
      data-reveal-visible="true"
      style={{ "--reveal-delay": `${revealDelay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
