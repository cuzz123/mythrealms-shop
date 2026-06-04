import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const { sendAbandonedCart } = await import("@/lib/email");
    const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
    await sendAbandonedCart(email, `${baseUrl}/cart`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
