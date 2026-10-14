import { getAllPosts, getTopics, postPath } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const posts = await getAllPosts();
  const u = (p, d) => ({ url: SITE.url + p, ...(d ? { lastModified: d } : {}) });
  return [
    u("/"), u("/topicos"), u("/sobre"),
    ...(await getTopics()).map((t) => u(`/topicos/${t.slug}`)),
    ...posts.map((p) => u(postPath(p), p.date)),
  ];
}
