import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getErrorMessage } from "@/lib/error-message"

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`
    const count = await db.product.count()
    return NextResponse.json({ db: "connected", products: count })
  } catch (error: unknown) {
    return NextResponse.json({ db: "error", message: getErrorMessage(error, "Database unavailable") }, { status: 500 })
  }
}
