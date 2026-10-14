import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "ml_admin";
const MAX_AGE = 60 * 60 * 8; // 8 horas

const secret = () => {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return crypto.createHash("sha256").update("medialake-session:" + pw).digest();
};
const sign = (exp) => crypto.createHmac("sha256", secret()).update(String(exp)).digest("hex");
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

export async function startSession() {
  const exp = Date.now() + MAX_AGE * 1000;
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin() {
  if (!secret()) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  if (!v) return false;
  const [exp, sig] = v.split(".");
  return Number(exp) > Date.now() && safeEqual(sig || "", sign(exp));
}
