import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`
    const count = await db.product.count()
    return NextResponse.json({ db: "connected", products: count })
  } catch (e: any) {
    return NextResponse.json({ db: "error", message: e.message }, { status: 500 })
  }
}
