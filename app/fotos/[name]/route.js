import { get } from "@vercel/blob";
import { blobAuth, PHOTO_NAME_RE, PHOTO_PREFIX } from "@/lib/blob";

// Entrega as fotos da loja Blob privada. O nome tem sufixo aleatório e nunca muda,
// então pode ficar em cache (navegador e CDN da Vercel) por um ano.
export async function GET(req, { params }) {
  const { name } = await params;
  const auth = blobAuth();
  if (!auth || !PHOTO_NAME_RE.test(name)) return new Response("Não encontrada", { status: 404 });

  let r;
  try {
    r = await get(PHOTO_PREFIX + name, { access: "private", ifNoneMatch: req.headers.get("if-none-match") || undefined, ...auth });
  } catch {
    r = null;
  }
  if (!r) return new Response("Não encontrada", { status: 404 });

  const headers = {
    "Cache-Control": "public, max-age=31536000, immutable",
    ETag: r.blob.etag,
    "X-Content-Type-Options": "nosniff",
  };
  if (r.statusCode === 304) return new Response(null, { status: 304, headers });
  return new Response(r.stream, { headers: { ...headers, "Content-Type": r.blob.contentType, "Content-Length": String(r.blob.size) } });
}
