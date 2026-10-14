import { marked } from "marked";
import { query } from "./db";

export async function getTopics() {
  const { rows } = await query("SELECT slug, name, description FROM topics ORDER BY position, name");
  return rows;
}

export async function createTopic({ name, description }) {
  const slug = slugify(name);
  if (!slug) throw new Error("Nome inválido.");
  const r = await query(
    "INSERT INTO topics (slug, name, description) VALUES ($1,$2,$3) ON CONFLICT (slug) DO NOTHING RETURNING slug",
    [slug, name, description]);
  if (!r.rows[0]) throw new Error(`Já existe um tópico com o endereço "${slug}".`);
  return slug;
}

export async function updateTopic({ slug, name, description }) {
  await query("UPDATE topics SET name=$2, description=$3 WHERE slug=$1", [slug, name, description]);
}

// Só exclui tópicos sem publicações (para não deixar posts órfãos).
export async function deleteTopic(slug) {
  const { rows } = await query("SELECT count(*)::int AS n FROM posts WHERE topic = $1", [slug]);
  if (rows[0].n > 0) throw new Error(`O tópico tem ${rows[0].n} publicação(ões). Mova ou exclua antes.`);
  await query("DELETE FROM topics WHERE slug = $1", [slug]);
}

export async function countPostsByTopic({ publishedOnly = false } = {}) {
  const { rows } = await query(
    `SELECT topic, count(*)::int AS n FROM posts ${publishedOnly ? "WHERE draft = false" : ""} GROUP BY topic`);
  return Object.fromEntries(rows.map((r) => [r.topic, r.n]));
}

const COLS = `id, slug, topic, title, summary, body, draft, likes, author_id,
  (SELECT name FROM users u WHERE u.id = posts.author_id) AS author,
  to_char(published_at, 'YYYY-MM-DD') AS date`;

function shape(r, topics) {
  const topic = topics.find((t) => t.slug === r.topic) || { slug: r.topic, name: r.topic, description: "" };
  const words = r.body.trim().split(/\s+/).length;
  return {
    id: r.id, slug: r.slug, title: r.title, summary: r.summary, body: r.body,
    draft: r.draft, date: r.date, topic, likes: r.likes, authorId: r.author_id, author: r.author, minutes: Math.max(1, Math.round(words / 200)),
  };
}

export async function getAllPosts({ topic, authorId, includeDrafts = false } = {}) {
  const where = [];
  const params = [];
  if (!includeDrafts) where.push("draft = false");
  if (topic) { params.push(topic); where.push(`topic = $${params.length}`); }
  if (authorId) { params.push(authorId); where.push(`author_id = $${params.length}`); }
  const { rows } = await query(
    `SELECT ${COLS} FROM posts ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY published_at DESC, id DESC`, params);
  const topics = await getTopics();
  return rows.map((r) => shape(r, topics));
}

export async function getPost(topic, slug, { includeDrafts = false } = {}) {
  const { rows } = await query(
    `SELECT ${COLS} FROM posts WHERE topic = $1 AND slug = $2 ${includeDrafts ? "" : "AND draft = false"}`,
    [topic, slug]);
  if (!rows[0]) return null;
  const p = shape(rows[0], await getTopics());
  return { ...p, html: marked.parse(p.body) };
}

export async function getPostById(id) {
  const { rows } = await query(`SELECT ${COLS} FROM posts WHERE id = $1`, [Number(id) || 0]);
  return rows[0] ? shape(rows[0], await getTopics()) : null;
}

const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export async function savePost({ id, title, topic, date, summary, body, draft, authorId = null }) {
  if (id) {
    await query(
      `UPDATE posts SET title=$2, topic=$3, published_at=$4, summary=$5, body=$6, draft=$7, updated_at=now() WHERE id=$1`,
      [id, title, topic, date, summary, body, draft]);
    return id;
  }
  const base = slugify(title) || "publicacao";
  for (let n = 1; n < 50; n++) {
    const slug = n === 1 ? base : `${base}-${n}`;
    const r = await query(
      `INSERT INTO posts (slug, topic, title, summary, body, draft, published_at, author_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (topic, slug) DO NOTHING RETURNING id`,
      [slug, topic, title, summary, body, draft, date, authorId]);
    if (r.rows[0]) return r.rows[0].id;
  }
  throw new Error("Não foi possível gerar um endereço único para o título.");
}

export async function getMostLiked(limit = 5) {
  const { rows } = await query(
    `SELECT ${COLS} FROM posts WHERE draft = false AND likes > 0 ORDER BY likes DESC, published_at DESC LIMIT $1`, [limit]);
  const topics = await getTopics();
  return rows.map((r) => shape(r, topics));
}

// Soma (+1) ou tira (-1) uma curtida de um post publicado; devolve o total.
export async function addLike(id, delta) {
  const { rows } = await query(
    "UPDATE posts SET likes = GREATEST(likes + $2, 0) WHERE id = $1 AND draft = false RETURNING likes",
    [id, delta]);
  return rows[0]?.likes ?? null;
}

export async function deletePost(id) {
  await query("DELETE FROM posts WHERE id = $1", [id]);
}

export function postPath(p) {
  return `/${p.topic.slug}/${p.slug}`;
}

export function formatDate(iso) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("pt-BR", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}
