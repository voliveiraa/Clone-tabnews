"use server";
import { redirect } from "next/navigation";
import { adminConfigured, endSession, isAdmin, passwordOk, startSession } from "@/lib/auth";
import { deletePost, getTopics, savePost } from "@/lib/posts";

export async function login(formData) {
  if (!adminConfigured()) redirect("/admin");
  if (!passwordOk(formData.get("senha"))) {
    await new Promise((r) => setTimeout(r, 1200)); // freia tentativas em sequência
    redirect("/admin?erro=1");
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin");
}

export async function save(formData) {
  if (!(await isAdmin())) redirect("/admin");
  const id = Number(formData.get("id")) || 0;
  const title = String(formData.get("title") || "").trim();
  const topic = String(formData.get("topic") || "");
  const date = String(formData.get("date") || "");
  const summary = String(formData.get("summary") || "").trim();
  const body = String(formData.get("body") || "").replace(/\r\n/g, "\n").trim();
  const draft = formData.get("draft") === "on";
  const back = id ? `/admin/editor?id=${id}&erro=dados` : "/admin/editor?erro=dados";

  if (!title || !body || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !getTopics().some((t) => t.slug === topic)) redirect(back);

  try {
    await savePost({ id, title, topic, date, summary, body, draft });
  } catch (e) {
    redirect(`/admin?erro=${encodeURIComponent("Falha ao salvar: " + e.message)}`);
  }
  redirect("/admin?ok=salvo");
}

export async function remove(formData) {
  if (!(await isAdmin())) redirect("/admin");
  try {
    await deletePost(Number(formData.get("id")) || 0);
  } catch (e) {
    redirect(`/admin?erro=${encodeURIComponent("Falha ao excluir: " + e.message)}`);
  }
  redirect("/admin?ok=excluido");
}
