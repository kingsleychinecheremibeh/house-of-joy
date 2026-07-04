// lib/db.ts
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);
export { sql };

export interface FabricMedia {
  id: number;
  fabric_id: number;
  url: string;
  public_id: string;
  type: "image" | "video";
  sort_order: number;
}

export interface Fabric {
  id: number;
  name: string;
  category: string;
  description: string;
  in_stock: boolean;
  created_at: string;
  media: FabricMedia[];
}

// ── Fabrics ───────────────────────────────────────────────────────────────

// Fetch all fabrics with their media (for homepage)
export async function getFabrics(): Promise<Fabric[]> {
  const rows = await sql`
    SELECT
      f.id, f.name, f.category, f.description, f.in_stock, f.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', fm.id,
            'fabric_id', fm.fabric_id,
            'url', fm.url,
            'public_id', fm.public_id,
            'type', fm.type,
            'sort_order', fm.sort_order
          ) ORDER BY fm.sort_order
        ) FILTER (WHERE fm.id IS NOT NULL),
        '[]'
      ) AS media
    FROM fabrics f
    LEFT JOIN fabric_media fm ON fm.fabric_id = f.id
    GROUP BY f.id
    ORDER BY f.created_at DESC
  `;
  return rows as Fabric[];
}

// Fetch a single fabric by ID (for product page)
export async function getFabricById(id: number): Promise<Fabric | null> {
  const rows = await sql`
    SELECT
      f.id, f.name, f.category, f.description, f.in_stock, f.created_at,
      COALESCE(
        json_agg(
          json_build_object(
            'id', fm.id,
            'fabric_id', fm.fabric_id,
            'url', fm.url,
            'public_id', fm.public_id,
            'type', fm.type,
            'sort_order', fm.sort_order
          ) ORDER BY fm.sort_order
        ) FILTER (WHERE fm.id IS NOT NULL),
        '[]'
      ) AS media
    FROM fabrics f
    LEFT JOIN fabric_media fm ON fm.fabric_id = f.id
    WHERE f.id = ${id}
    GROUP BY f.id
  `;
  return rows.length > 0 ? (rows[0] as Fabric) : null;
}

// Insert new fabric
export async function insertFabric(
  name: string,
  category: string,
  description: string
): Promise<Fabric> {
  const result = await sql`
    INSERT INTO fabrics (name, category, description, in_stock)
    VALUES (${name}, ${category}, ${description}, true)
    RETURNING *
  `;
  return { ...result[0], media: [] } as Fabric;
}

// Toggle in_stock status
export async function updateStockStatus(
  id: number,
  inStock: boolean
): Promise<void> {
  await sql`UPDATE fabrics SET in_stock = ${inStock} WHERE id = ${id}`;
}

// Update fabric text fields
export async function updateFabric(
  id: number,
  name: string,
  category: string,
  description: string
): Promise<Fabric> {
  const result = await sql`
    UPDATE fabrics
    SET name = ${name}, category = ${category}, description = ${description}
    WHERE id = ${id}
    RETURNING *
  `;
  return { ...result[0], media: [] } as Fabric;
}

// Delete fabric (media auto-deleted via CASCADE)
export async function deleteFabric(id: number): Promise<void> {
  await sql`DELETE FROM fabrics WHERE id = ${id}`;
}

// ── Fabric Media ──────────────────────────────────────────────────────────

// Get all media for a fabric
export async function getFabricMedia(fabricId: number): Promise<FabricMedia[]> {
  const rows = await sql`
    SELECT * FROM fabric_media
    WHERE fabric_id = ${fabricId}
    ORDER BY sort_order
  `;
  return rows as FabricMedia[];
}

// Attach media item to a fabric
export async function insertFabricMedia(
  fabricId: number,
  url: string,
  publicId: string,
  type: "image" | "video",
  sortOrder: number
): Promise<FabricMedia> {
  const result = await sql`
    INSERT INTO fabric_media (fabric_id, url, public_id, type, sort_order)
    VALUES (${fabricId}, ${url}, ${publicId}, ${type}, ${sortOrder})
    RETURNING *
  `;
  return result[0] as FabricMedia;
}

// Remove a media item from a fabric
export async function deleteFabricMedia(
  mediaId: number
): Promise<{ public_id: string }> {
  const result = await sql`
    DELETE FROM fabric_media WHERE id = ${mediaId}
    RETURNING public_id
  `;
  return result[0] as { public_id: string };
}

// Reorder media items
export async function reorderFabricMedia(
  mediaId: number,
  newOrder: number
): Promise<void> {
  await sql`
    UPDATE fabric_media SET sort_order = ${newOrder} WHERE id = ${mediaId}
  `;
}

// Bulk reorder media items
export async function bulkReorderFabricMedia(
  updates: { id: number; sortOrder: number }[]
): Promise<void> {
  await Promise.all(
    updates.map((u) => 
      sql`UPDATE fabric_media SET sort_order = ${u.sortOrder} WHERE id = ${u.id}`
    )
  );
}

// Duplicate a fabric (text only)
export async function duplicateFabric(fabricId: number): Promise<number> {
  const result = await sql`
    INSERT INTO fabrics (name, category, description, in_stock)
    SELECT name || ' (Copy)', category, description, in_stock
    FROM fabrics
    WHERE id = ${fabricId}
    RETURNING id
  `;
  return result[0].id;
}
