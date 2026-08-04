import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "patican_admin";
const MAX_AGE = 60 * 60 * 12; // 12 saat

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "patican-dev-secret";
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "patican2024";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(input: unknown) {
  if (typeof input !== "string" || !input) return false;
  return safeEqual(input, adminPassword());
}

export function createToken() {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `admin.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expires, signature] = parts;
  const payload = `${role}.${expires}`;
  if (!safeEqual(signature, sign(payload))) return false;
  return Number(expires) > Date.now();
}

export async function isAuthenticated() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

export const cookieName = COOKIE;
export const cookieMaxAge = MAX_AGE;
