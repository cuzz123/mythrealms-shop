import { NextRequest, NextResponse } from "next/server";
import { generateSeoArticle } from "@/lib/seo-content-engine";

const CRON_SECRET = process.env.CRON_SECRET || "";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const unauthorized = verifyCronRequest(req);
  if (unauthorized) return unauthorized;

  try {
    const result = await generateSeoArticle();
    return NextResponse.json(result);
  } catch (error) {
    console.error("SEO daily cron error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

function verifyCronRequest(req: NextRequest) {
  if (!CRON_SECRET) {
    return process.env.NODE_ENV === "production"
      ? NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 })
      : null;
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
