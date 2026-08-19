import { PurchaseGuidePage, buildPurchaseGuideMetadata } from "@/lib/editorial/purchase-guide-page";
import { getPurchaseGuide } from "@/lib/editorial/purchase-guides";

const slug = "how-to-choose-pearl-earrings" as const;
export const metadata = buildPurchaseGuideMetadata(getPurchaseGuide(slug));

export default function HowToChoosePearlEarringsPage() {
  return <PurchaseGuidePage slug={slug} />;
}
