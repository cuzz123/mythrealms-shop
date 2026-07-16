import Image from "next/image";

export function LazyImage({
  src, alt, fill, sizes, priority, className, containerClassName,
}: {
  src: string; alt: string; fill?: boolean; sizes?: string;
  priority?: boolean; className?: string; containerClassName?: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${containerClassName || ""}`}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    </div>
  );
}
