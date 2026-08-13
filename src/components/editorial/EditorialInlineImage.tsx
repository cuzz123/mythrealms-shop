import Image, { type ImageProps } from "next/image";
import type React from "react";

export type EditorialInlineImageProps = Readonly<{
  src: ImageProps["src"];
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  imageClassName?: string;
}>;

export function EditorialInlineImage({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  imageClassName,
}: EditorialInlineImageProps): React.JSX.Element {
  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading="lazy"
        className={imageClassName}
      />
    </div>
  );
}
