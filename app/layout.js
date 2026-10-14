import "./globals.css";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { getSession } from "@/lib/auth";
import { countPostsByTopic, getMostLiked, getTopics, postPath } from "@/lib/posts";
import { logout } from "./admin/actions";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: fundamentos de broadcast`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { siteName: SITE.name, locale: "pt_BR", type: "website" },
};

export default async function RootLayout({ children }) {
  const [session, topics, counts, liked] = await Promise.all([
    getSession().catch(() => null),
    getTopics().catch(() => []),
    countPostsByTopic({ publishedOnly: true }).catch(() => ({})),
    getMostLiked(5).catch(() => []),
  ]);
  return (
    <html lang="pt-BR">
      <body>
        <header className="top">
          <div className="wrap wide">
            <Link href="/" className="brand">Media<span>Lake</span></Link>
            <nav>
              <Link href="/">Publicações</Link>
              <Link href="/topicos">Tópicos</Link>
            </nav>
            <div className="account">
              {session
                ? <>
                    {!session.admin && <span className="who">{session.name}</span>}
                    <Link href="/admin" prefetch={false}>{session.admin ? "Admin" : "Painel"}</Link>
                    <form action={logout}><button type="submit" className="link">Sair</button></form>
                  </>
                : <Link href="/admin" prefetch={false}>Entrar</Link>}
            </div>
          </div>
        </header>
        <main className="wide layout">
          <aside className="side left">
            <h2>Tópicos</h2>
            <ul className="sidelist">
              {topics.map((t) => (
                <li key={t.slug}>
                  <Link href={`/topicos/${t.slug}`}>{t.name}</Link>
                  {counts[t.slug] > 0 && <span className="count">{counts[t.slug]}</span>}
                </li>
              ))}
            </ul>
          </aside>
          <div className="content">{children}</div>
          <aside className="side right">
            {liked.length > 0 && (
              <section className="card">
                <h2>Mais curtidos</h2>
                <ol className="sidelist ranked">
                  {liked.map((p) => (
                    <li key={p.id}><Link href={postPath(p)}>{p.title}</Link><span className="count">👍 {p.likes}</span></li>
                  ))}
                </ol>
              </section>
            )}
            {!session && (
              <section className="card">
                <h2>Quer escrever?</h2>
                <p>Crie sua conta de autor e publique depois da aprovação.</p>
                <Link href="/cadastro">Criar conta →</Link>
              </section>
            )}
          </aside>
        </main>
        <footer className="bottom">
          <div className="wrap wide">
            <span>© {new Date().getFullYear()} {SITE.name} · {SITE.description}</span>
            <span className="links">
              <Link href="/topicos">Tópicos</Link>
              <Link href="/sobre">Sobre</Link>
              <a href="/rss.xml">RSS</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
