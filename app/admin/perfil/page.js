import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAuthorProfile } from "@/lib/profiles";
import AvatarBuilder from "../../AvatarBuilder";
import { saveProfile } from "../actions";

export const dynamic = "force-dynamic";

export default async function Perfil({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/admin");
  const sp = await searchParams;
  const p = await getAuthorProfile(session.admin ? null : session.id);
  return (
    <>
      <p className="meta"><Link href="/admin">← Voltar</Link></p>
      <h1>Meu perfil</h1>
      <p className="lead">Seu avatar, nome e cargo aparecem no cartão do autor em cada publicação sua e no pódio da semana.</p>
      {sp.ok && <p className="ok">Perfil salvo.</p>}
      {sp.erro && <p className="err">{sp.erro}</p>}
      <form action={saveProfile} className="form">
        <label style={{ maxWidth: 400 }}>Nome que aparece nos posts<input name="name" defaultValue={p.name} required maxLength={80} /></label>
        <AvatarBuilder initialAvatar={p.avatar} initialTitle={p.title || undefined} name={p.name} />
        <p><button type="submit">Salvar perfil</button></p>
      </form>
    </>
  );
}
