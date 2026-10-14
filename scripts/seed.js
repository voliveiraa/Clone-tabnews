// Importa os posts de exemplo da pasta seed/ para o banco (opcional): npm run seed
const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");

function parse(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
  }
  return { meta, body: m[2].trim() };
}

(async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não definida.");
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(process.env.DATABASE_URL);
  const c = new Client({ connectionString: process.env.DATABASE_URL, ssl: local ? false : { rejectUnauthorized: false } });
  await c.connect();
  await c.query(`CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY, slug TEXT NOT NULL, topic TEXT NOT NULL, title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '', body TEXT NOT NULL, draft BOOLEAN NOT NULL DEFAULT false,
    published_at DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), UNIQUE (topic, slug))`);
  const dir = path.join(__dirname, "..", "seed");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
    const { meta, body } = parse(fs.readFileSync(path.join(dir, f), "utf8"));
    const r = await c.query(
      `INSERT INTO posts (slug, topic, title, summary, body, published_at) VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (topic, slug) DO NOTHING`,
      [f.replace(/\.md$/, ""), meta.topic, meta.title, meta.summary || "", body, meta.date]);
    console.log(`${r.rowCount ? "importado" : "já existe"}: ${f}`);
  }
  await c.end();
})().catch((e) => { console.error(e.message); process.exit(1); });
