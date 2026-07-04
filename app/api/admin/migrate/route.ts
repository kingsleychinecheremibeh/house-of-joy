import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// One-time migration: add price column to fabrics table
// Visit /api/admin/migrate once after deployment
export async function GET() {
  try {
    await sql`ALTER TABLE fabrics ADD COLUMN IF NOT EXISTS price VARCHAR(100)`;
    return NextResponse.json({ success: true, message: "Price column added successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
