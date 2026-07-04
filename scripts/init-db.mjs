// scripts/init-db.mjs
// Run once: node scripts/init-db.mjs

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function init() {
  console.log("Connecting to database...");

  try {
    // Drop old fabrics table if it exists (fresh setup)
    await sql`DROP TABLE IF EXISTS fabric_media CASCADE`;
    await sql`DROP TABLE IF EXISTS fabrics CASCADE`;

    // Fabrics table — no image columns (media is separate now)
    await sql`
      CREATE TABLE fabrics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Media table — supports both images and videos, multiple per fabric
    await sql`
      CREATE TABLE fabric_media (
        id SERIAL PRIMARY KEY,
        fabric_id INTEGER NOT NULL REFERENCES fabrics(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        public_id TEXT NOT NULL,
        type VARCHAR(10) NOT NULL DEFAULT 'image',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Index for fast lookups by fabric
    await sql`CREATE INDEX idx_fabric_media_fabric_id ON fabric_media(fabric_id)`;

    console.log("✓ Tables created: fabrics, fabric_media");
    console.log("✓ Ready! Start the server and go to /admin");
  } catch (err) {
    console.error("✗ Failed:", err.message);
    process.exit(1);
  }
}

init();
