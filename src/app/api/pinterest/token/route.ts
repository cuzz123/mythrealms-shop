import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });

    const auth = Buffer.from("1581241:dc8e2639918023bd1b13bf28f1d6658d2e2ce4c2").toString("base64");
    const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${auth}` },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=https://mythrealms-shop.vercel.app/pinterest/callback`,
    });
    return NextResponse.json(await res.json());
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
