"use server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";
import { blobAuth, PHOTO_PREFIX } from "@/lib/blob";

const MAX_BYTES = 4 * 1024 * 1024; // a Vercel aceita no máximo ~4,5 MB por requisição
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

export async function uploadImage(formData) {
  if (!(await getSession())) return { error: "Sua sessão expirou. Entre de novo." };
  const auth = blobAuth();
  if (!auth) return { error: "Envio de fotos ainda não configurado: crie o Vercel Blob em Storage (veja o README)." };
  const file = formData.get("file");
  if (!file || typeof file === "string" || !file.size) return { error: "Escolha uma imagem." };
  const ext = TYPES[file.type];
  if (!ext) return { error: "Formato não suportado. Use JPG, PNG, WebP ou GIF." };
  if (file.size > MAX_BYTES) return { error: "Imagem maior que 4 MB. Reduza o tamanho e tente de novo." };

  const opts = { addRandomSuffix: true, contentType: file.type, ...auth };
  try {
    // Loja privada (padrão): o site entrega a foto em /fotos/<nome>.
    const blob = await put(`${PHOTO_PREFIX}foto.${ext}`, file, { ...opts, access: "private" });
    return { url: "/fotos/" + blob.pathname.slice(PHOTO_PREFIX.length) };
  } catch (e) {
    // Loja pública: usa o link direto do Blob.
    if (/public store/i.test(e.message)) {
      try {
        const blob = await put(`${PHOTO_PREFIX}foto.${ext}`, file, { ...opts, access: "public" });
        return { url: blob.url };
      } catch (e2) {
        return { error: "Falha ao enviar a imagem: " + e2.message };
      }
    }
    return { error: "Falha ao enviar a imagem: " + e.message };
  }
}
