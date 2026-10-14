"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { addLike } from "@/lib/posts";

// Lembra no navegador quais posts já foram curtidos (sem contas de usuário).
const COOKIE = "ml_likes";
const MAX_AGE = 60 * 60 * 24 * 365;

export async function likedIds() {
  const v = (await cookies()).get(COOKIE)?.value || "";
  return v.split(".").map(Number).filter(Boolean);
}

export async function toggleLike(id) {
  id = Number(id) || 0;
  const liked = await likedIds();
  const was = liked.includes(id);
  const total = await addLike(id, was ? -1 : 1);
  if (total === null) return null;
  const next = was ? liked.filter((x) => x !== id) : [...liked, id].slice(-500);
  (await cookies()).set(COOKIE, next.join("."), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: MAX_AGE,
  });
  revalidatePath("/", "layout"); // atualiza "Mais curtidos" na lateral
  return { liked: !was, total };
}
