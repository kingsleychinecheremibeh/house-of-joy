// app/api/fabrics/[id]/stock/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateStockStatus } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { inStock } = await req.json();
    await updateStockStatus(Number(id), Boolean(inStock));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update stock status" },
      { status: 500 }
    );
  }
}
