// scripts/add-stock-column.mjs
// Run once: node scripts/add-stock-column.mjs

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log("Adding in_stock column to fabrics...");
  try {
    await sql`
      ALTER TABLE fabrics
      ADD COLUMN IF NOT EXISTS in_stock BOOLEAN NOT NULL DEFAULT true
    `;
    console.log("✓ Done! in_stock column added.");
  } catch (err) {
    console.error("✗ Failed:", err.message);
    process.exit(1);
  }
}

migrate();
