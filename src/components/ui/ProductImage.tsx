// A CSS-gradient based product image placeholder. No external dependencies.
// Generates a unique gradient based on the product name hash, making each product visually distinct.
// Props: name (string), width? (number), height? (number), className? (string)

import { cn } from "@/lib/utils"

/**
 * Deterministic hash function that converts a string into a positive integer.
 * Same input always produces the same output.
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0 // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

interface ProductImageProps {
  /** Product name used to generate a deterministic gradient */
  name: string
  /** Optional explicit width (component is responsive by default via className) */
  width?: number
  /** Optional explicit height (component is responsive by default via className) */
  height?: number
  /** Additional CSS classes — use for sizing (e.g. "absolute inset-0" or "w-full h-48") */
  className?: string
}

export function ProductImage({ name, width, height, className }: ProductImageProps) {
  const hash = hashString(name)

  // ---- Color generation ----
  // Primary hue: 0-360
  const hue1 = hash % 360
  // Secondary hue: offset by 30-90 degrees for visual contrast
  const hue2 = (hue1 + 30 + (hash % 60)) % 360
  // Saturation: 30-70% (muted, elegant colors)
  const sat1 = 30 + ((hash >> 3) % 40)
  const sat2 = 30 + ((hash >> 7) % 40)
  // Lightness: 18-42% for dark rich gradients; accent lighter for depth
  const light1 = 18 + ((hash >> 11) % 12)
  const light2 = 30 + ((hash >> 15) % 15)

  // Accent color for subtle highlights
  const accentHue = (hue1 + 180) % 360
  const accentSat = 50 + ((hash >> 19) % 30)
  const accentLight = 50 + ((hash >> 23) % 20)

  // ---- Pattern selection (0, 1, or 2) ----
  const patternType = (hash >> 27) % 3

  // ---- First letter for watermark ----
  // Use the first alphanumeric character from the name
  const firstAlpha = name.trim().match(/[A-Za-z0-9一-鿿]/)
  const watermark = firstAlpha ? firstAlpha[0].toUpperCase() : "?"

  // ---- Build style objects ----
  const gradient = `linear-gradient(135deg, hsl(${hue1}, ${sat1}%, ${light1}%) 0%, hsl(${hue2}, ${sat2}%, ${light2}%) 40%, hsl(${accentHue}, ${accentSat}%, ${accentLight}%) 100%)`

  // Subtle pattern overlays using CSS backgrounds
  const patternOverlay =
    patternType === 0
      ? {
          // Dot grid pattern
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }
      : patternType === 1
        ? {
            // Diagonal line pattern
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 10px)",
          }
        : {
            // Crosshatch pattern
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 6px)",
          }

  const containerStyle: React.CSSProperties = {
    background: gradient,
    ...patternOverlay,
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
  }

  // ---- Render ----
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className
      )}
      style={containerStyle}
    >
      {/* Subtle inner glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Watermark letter */}
      <span
        className="select-none font-serif text-[clamp(2.5rem,12vw,7rem)] font-bold text-white/[0.07] pointer-events-none leading-none"
        aria-hidden="true"
      >
        {watermark}
      </span>
    </div>
  )
}
