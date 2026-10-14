import { normalizeAvatar, TITLES } from "./avatar";
import { query } from "./db";
import { SITE } from "./site";

// Perfil público de quem escreve: { name, avatar, title }.
// Posts sem autor (author_id NULL) são do admin, cujo perfil fica em settings.

const ADMIN_KEY = "admin_profile";
export const validTitle = (t) => (t in TITLES ? t : "");

export async function getAdminProfile() {
  const { rows } = await query("SELECT value FROM settings WHERE key = $1", [ADMIN_KEY]);
  const v = rows[0]?.value || {};
  return { name: v.name || SITE.name, avatar: normalizeAvatar(v.avatar), title: validTitle(v.title) };
}

export async function saveAdminProfile({ name, avatar, title }) {
  const value = { name: String(name || "").trim().slice(0, 80) || SITE.name, avatar: normalizeAvatar(avatar), title: validTitle(title) };
  await query(
    "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
    [ADMIN_KEY, JSON.stringify(value)]);
}

// authorId null = admin. Inclui o total de publicações no ar.
export async function getAuthorProfile(authorId) {
  const { rows } = await query(
    `SELECT count(*)::int AS n FROM posts WHERE draft = false AND author_id IS NOT DISTINCT FROM $1`, [authorId ?? null]);
  if (!authorId) return { ...(await getAdminProfile()), posts: rows[0].n };
  const u = await query("SELECT name, avatar, title FROM users WHERE id = $1", [authorId]);
  if (!u.rows[0]) return null;
  const { name, avatar, title } = u.rows[0];
  return { name, avatar: normalizeAvatar(avatar), title: validTitle(title), posts: rows[0].n };
}

// Pódio da semana (zera toda segunda-feira, horário de Brasília):
// pontos = curtidas recebidas nos posts criados na semana (só entra quem tem curtida).
export async function getWeeklyRanking(limit = 3) {
  const { rows } = await query(
    `SELECT p.author_id, count(*)::int AS posts, COALESCE(sum(p.likes), 0)::int AS likes,
            COALESCE(sum(p.likes), 0)::int AS points,
            u.name, u.avatar, u.title, u.status
     FROM posts p LEFT JOIN users u ON u.id = p.author_id
     WHERE p.draft = false AND (u.status IS NULL OR u.status <> 'deleted')
       AND p.created_at >= (date_trunc('week', now() AT TIME ZONE 'America/Sao_Paulo') AT TIME ZONE 'America/Sao_Paulo')
     GROUP BY p.author_id, u.name, u.avatar, u.title, u.status
     HAVING COALESCE(sum(p.likes), 0) > 0
     ORDER BY points DESC, posts DESC, max(p.created_at) ASC
     LIMIT $1`, [limit]);
  const admin = rows.some((r) => !r.author_id) ? await getAdminProfile() : null;
  return rows.map((r) => r.author_id
    ? { name: r.name, avatar: normalizeAvatar(r.avatar), title: validTitle(r.title), posts: r.posts, likes: r.likes, points: r.points }
    : { ...admin, posts: r.posts, likes: r.likes, points: r.points });
}
