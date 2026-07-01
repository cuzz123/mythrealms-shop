// GET /api/automation/daily-pinterest — Scheduled Pinterest publishing for Vercel Cron
// Publishes up to 5 pins per day, auto-resumes from its last offset.
// Handles full cycle: when all products are published, resets to 0.

import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/1688-products";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

async function getProgress(): Promise<number> {
  try {
    const fs = await import("fs/promises");
    const data = await fs.readFile("/tmp/pinterest-offset.txt", "utf-8").catch(() => "0");
    return parseInt(data.trim()) || 0;
  } catch {
    return 0;
  }
}

async function saveProgress(offset: number): Promise<void> {
  try {
    const fs = await import("fs/promises");
    await fs.writeFile("/tmp/pinterest-offset.txt", String(offset), "utf-8");
  } catch {
    // non-fatal
  }
}

export async function GET() {
  const TOKEN = process.env.PINTEREST_API_TOKEN || "";
  const BOARD_ID = process.env.PINTEREST_BOARD_ID || "";

  if (!TOKEN || !BOARD_ID) {
    return NextResponse.json({ error: "Pinterest API not configured" }, { status: 500 });
  }

  const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://mythrealms-shop.vercel.app";
  const limit = 5;
  const totalProducts = PRODUCTS.filter(p => p.isActive).length;

  let offset = await getProgress();

  // If we've published all products, reset
  if (offset >= totalProducts) {
    offset = 0;
    await saveProgress(0);
  }

  // Call the publish endpoint
  const publishUrl = `${BASE}/api/pinterest/publish?limit=${limit}&offset=${offset}`;
  const resp = await fetch(publishUrl);
  const data = await resp.json();

  const nextOffset = offset + limit;

  // If this batch published successfully, advance offset
  if (data.summary?.published > 0 || data.summary?.failed === 0) {
    await saveProgress(nextOffset);
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    daily_publish_limit: limit,
    progress: { from: offset, to: nextOffset },
    cycle_complete: nextOffset >= totalProducts,
    ...data,
  });
}
