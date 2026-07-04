import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ mediaId: string }> }
) {
  const { mediaId } = await params;
  const { colorTag } = await req.json();

  await sql`
    UPDATE fabric_media
    SET color_tag = ${colorTag ?? null}
    WHERE id = ${Number(mediaId)}
  `;

  return NextResponse.json({ success: true });
}
