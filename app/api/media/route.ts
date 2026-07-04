// app/api/media/route.ts
// GET  — list all media from Cloudinary (for gallery picker)
// POST — upload new media file to Cloudinary

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { uploadMedia, listAllMedia } from "@/lib/cloudinary";

const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  try {
    const media = await listAllMedia();
    return NextResponse.json(media);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch media library" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  try {
    const { base64Data, mimeType } = await req.json();

    if (!base64Data || !mimeType) {
      return NextResponse.json(
        { error: "File data and type are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Only JPG, PNG, MP4, MOV, and WebM files are allowed" },
        { status: 400 }
      );
    }

    // Validate size (rough estimate from base64 length)
    const estimatedSize = (base64Data.length * 3) / 4;
    if (estimatedSize > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum is 50MB." },
        { status: 400 }
      );
    }

    const type = isImage ? "image" : "video";
    const result = await uploadMedia(base64Data, type);

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
