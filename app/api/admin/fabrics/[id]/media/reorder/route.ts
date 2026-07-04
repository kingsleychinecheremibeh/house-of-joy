import { NextResponse } from "next/server";
import { bulkReorderFabricMedia } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = cookies();
  if (cookieStore.get("admin_session")?.value !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { updates } = body;
    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: "Updates must be an array" }, { status: 400 });
    }

    await bulkReorderFabricMedia(updates);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/fabrics/${params.id}`);
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
