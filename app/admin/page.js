import Link from "next/link";
import { adminConfigured, getSession } from "@/lib/auth";
import { getAllPosts, formatDate } from "@/lib/posts";
import { countPendingUsers } from "@/lib/users";
import { login } from "./actions";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

const LOGIN_ERRORS = {
  "1": "Usuário ou senha incorretos.",
  pendente: "Sua conta ainda está aguardando aprovação do admin.",
  bloqueado: "Sua conta está bloqueada. Fale com o admin.",
};

export default async function Admin({ searchParams }) {
  const sp = await searchParams;

  if (!adminConfigured())
    return (
      <>
        <h1>Admin</h1>
        <p className="empty">Defina a variável de ambiente <code>ADMIN_PASSWORD</code> para ativar o admin (veja o README).</p>
      </>
    );

  const session = await getSession();
  if (!session)
    return (
      <>
        <h1>Entrar</h1>
        <form action={login} className="form" style={{ maxWidth: 340 }}>
          <label>Usuário<input name="usuario" autoFocus autoComplete="username" autoCapitalize="none" required /></label>
          <label>Senha<input type="password" name="senha" autoComplete="current-password" required /></label>
          {LOGIN_ERRORS[sp.erro] && <p className="err">{LOGIN_ERRORS[sp.erro]}</p>}
          <button type="submit">Entrar</button>
        </form>
        <p className="meta" style={{ marginTop: 20 }}>Quer escrever no MediaLake? <Link href="/cadastro">Crie sua conta de autor</Link>.</p>
      </>
    );

  let rows = [], pending = 0, error = sp.erro && !LOGIN_ERRORS[sp.erro] ? sp.erro : null;
  try {
    rows = await getAllPosts({ includeDrafts: true, authorId: session.admin ? undefined : session.id });
    if (session.admin) pending = await countPendingUsers();
  } catch (e) { error = e.message; }

  return (
    <>
      <h1>{session.admin ? "Admin" : "Minhas publicações"}</h1>
      {sp.ok && <p className="ok">Publicação {sp.ok === "salvo" ? "salva" : "excluída"}.</p>}
      {error && <p className="err">{error}</p>}
      <p className="adminbar">
        <Link className="btn" href="/admin/editor">+ Nova publicação</Link>
        {session.admin && <Link href="/admin/topicos">Gerenciar tópicos</Link>}
        {session.admin && <Link href="/admin/autores">Autores{pending > 0 && <span className="badge">{pending}</span>}</Link>}
      </p>
      <ol className="list">
        {rows.map((r, i) => (
          <li key={r.id}>
            <span className="n">{i + 1}.</span>
            <div>
              <Link href={`/admin/editor?id=${r.id}`} className="t">{r.title}</Link>
              <span className="meta">
                {formatDate(r.date)}{r.draft ? " · rascunho" : ""} · {r.topic.name}
                {session.admin && ` · ${r.author || "Admin"}`}
                {" · "}<Link href={`/admin/editor?id=${r.id}`}>Editar</Link>
                {" · "}<DeleteButton id={r.id} title={r.title} className="link danger-link" />
              </span>
            </div>
          </li>
        ))}
      </ol>
      {!rows.length && !error && <p className="empty">Nenhuma publicação ainda.</p>}
    </>
  );
}
