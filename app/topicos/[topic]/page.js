import { notFound } from "next/navigation";
import { getAllPosts, getTopics } from "@/lib/posts";
import PostList from "../../PostList";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { topic } = await params;
  const t = getTopics().find((x) => x.slug === topic);
  return t ? { title: t.name, description: t.description } : {};
}

export default async function TopicPage({ params }) {
  const { topic } = await params;
  const t = getTopics().find((x) => x.slug === topic);
  if (!t) notFound();
  return (
    <>
      <h1>{t.name}</h1>
      <p className="lead">{t.description}</p>
      <PostList posts={await getAllPosts({ topic: t.slug })} />
    </>
  );
}
