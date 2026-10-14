"use server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

const MAX_BYTES = 4 * 1024 * 1024; // a Vercel aceita no máximo ~4,5 MB por requisição
const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

// Credenciais do Vercel Blob. Lojas novas criam BLOB_STORE_ID (a Vercel autentica sozinha via OIDC);
// as antigas criam BLOB_READ_WRITE_TOKEN. A integração pode pôr prefixo (ex.: storage_BLOB_STORE_ID).
const env = (name) => process.env[name] || Object.entries(process.env).find(([k, v]) => k.endsWith(name) && v)?.[1];
const blobAuth = () => {
  const token = env("BLOB_READ_WRITE_TOKEN");
  if (token) return { token };
  const storeId = env("BLOB_STORE_ID");
  return storeId ? { storeId } : null;
};

export async function uploadImage(formData) {
  if (!(await getSession())) return { error: "Sua sessão expirou. Entre de novo." };
  const auth = blobAuth();
  if (!auth) return { error: "Envio de fotos ainda não configurado: crie o Vercel Blob em Storage (veja o README)." };
  const file = formData.get("file");
  if (!file || typeof file === "string" || !file.size) return { error: "Escolha uma imagem." };
  const ext = TYPES[file.type];
  if (!ext) return { error: "Formato não suportado. Use JPG, PNG, WebP ou GIF." };
  if (file.size > MAX_BYTES) return { error: "Imagem maior que 4 MB. Reduza o tamanho e tente de novo." };
  try {
    const blob = await put(`posts/foto.${ext}`, file, { access: "public", addRandomSuffix: true, contentType: file.type, ...auth });
    return { url: blob.url };
  } catch (e) {
    return { error: "Falha ao enviar a imagem: " + e.message };
  }
}
