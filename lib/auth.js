import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getUserById } from "./users";

const COOKIE = "ml_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias: depois do primeiro login o navegador continua logado

// As sessões são assinadas com uma chave derivada da ADMIN_PASSWORD:
// trocar a senha do admin desconecta todo mundo (admin e autores).
const secret = () => {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHash("sha256").update("medialake-session:" + pw).digest();
};
const sign = (payload) => crypto.createHmac("sha256", secret()).update(payload).digest("hex");
const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function passwordOk(input) {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw) && safeEqual(crypto.createHash("sha256").update(String(input)).digest("hex"),
                                  crypto.createHash("sha256").update(pw).digest("hex"));
}

// who: "admin" ou "u<id do autor>"
export async function startSession(who = "admin") {
  const exp = Date.now() + MAX_AGE * 1000;
  (await cookies()).set(COOKIE, `${who}.${exp}.${sign(`${who}.${exp}`)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: MAX_AGE,
  });
}

export async function endSession() {
  const c = await cookies();
  c.delete({ name: COOKIE, path: "/" });
  c.delete({ name: COOKIE, path: "/admin" }); // cookie antigo, de antes das contas de autor
}

// Devolve { admin: true } para o admin, { admin: false, id, name } para um autor aprovado, ou null.
export async function getSession() {
  if (!secret()) return null;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return null;
  const [who, exp, sig] = v.split(".");
  if (!(Number(exp) > Date.now() && safeEqual(sig || "", sign(`${who}.${exp}`)))) return null;
  if (who === "admin") return { admin: true, id: null, name: "Admin" };
  if (!/^u\d+$/.test(who)) return null;
  const u = await getUserById(who.slice(1));
  if (!u || u.status !== "approved") return null; // bloqueado ou excluído perde o acesso na hora
  return { admin: false, id: u.id, name: u.name, username: u.username };
}

export async function isAdmin() {
  return (await getSession())?.admin === true;
}
