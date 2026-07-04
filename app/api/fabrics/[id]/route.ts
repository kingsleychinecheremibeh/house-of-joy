// app/api/fabrics/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { deleteFabric, updateFabric } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { name, category, description } = await req.json();

    if (!name?.trim() || !category?.trim()) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    const updated = await updateFabric(
      Number(id),
      name.trim(),
      category.trim(),
      description?.trim() || ""
    );
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update fabric" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Media is deleted automatically via ON DELETE CASCADE
    await deleteFabric(Number(id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete fabric" },
      { status: 500 }
    );
  }
}
