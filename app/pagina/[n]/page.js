import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";
import PostList from "../../PostList";
import Pager from "../../Pager";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { n } = await params;
  const page = Number(n);
  const all = await getAllPosts();
  const pages = Math.ceil(all.length / SITE.perPage);
  if (!Number.isInteger(page) || page < 2 || page > pages) notFound();
  const start = (page - 1) * SITE.perPage;
  return (
    <>
      <h1>Publicações</h1>
      <p className="lead">Página {page} de {pages}</p>
      <PostList posts={all.slice(start, start + SITE.perPage)} start={start + 1} />
      <Pager page={page} total={pages} />
    </>
  );
}
