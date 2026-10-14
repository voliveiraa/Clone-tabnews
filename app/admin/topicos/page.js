import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { countPostsByTopic, getTopics } from "@/lib/posts";
import { addTopic, editTopic, removeTopic } from "../actions";
import DeleteButton from "../DeleteButton";

export const dynamic = "force-dynamic";

const OK = { criado: "Tópico criado.", salvo: "Tópico salvo.", excluido: "Tópico excluído." };

export default async function AdminTopicos({ searchParams }) {
  if (!(await isAdmin())) redirect("/admin");
  const sp = await searchParams;
  const [topics, counts] = await Promise.all([getTopics(), countPostsByTopic()]);
  return (
    <>
      <p className="meta"><Link href="/admin">← Voltar</Link></p>
      <h1>Tópicos</h1>
      {sp.ok && <p className="ok">{OK[sp.ok]}</p>}
      {sp.erro && <p className="err">{sp.erro}</p>}

      <h2>Novo tópico</h2>
      <form action={addTopic} className="form" style={{ maxWidth: 560 }}>
        <label>Nome<input name="name" required placeholder="Ex.: Transmissão e RF" /></label>
        <label>Descrição (opcional)<input name="description" placeholder="Uma linha sobre o assunto" /></label>
        <p><button type="submit">Criar tópico</button></p>
      </form>

      <h2>Existentes</h2>
      <ol className="list">
        {topics.map((t, i) => (
          <li key={t.slug}>
            <span className="n">{i + 1}.</span>
            <div style={{ flex: 1 }}>
              <form action={editTopic} className="form topic-row">
                <input type="hidden" name="slug" value={t.slug} />
                <input name="name" defaultValue={t.name} required aria-label="Nome" />
                <input name="description" defaultValue={t.description} aria-label="Descrição" />
                <button type="submit" className="link">Salvar</button>
              </form>
              <span className="meta">
                /topicos/{t.slug} · {counts[t.slug] || 0} publicação(ões)
                {!counts[t.slug] && <>{" · "}<DeleteButton id={t.slug} field="slug" action={removeTopic} title={t.name} className="link danger-link" /></>}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
