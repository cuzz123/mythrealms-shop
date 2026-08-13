import { RelatedProducts } from "@/components/editorial/RelatedProducts";
import type { GiftSection } from "@/lib/editorial/gifts";

export function GiftProductSections({ sections }: { sections: readonly GiftSection[] }) {
  return sections.filter((section) => section.products.length > 0).map((section) => {
    const headingId = `${section.id}-products-title`;

    return (
      <section
        key={section.id}
        id={section.id}
        className="scroll-mt-28"
        aria-labelledby={headingId}
      >
        <RelatedProducts
          products={section.products}
          title={section.title}
          description={section.description}
          headingId={headingId}
        />
      </section>
    );
  });
}
