"use server";
import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { hasLiked, toggleLike as toggle } from "@/lib/posts";

// Quem está curtindo: a conta logada (cada conta tem a sua curtida) ou,
// sem login, um identificador aleatório guardado no navegador.
const VOTER = "ml_voter";
const MAX_AGE = 60 * 60 * 24 * 365;

async function voter({ create = false } = {}) {
  const s = await getSession().catch(() => null);
  if (s) return s.admin ? "admin" : `u${s.id}`;
  const c = await cookies();
  let v = c.get(VOTER)?.value;
  if (!/^a[0-9a-f]{32}$/.test(v || "")) {
    if (!create) return null;
    v = "a" + crypto.randomBytes(16).toString("hex");
    c.set(VOTER, v, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE });
  }
  return v;
}

export async function isLiked(postId) {
  return hasLiked(Number(postId) || 0, await voter());
}

export async function toggleLike(postId) {
  const r = await toggle(Number(postId) || 0, await voter({ create: true }));
  if (r) revalidatePath("/", "layout"); // atualiza pódio e "Mais curtidos"
  return r;
}
