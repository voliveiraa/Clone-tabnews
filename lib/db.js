import { Pool } from "pg";

// Uma conexão reaproveitada por processo (serverless: poucas conexões).
const g = globalThis;
function pool() {
  if (!g.__mlPool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida.");
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL);
    g.__mlPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: local ? false : { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    });
  }
  return g.__mlPool;
}

// Cria a tabela automaticamente na primeira consulta (não precisa rodar migrations).
async function ensureSchema() {
  if (!g.__mlSchema) {
    g.__mlSchema = pool().query(`
      CREATE TABLE IF NOT EXISTS posts (
        id           SERIAL PRIMARY KEY,
        slug         TEXT NOT NULL,
        topic        TEXT NOT NULL,
        title        TEXT NOT NULL,
        summary      TEXT NOT NULL DEFAULT '',
        body         TEXT NOT NULL,
        draft        BOOLEAN NOT NULL DEFAULT false,
        published_at DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (topic, slug)
      );
      CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published_at DESC, id DESC);
    `).catch((e) => { g.__mlSchema = null; throw e; });
  }
  return g.__mlSchema;
}

export async function query(text, params) {
  await ensureSchema();
  return pool().query(text, params);
}
