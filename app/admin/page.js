import Link from "next/link";
import { adminConfigured, isAdmin } from "@/lib/auth";
import { getAllPosts, formatDate } from "@/lib/posts";
import { login, logout } from "./actions";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function Admin({ searchParams }) {
  const sp = await searchParams;

  if (!adminConfigured())
    return (
      <>
        <h1>Admin</h1>
        <p className="empty">Defina a variável de ambiente <code>ADMIN_PASSWORD</code> para ativar o admin (veja o README).</p>
      </>
    );

  if (!(await isAdmin()))
    return (
      <>
        <h1>Admin</h1>
        <form action={login} className="form" style={{ maxWidth: 340 }}>
          <label>Senha<input type="password" name="senha" autoFocus autoComplete="current-password" required /></label>
          {sp.erro && <p className="err">Senha incorreta.</p>}
          <button type="submit">Entrar</button>
        </form>
      </>
    );

  let rows = [], error = sp.erro && sp.erro !== "1" ? sp.erro : null;
  try { rows = await getAllPosts({ includeDrafts: true }); } catch (e) { error = e.message; }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <h1>Admin</h1>
        <form action={logout}><button className="link" type="submit">Sair</button></form>
      </div>
      {sp.ok && <p className="ok">Publicação {sp.ok === "salvo" ? "salva" : "excluída"}. Já está no ar.</p>}
      {error && <p className="err">{error}</p>}
      <p><Link className="btn" href="/admin/editor">+ Nova publicação</Link></p>
      <ol className="list">
        {rows.map((r, i) => (
          <li key={r.id}>
            <span className="n">{i + 1}.</span>
            <div>
              <Link href={`/admin/editor?id=${r.id}`} className="t">{r.title}</Link>
              <span className="meta">
                {formatDate(r.date)}{r.draft ? " · rascunho" : ""} · {r.topic.name}
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
