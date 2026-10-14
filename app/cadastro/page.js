import Link from "next/link";
import { getSession } from "@/lib/auth";
import { register } from "../admin/actions";
import AvatarBuilder from "../AvatarBuilder";

export const dynamic = "force-dynamic";
export const metadata = { title: "Criar conta de autor", robots: { index: false, follow: false } };

export default async function Cadastro({ searchParams }) {
  const sp = await searchParams;
  const session = await getSession().catch(() => null);
  if (sp.ok)
    return (
      <>
        <h1>Conta criada</h1>
        <p className="ok">Pronto! Sua conta está aguardando a aprovação do admin.</p>
        <p>Assim que for aprovada, entre em <Link href="/admin">medialake.com.br/admin</Link> com seu usuário e senha.</p>
      </>
    );
  return (
    <>
      <h1>Criar conta de autor</h1>
      {session && <p className="err">Você está conectado como {session.name}. Ao criar uma conta nova, você sai dessa conta.</p>}
      <p className="lead">Autores aprovados podem publicar no MediaLake. Depois do cadastro, o admin precisa aprovar sua conta.</p>
      <form action={register} className="form">
        <div style={{ display: "grid", gap: 14, maxWidth: 400 }}>
          <label>Seu nome (aparece nos posts)<input name="name" required maxLength={80} autoComplete="name" /></label>
          <label>Usuário (para entrar)<input name="usuario" required maxLength={30} autoCapitalize="none" autoComplete="username" /></label>
          <label>Senha (mínimo 8 caracteres)<input type="password" name="senha" required minLength={8} autoComplete="new-password" /></label>
          <label>Repita a senha<input type="password" name="senha2" required minLength={8} autoComplete="new-password" /></label>
        </div>
        <h2 style={{ margin: "18px 0 0" }}>Monte seu avatar</h2>
        <AvatarBuilder />
        {sp.erro && <p className="err">{sp.erro}</p>}
        <p><button type="submit">Criar conta</button></p>
      </form>
      <p className="meta" style={{ marginTop: 20 }}>Já tem conta? <Link href="/admin">Entrar</Link>.</p>
    </>
  );
}
