// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// ── Upload ────────────────────────────────────────────────────────────────

export async function uploadMedia(
  base64Data: string,
  type: "image" | "video"
) {
  const options: any = {
    folder: "house-of-joy",
    resource_type: type,
  };

  if (type === "image") {
    options.transformation = [
      { width: 1200, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ];
  } else {
    // Video: compress and cap at 720p
    options.transformation = [
      { width: 720, crop: "limit" },
      { quality: "auto" },
    ];
    options.eager = [{ format: "mp4", quality: "auto" }];
  }

  const result = await cloudinary.uploader.upload(base64Data, options);

  return {
    url: result.secure_url,
    publicId: result.public_id,
    type,
  };
}

// ── Delete ────────────────────────────────────────────────────────────────

export async function deleteMedia(
  publicId: string,
  type: "image" | "video" = "image"
) {
  await cloudinary.uploader.destroy(publicId, { resource_type: type });
}

// ── List all media in the house-of-joy folder (for gallery picker) ────────

export async function listAllMedia() {
  const [images, videos] = await Promise.all([
    cloudinary.api.resources({
      type: "upload",
      prefix: "house-of-joy",
      resource_type: "image",
      max_results: 100,
    }),
    cloudinary.api.resources({
      type: "upload",
      prefix: "house-of-joy",
      resource_type: "video",
      max_results: 50,
    }),
  ]);

  const imageItems = images.resources.map((r: any) => ({
    url: r.secure_url,
    publicId: r.public_id,
    type: "image" as const,
    createdAt: r.created_at,
  }));

  const videoItems = videos.resources.map((r: any) => ({
    url: r.secure_url,
    publicId: r.public_id,
    type: "video" as const,
    createdAt: r.created_at,
  }));

  // Merge and sort newest first
  return [...imageItems, ...videoItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
