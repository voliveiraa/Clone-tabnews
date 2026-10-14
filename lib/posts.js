import { marked } from "marked";
import topicsData from "../content/topics.json";
import { query } from "./db";

export function getTopics() {
  return topicsData;
}

const COLS = `id, slug, topic, title, summary, body, draft,
  to_char(published_at, 'YYYY-MM-DD') AS date`;

function shape(r) {
  const topic = topicsData.find((t) => t.slug === r.topic) || { slug: r.topic, name: r.topic, description: "" };
  const words = r.body.trim().split(/\s+/).length;
  return {
    id: r.id, slug: r.slug, title: r.title, summary: r.summary, body: r.body,
    draft: r.draft, date: r.date, topic, minutes: Math.max(1, Math.round(words / 200)),
  };
}

export async function getAllPosts({ topic, includeDrafts = false } = {}) {
  const where = [];
  const params = [];
  if (!includeDrafts) where.push("draft = false");
  if (topic) { params.push(topic); where.push(`topic = $${params.length}`); }
  const { rows } = await query(
    `SELECT ${COLS} FROM posts ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY published_at DESC, id DESC`, params);
  return rows.map(shape);
}

export async function getPost(topic, slug, { includeDrafts = false } = {}) {
  const { rows } = await query(
    `SELECT ${COLS} FROM posts WHERE topic = $1 AND slug = $2 ${includeDrafts ? "" : "AND draft = false"}`,
    [topic, slug]);
  if (!rows[0]) return null;
  const p = shape(rows[0]);
  return { ...p, html: marked.parse(p.body) };
}

export async function getPostById(id) {
  const { rows } = await query(`SELECT ${COLS} FROM posts WHERE id = $1`, [Number(id) || 0]);
  return rows[0] ? shape(rows[0]) : null;
}

const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export async function savePost({ id, title, topic, date, summary, body, draft }) {
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
      `INSERT INTO posts (slug, topic, title, summary, body, draft, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (topic, slug) DO NOTHING RETURNING id`,
      [slug, topic, title, summary, body, draft, date]);
    if (r.rows[0]) return r.rows[0].id;
  }
  throw new Error("Não foi possível gerar um endereço único para o título.");
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
