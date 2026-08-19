import { PurchaseGuidePage, buildPurchaseGuideMetadata } from "@/lib/editorial/purchase-guide-page";
import { getPurchaseGuide } from "@/lib/editorial/purchase-guides";

const slug = "bracelet-size-and-fit-guide" as const;
export const metadata = buildPurchaseGuideMetadata(getPurchaseGuide(slug));

export default function BraceletSizeAndFitGuidePage() {
  return <PurchaseGuidePage slug={slug} />;
}
