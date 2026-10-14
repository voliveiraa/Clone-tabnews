import Link from "next/link";
import { formatDate, postPath } from "@/lib/posts";

export default function PostList({ posts, start = 1 }) {
  if (!posts.length) return <p className="empty">Ainda não há publicações aqui.</p>;
  return (
    <ol className="list">
      {posts.map((p, i) => (
        <li key={p.slug}>
          <span className="n">{start + i}.</span>
          <div>
            <Link href={postPath(p)} className="t">{p.title}</Link>
            <span className="meta">
              <Link href={`/topicos/${p.topic.slug}`}>{p.topic.name}</Link> · {formatDate(p.date)} · {p.minutes} min de leitura
              {p.likes > 0 && <> · 👍 {p.likes}</>}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}
