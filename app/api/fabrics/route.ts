// app/api/fabrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getFabrics, insertFabric } from "@/lib/db";

// GET — all fabrics with media (public, used by homepage)
export async function GET() {
  try {
    const fabrics = await getFabrics();
    return NextResponse.json(fabrics);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch fabrics" },
      { status: 500 }
    );
  }
}

// POST — create a new fabric (admin only, no media yet — add media separately)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  try {
    const { name, category, description } = await req.json();

    if (!name?.trim() || !category?.trim()) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    const fabric = await insertFabric(
      name.trim(),
      category.trim(),
      description?.trim() || ""
    );

    return NextResponse.json(fabric, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create fabric" },
      { status: 500 }
    );
  }
}
