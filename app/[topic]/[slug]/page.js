import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getPost, postPath } from "@/lib/posts";
import LikeButton from "../../LikeButton";
import { likedIds } from "../../likes";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { topic, slug } = await params;
  const p = await getPost(topic, slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary || undefined,
    alternates: { canonical: postPath(p) },
    openGraph: { type: "article", title: p.title, description: p.summary || undefined, publishedTime: p.date },
  };
}

export default async function PostPage({ params }) {
  const { topic, slug } = await params;
  const p = await getPost(topic, slug);
  if (!p) notFound();
  return (
    <>
      <h1>{p.title}</h1>
      <p className="meta postmeta">
        <Link href={`/topicos/${p.topic.slug}`}>{p.topic.name}</Link> · {formatDate(p.date)} · {p.minutes} min de leitura
      </p>
      <article dangerouslySetInnerHTML={{ __html: p.html }} />
      <div className="likebar">
        <span className="meta">Gostou? Deixe sua curtida.</span>
        <LikeButton id={p.id} initialTotal={p.likes} initialLiked={(await likedIds()).includes(p.id)} />
      </div>
    </>
  );
}
