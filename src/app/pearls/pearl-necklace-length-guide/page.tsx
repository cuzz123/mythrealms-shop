import { PurchaseGuidePage, buildPurchaseGuideMetadata } from "@/lib/editorial/purchase-guide-page";
import { getPurchaseGuide } from "@/lib/editorial/purchase-guides";

const slug = "pearl-necklace-length-guide" as const;
export const metadata = buildPurchaseGuideMetadata(getPurchaseGuide(slug));

export default function PearlNecklaceLengthGuidePage() {
  return <PurchaseGuidePage slug={slug} />;
}
