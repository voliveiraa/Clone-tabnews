import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";
import PostList from "./PostList";
import Pager from "./Pager";

export const dynamic = "force-dynamic";

export default async function Home() {
  const all = await getAllPosts();
  const pages = Math.max(1, Math.ceil(all.length / SITE.perPage));
  return (
    <>
      <h1>Fundamentos de broadcast</h1>
      <p className="lead">{SITE.description}</p>
      <PostList posts={all.slice(0, SITE.perPage)} />
      <Pager page={1} total={pages} />
    </>
  );
}
