// POST /api/returns — Submit a return request (sends email to support)
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { orderId, email, reason, description } = await request.json();

    if (!orderId || !email || !reason) {
      return NextResponse.json({ error: "Order ID, email, and reason are required" }, { status: 400 });
    }

    // Send email notification to support
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "MythRealms Returns <returns@mythrealms-shop.vercel.app>",
            to: "mythrealms@outlook.com",
            subject: `Return Request — Order ${orderId}`,
            html: `
              <h2>Return Request</h2>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Customer Email:</strong> ${email}</p>
              <p><strong>Reason:</strong> ${reason}</p>
              <p><strong>Details:</strong> ${description || "N/A"}</p>
            `,
          }),
        });
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to submit return request" }, { status: 500 });
  }
}
