import { getAllPosts, postPath } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const items = (await getAllPosts()).slice(0, 30).map((p) => `
    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE.url}${postPath(p)}</link>
      <guid>${SITE.url}${postPath(p)}</guid>
      <pubDate>${new Date(p.date + "T12:00:00Z").toUTCString()}</pubDate>
      <category>${esc(p.topic.name)}</category>
      ${p.summary ? `<description>${esc(p.summary)}</description>` : ""}
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>${SITE.name}</title>
  <link>${SITE.url}</link>
  <description>${esc(SITE.description)}</description>
  <language>pt-BR</language>${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
