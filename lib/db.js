import { Pool } from "pg";
import defaultTopics from "../content/topics.json";

// Uma conexão reaproveitada por processo (serverless: poucas conexões).
const g = globalThis;
// A integração Neon da Vercel pode criar as variáveis com prefixo (ex.: storage_DATABASE_URL).
export const databaseUrl = () =>
  process.env.DATABASE_URL || process.env.storage_DATABASE_URL || process.env.POSTGRES_URL || process.env.storage_POSTGRES_URL;

function pool() {
  if (!g.__mlPool) {
    const url = databaseUrl();
    if (!url) throw new Error("DATABASE_URL não definida.");
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    g.__mlPool = new Pool({
      connectionString: url,
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
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0;
      CREATE TABLE IF NOT EXISTS topics (
        slug        TEXT PRIMARY KEY,
        name        TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        position    SERIAL
      );
    `)
      // Na primeira vez, preenche os tópicos com os de content/topics.json.
      .then(() => pool().query(
        `INSERT INTO topics (slug, name, description)
         SELECT t.slug, t.name, t.description FROM json_to_recordset($1::json) AS t(slug text, name text, description text)
         WHERE NOT EXISTS (SELECT 1 FROM topics) ON CONFLICT (slug) DO NOTHING`,
        [JSON.stringify(defaultTopics)]))
      .catch((e) => { g.__mlSchema = null; throw e; });
  }
  return g.__mlSchema;
}

export async function query(text, params) {
  await ensureSchema();
  return pool().query(text, params);
}
