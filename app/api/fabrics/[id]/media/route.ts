// app/api/fabrics/[id]/media/route.ts
// GET  — list all media for a fabric
// POST — attach a media item (from gallery or fresh upload) to a fabric
// DELETE via query param ?mediaId=X

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  getFabricMedia,
  insertFabricMedia,
  deleteFabricMedia,
} from "@/lib/db";
import { deleteMedia } from "@/lib/cloudinary";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const media = await getFabricMedia(Number(id));
    return NextResponse.json(media);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  const { id } = await params;
  const fabricId = Number(id);

  try {
    const { url, publicId, type, sortOrder } = await req.json();

    if (!url || !publicId || !type) {
      return NextResponse.json(
        { error: "url, publicId, and type are required" },
        { status: 400 }
      );
    }

    if (!["image", "video"].includes(type)) {
      return NextResponse.json(
        { error: "type must be image or video" },
        { status: 400 }
      );
    }

    // Find the next sort order if not provided
    const existing = await getFabricMedia(fabricId);
    const order = sortOrder ?? existing.length;

    const media = await insertFabricMedia(
      fabricId,
      url,
      publicId,
      type,
      order
    );

    return NextResponse.json(media, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to attach media" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const mediaId = searchParams.get("mediaId");
    const mediaType = (searchParams.get("type") ?? "image") as "image" | "video";

    if (!mediaId) {
      return NextResponse.json({ error: "mediaId required" }, { status: 400 });
    }

    const deleted = await deleteFabricMedia(Number(mediaId));

    // Clean up from Cloudinary
    if (deleted?.public_id) {
      await deleteMedia(deleted.public_id, mediaType);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
