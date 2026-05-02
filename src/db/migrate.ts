import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const sql = readFileSync(join(__dirname, "migrations/0000_init.sql"), "utf8");
  await pool.query(sql);
  console.log("Migration complete");
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
