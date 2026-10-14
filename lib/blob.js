// Credenciais do Vercel Blob. Lojas novas criam BLOB_STORE_ID (a Vercel autentica sozinha via OIDC);
// as antigas criam BLOB_READ_WRITE_TOKEN. A integração pode pôr prefixo (ex.: storage_BLOB_STORE_ID).
const env = (name) => process.env[name] || Object.entries(process.env).find(([k, v]) => k.endsWith(name) && v)?.[1];

export function blobAuth() {
  const token = env("BLOB_READ_WRITE_TOKEN");
  if (token) return { token };
  const storeId = env("BLOB_STORE_ID");
  return storeId ? { storeId } : null;
}

// Fotos ficam em posts/<nome> no Blob e são servidas pelo site em /fotos/<nome>.
export const PHOTO_PREFIX = "posts/";
export const PHOTO_NAME_RE = /^[A-Za-z0-9._-]{1,200}$/;
