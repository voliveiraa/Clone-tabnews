import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listUsers } from "@/lib/users";
import { changeUserStatus } from "../actions";
import DeleteAccount from "./DeleteAccount";

export const dynamic = "force-dynamic";

const STATUS = { pending: "aguardando aprovação", approved: "aprovado", blocked: "bloqueado" };
const OK = { salvo: "Conta atualizada.", excluido: "Conta excluída." };

function StatusButton({ id, status, children }) {
  return (
    <form action={changeUserStatus} style={{ display: "inline" }}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className="link">{children}</button>
    </form>
  );
}

export default async function Contas({ searchParams }) {
  if (!(await isAdmin())) redirect("/admin");
  const sp = await searchParams;
  const users = await listUsers();
  return (
    <>
      <p className="meta"><Link href="/admin">← Voltar</Link></p>
      <h1>Contas</h1>
      <p className="lead">Só o admin vê esta página. Quem se cadastra em <Link href="/cadastro">/cadastro</Link> só publica depois de aprovado aqui.
        Bloquear tira o acesso na hora; excluir apaga a conta.</p>
      {sp.ok && <p className="ok">{OK[sp.ok]}</p>}
      {sp.erro && <p className="err">{sp.erro}</p>}
      <ol className="list">
        {users.map((u, i) => (
          <li key={u.id}>
            <span className="n">{i + 1}.</span>
            <div>
              <span className="t">{u.name} <span className="meta">@{u.username}</span></span>
              <span className="meta">
                <span className={`status ${u.status}`}>{STATUS[u.status] || u.status}</span>
                {" · "}desde {u.created.split("-").reverse().join("/")} · {u.posts} publicação(ões)
                {u.status !== "approved" && <>{" · "}<StatusButton id={u.id} status="approved">Aprovar</StatusButton></>}
                {u.status !== "blocked" && <>{" · "}<StatusButton id={u.id} status="blocked">Bloquear</StatusButton></>}
                {" · "}<DeleteAccount id={u.id} name={`${u.name} (@${u.username})`} posts={u.posts} />
              </span>
            </div>
          </li>
        ))}
      </ol>
      {!users.length && <p className="empty">Ninguém se cadastrou ainda.</p>}
    </>
  );
}
