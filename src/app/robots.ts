import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    "/api/feed/blog",
    "/api/feed/google",
    "/api/",
    "/admin/",
    "/account/",
    "/auth/",
    "/checkout/",
    "/studio/",
  ];
  const allow = ["/", "/api/feed$"];

  return {
    rules: [
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "OAI-AdsBot", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"],
        allow,
        disallow,
      },
      { userAgent: "*", allow, disallow },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
