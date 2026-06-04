import { ProductCard, type Product } from "./ProductCard"

interface ProductGridProps {
  products: Product[]
  className?: string
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 ${className ?? ""}`}
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="[content-visibility:auto] [contain-intrinsic-size:auto_420px]"
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}
