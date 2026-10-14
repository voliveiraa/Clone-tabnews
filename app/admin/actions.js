"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminConfigured, endSession, getSession, isAdmin, passwordOk, startSession } from "@/lib/auth";
import { createTopic, deletePost, deleteTopic, getPostById, getTopics, savePost, updateTopic } from "@/lib/posts";
import { createUser, deleteUser, getUserByUsername, setUserStatus, verifyPassword } from "@/lib/users";

// As laterais e o topo ficam no layout, que o navegador guarda entre páginas:
// depois de qualquer alteração, manda recarregar (contagens, mais curtidos, Entrar/Sair).
const refreshLayout = () => revalidatePath("/", "layout");

const slow = () => new Promise((r) => setTimeout(r, 1200)); // freia tentativas em sequência

// Admin entra com o usuário "admin" e a ADMIN_PASSWORD; autores com a conta criada em /cadastro.
export async function login(formData) {
  if (!adminConfigured()) redirect("/admin");
  const username = String(formData.get("usuario") || "").trim().toLowerCase();
  const senha = String(formData.get("senha") || "");
  if (username === "admin") {
    if (!passwordOk(senha)) { await slow(); redirect("/admin?erro=1"); }
    await startSession("admin");
    refreshLayout();
    redirect("/admin");
  }
  const u = username ? await getUserByUsername(username) : null;
  if (!u || !(await verifyPassword(senha, u.password_hash))) { await slow(); redirect("/admin?erro=1"); }
  if (u.status === "pending") redirect("/admin?erro=pendente");
  if (u.status !== "approved") redirect("/admin?erro=bloqueado");
  await startSession(`u${u.id}`);
  refreshLayout();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  refreshLayout();
  redirect("/admin");
}

export async function register(formData) {
  if (!adminConfigured()) redirect("/cadastro");
  const name = String(formData.get("name") || "").trim().slice(0, 80);
  const username = String(formData.get("usuario") || "");
  const senha = String(formData.get("senha") || "");
  if (senha !== String(formData.get("senha2") || "")) redirect("/cadastro?erro=" + encodeURIComponent("As senhas não conferem."));
  await slow();
  try {
    await createUser({ username, name, password: senha });
  } catch (e) {
    redirect("/cadastro?erro=" + encodeURIComponent(e.message));
  }
  redirect("/cadastro?ok=1");
}

// Autor só mexe nos próprios posts; o admin mexe em todos.
async function canEdit(session, id) {
  if (session.admin) return true;
  const p = await getPostById(id);
  return Boolean(p) && p.authorId === session.id;
}

export async function save(formData) {
  const session = await getSession();
  if (!session) redirect("/admin");
  const id = Number(formData.get("id")) || 0;
  const title = String(formData.get("title") || "").trim();
  const topic = String(formData.get("topic") || "");
  const date = String(formData.get("date") || "");
  const summary = String(formData.get("summary") || "").trim();
  const body = String(formData.get("body") || "").replace(/\r\n/g, "\n").trim();
  const draft = formData.get("draft") === "on";
  const back = id ? `/admin/editor?id=${id}&erro=dados` : "/admin/editor?erro=dados";

  if (!title || !body || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !(await getTopics()).some((t) => t.slug === topic)) redirect(back);

  if (id && !(await canEdit(session, id))) redirect("/admin");

  try {
    await savePost({ id, title, topic, date, summary, body, draft, authorId: session.id });
  } catch (e) {
    redirect(`/admin?erro=${encodeURIComponent("Falha ao salvar: " + e.message)}`);
  }
  refreshLayout();
  redirect("/admin?ok=salvo");
}

export async function remove(formData) {
  const session = await getSession();
  if (!session) redirect("/admin");
  const id = Number(formData.get("id")) || 0;
  if (!(await canEdit(session, id))) redirect("/admin");
  try {
    await deletePost(id);
  } catch (e) {
    redirect(`/admin?erro=${encodeURIComponent("Falha ao excluir: " + e.message)}`);
  }
  refreshLayout();
  redirect("/admin?ok=excluido");
}

export async function addTopic(formData) {
  if (!(await isAdmin())) redirect("/admin");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!name) redirect("/admin/topicos?erro=" + encodeURIComponent("Informe o nome do tópico."));
  try {
    await createTopic({ name, description });
  } catch (e) {
    redirect("/admin/topicos?erro=" + encodeURIComponent(e.message));
  }
  refreshLayout();
  redirect("/admin/topicos?ok=criado");
}

export async function editTopic(formData) {
  if (!(await isAdmin())) redirect("/admin");
  const slug = String(formData.get("slug") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  if (!slug || !name) redirect("/admin/topicos?erro=" + encodeURIComponent("Informe o nome do tópico."));
  try {
    await updateTopic({ slug, name, description });
  } catch (e) {
    redirect("/admin/topicos?erro=" + encodeURIComponent(e.message));
  }
  refreshLayout();
  redirect("/admin/topicos?ok=salvo");
}

export async function removeTopic(formData) {
  if (!(await isAdmin())) redirect("/admin");
  try {
    await deleteTopic(String(formData.get("slug") || ""));
  } catch (e) {
    redirect("/admin/topicos?erro=" + encodeURIComponent(e.message));
  }
  refreshLayout();
  redirect("/admin/topicos?ok=excluido");
}

export async function changeUserStatus(formData) {
  if (!(await isAdmin())) redirect("/admin");
  try {
    await setUserStatus(formData.get("id"), String(formData.get("status") || ""));
  } catch (e) {
    redirect("/admin/autores?erro=" + encodeURIComponent(e.message));
  }
  refreshLayout();
  redirect("/admin/autores?ok=salvo");
}

export async function removeUser(formData) {
  if (!(await isAdmin())) redirect("/admin");
  try {
    await deleteUser(formData.get("id"));
  } catch (e) {
    redirect("/admin/autores?erro=" + encodeURIComponent(e.message));
  }
  refreshLayout();
  redirect("/admin/autores?ok=excluido");
}
