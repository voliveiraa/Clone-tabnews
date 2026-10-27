"use server";
import { getSession } from "@/lib/auth";
import { renderMarkdown } from "@/lib/render";

// Prévia do editor: o mesmo HTML (já filtrado) que o post terá no site.
export async function previewMarkdown(md) {
  if (!(await getSession())) return "";
  return renderMarkdown(String(md || "").slice(0, 200_000));
}
