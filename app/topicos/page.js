import Link from "next/link";
import { getAllPosts, getTopics } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tópicos", description: "Todos os tópicos do MediaLake." };

export default async function Topicos() {
  const posts = await getAllPosts();
  return (
    <>
      <h1>Tópicos</h1>
      <p className="lead">Escolha um assunto para ver as publicações.</p>
      <ul className="topics">
        {getTopics().map((t) => (
          <li key={t.slug}>
            <Link href={`/topicos/${t.slug}`}>
              <span className="count">{posts.filter((p) => p.topic.slug === t.slug).length}</span>
              <strong>{t.name}</strong>
              <p>{t.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
