import "./globals.css";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: fundamentos de broadcast`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { siteName: SITE.name, locale: "pt_BR", type: "website" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="top">
          <div className="wrap">
            <Link href="/" className="brand">Media<span>Lake</span></Link>
            <nav>
              <Link href="/">Publicações</Link>
              <Link href="/topicos">Tópicos</Link>
              <Link href="/sobre">Sobre</Link>
              <Link href="/admin" prefetch={false}>Admin</Link>
            </nav>
          </div>
        </header>
        <main><div className="wrap">{children}</div></main>
        <footer className="bottom">
          <div className="wrap">
            <span>© {new Date().getFullYear()} {SITE.name}</span>
            <Link href="/topicos">Tópicos</Link>
            <Link href="/sobre">Sobre</Link>
            <a href="/rss.xml">RSS</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
