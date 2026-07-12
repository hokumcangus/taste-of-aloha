require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL_UNPOOLED });

async function main() {
  const locks = await pool.query(
    "SELECT pid, granted, classid, objid FROM pg_locks WHERE locktype = 'advisory'"
  );
  console.log("Advisory locks:", locks.rows);

  const killed = await pool.query(
    "SELECT pg_terminate_backend(pid) FROM pg_locks WHERE locktype = 'advisory' AND granted = true"
  );
  console.log("Terminated sessions:", killed.rows);

  await pool.end();
}

main().catch((e) => { console.error(e.message); pool.end(); });
