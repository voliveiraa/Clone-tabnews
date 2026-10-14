import crypto from "node:crypto";
import { promisify } from "node:util";
import { query } from "./db";

const scrypt = promisify(crypto.scrypt);

export const USERNAME_RE = /^[a-z0-9_.-]{3,30}$/;
const RESERVED = new Set(["admin", "administrador", "root", "medialake"]);

async function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await scrypt(String(pw), salt, 64);
  return `${salt}:${key.toString("hex")}`;
}

export async function verifyPassword(pw, stored) {
  const [salt, hex] = String(stored).split(":");
  if (!salt || !hex) return false;
  const key = await scrypt(String(pw), salt, 64);
  const expected = Buffer.from(hex, "hex");
  return expected.length === key.length && crypto.timingSafeEqual(expected, key);
}

export async function createUser({ username, name, password }) {
  username = String(username).trim().toLowerCase();
  if (!USERNAME_RE.test(username) || RESERVED.has(username))
    throw new Error("Usuário inválido: use de 3 a 30 letras sem acento, números, ponto, hífen ou _ (sem espaços).");
  if (!name) throw new Error("Informe seu nome.");
  if (String(password).length < 8) throw new Error("A senha precisa ter pelo menos 8 caracteres.");
  const r = await query(
    "INSERT INTO users (username, name, password_hash) VALUES ($1,$2,$3) ON CONFLICT (username) DO NOTHING RETURNING id",
    [username, name, await hashPassword(password)]);
  if (!r.rows[0]) throw new Error("Esse usuário já existe. Escolha outro.");
  return r.rows[0].id;
}

export async function getUserByUsername(username) {
  const { rows } = await query("SELECT * FROM users WHERE username = $1", [String(username).trim().toLowerCase()]);
  return rows[0] || null;
}

export async function getUserById(id) {
  const { rows } = await query("SELECT id, username, name, status FROM users WHERE id = $1", [Number(id) || 0]);
  return rows[0] || null;
}

export async function listUsers() {
  const { rows } = await query(
    `SELECT u.id, u.username, u.name, u.status, to_char(u.created_at, 'YYYY-MM-DD') AS created,
            (SELECT count(*)::int FROM posts p WHERE p.author_id = u.id) AS posts
     FROM users u ORDER BY (u.status = 'pending') DESC, u.created_at DESC`);
  return rows;
}

export async function countPendingUsers() {
  const { rows } = await query("SELECT count(*)::int AS n FROM users WHERE status = 'pending'");
  return rows[0].n;
}

export async function setUserStatus(id, status) {
  if (!["pending", "approved", "blocked"].includes(status)) throw new Error("Status inválido.");
  await query("UPDATE users SET status = $2 WHERE id = $1", [Number(id) || 0, status]);
}

// Os posts do autor continuam no site, sem autor (passam a ser do admin).
export async function deleteUser(id) {
  await query("DELETE FROM users WHERE id = $1", [Number(id) || 0]);
}
