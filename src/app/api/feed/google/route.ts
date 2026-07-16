import { NextResponse } from "next/server";

import { siteUrl } from "@/lib/site";
import { buildStorefrontFeedXml } from "@/lib/storefront/feed";

export const dynamic = "force-static";

export async function GET() {
  return new NextResponse(buildStorefrontFeedXml(siteUrl), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      Link: `<${siteUrl}/api/feed>; rel="canonical"`,
    },
  });
}
