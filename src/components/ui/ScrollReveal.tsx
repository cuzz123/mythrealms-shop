import type { ReactNode } from "react";

export function ScrollReveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  return (
    <Tag
      className={`scroll-reveal visible ${className || ""}`}
    >
      {children}
    </Tag>
  );
}
