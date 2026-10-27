import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPostById, getTopics } from "@/lib/posts";
import { save } from "../actions";
import DeleteButton from "../DeleteButton";
import RichEditor from "../RichEditor";
import { renderBody } from "@/lib/render";

export const dynamic = "force-dynamic";

export default async function Editor({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/admin");
  const sp = await searchParams;
  const id = Number(sp.id) || 0;
  const topics = await getTopics();
  let v = { title: "", topic: topics[0]?.slug || "", date: new Date().toISOString().slice(0, 10), summary: "", body: "", draft: false };
  if (id) {
    const p = await getPostById(id);
    if (!p || (!session.admin && p.authorId !== session.id)) redirect("/admin");
    // Posts antigos (Markdown) abrem no editor visual já convertidos.
    v = { title: p.title, topic: p.topic.slug, date: p.date, summary: p.summary, body: renderBody(p.body, p.format), draft: p.draft };
  }
  return (
    <>
      <p className="meta"><Link href="/admin">← Voltar</Link></p>
      <h1>{id ? "Editar publicação" : "Nova publicação"}</h1>
      {sp.erro && <p className="err">Preencha título, tópico, data (AAAA-MM-DD) e o texto.</p>}
      <form action={save} className="form">
        <input type="hidden" name="id" value={id || ""} />
        <label>Título<input name="title" defaultValue={v.title} required /></label>
        <div className="row">
          <label>Tópico
            <select name="topic" defaultValue={v.topic}>
              {topics.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
          </label>
          <label>Data<input type="date" name="date" defaultValue={v.date} required /></label>
        </div>
        <label>Resumo (opcional)<input name="summary" defaultValue={v.summary} /></label>
        <div className="editor-field">
          <span className="field-label">Texto</span>
          <RichEditor name="body" initialHtml={v.body} />
        </div>
        <label className="check"><input type="checkbox" name="draft" defaultChecked={v.draft} /> Rascunho (não aparece no site)</label>
        <button type="submit">Salvar e publicar</button>
      </form>
      {id > 0 && (
        <p style={{ marginTop: 28 }}><DeleteButton id={id} title={v.title}>Excluir esta publicação</DeleteButton></p>
      )}
    </>
  );
}
