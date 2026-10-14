import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getPostById, getTopics } from "@/lib/posts";
import { save } from "../actions";
import DeleteButton from "../DeleteButton";

export const dynamic = "force-dynamic";

export default async function Editor({ searchParams }) {
  if (!(await isAdmin())) redirect("/admin");
  const sp = await searchParams;
  const id = Number(sp.id) || 0;
  let v = { title: "", topic: getTopics()[0].slug, date: new Date().toISOString().slice(0, 10), summary: "", body: "", draft: false };
  if (id) {
    const p = await getPostById(id);
    if (!p) redirect("/admin");
    v = { title: p.title, topic: p.topic.slug, date: p.date, summary: p.summary, body: p.body, draft: p.draft };
  }
  return (
    <>
      <p className="meta"><Link href="/admin">← Voltar</Link></p>
      <h1>{id ? "Editar publicação" : "Nova publicação"}</h1>
      {sp.erro && <p className="err">Preencha título, tópico, data (AAAA-MM-DD) e texto.</p>}
      <form action={save} className="form">
        <input type="hidden" name="id" value={id || ""} />
        <label>Título<input name="title" defaultValue={v.title} required /></label>
        <div className="row">
          <label>Tópico
            <select name="topic" defaultValue={v.topic}>
              {getTopics().map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
          </label>
          <label>Data<input type="date" name="date" defaultValue={v.date} required /></label>
        </div>
        <label>Resumo (opcional)<input name="summary" defaultValue={v.summary} /></label>
        <label>Texto em Markdown<textarea name="body" rows={20} defaultValue={v.body} required /></label>
        <label className="check"><input type="checkbox" name="draft" defaultChecked={v.draft} /> Rascunho (não aparece no site)</label>
        <button type="submit">Salvar e publicar</button>
      </form>
      {id > 0 && (
        <p style={{ marginTop: 28 }}><DeleteButton id={id} title={v.title}>Excluir esta publicação</DeleteButton></p>
      )}
    </>
  );
}
