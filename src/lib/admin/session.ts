import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Owner-only auth. The secret is UNHYPED_ADMIN_TOKEN; logging in with it sets a
 * signed, HttpOnly, SameSite=Strict cookie that expires after 12 hours. The
 * cookie is an HMAC of its expiry keyed by the token, so rotating the token
 * signs everyone out. Scripts can still send the token as a Bearer header.
 */
export const COOKIE = "unhyped_admin";
export const SESSION_SECONDS = 12 * 60 * 60;

const safeEqual = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const sign = (exp: string, token: string) => createHmac("sha256", token).update(`unhyped-admin:${exp}`).digest("hex");

export function tokenMatches(given: string): boolean {
  const token = process.env.UNHYPED_ADMIN_TOKEN;
  return Boolean(token) && safeEqual(given, token!);
}

export function makeSession(now = Date.now()): string {
  const exp = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${exp}.${sign(exp, process.env.UNHYPED_ADMIN_TOKEN!)}`;
}

export function sessionValid(value: string | undefined, now = Date.now()): boolean {
  const token = process.env.UNHYPED_ADMIN_TOKEN;
  if (!token || !value) return false;
  const [exp, mac] = value.split(".");
  if (!exp || !mac || !/^\d+$/.test(exp) || Number(exp) * 1000 < now) return false;
  return safeEqual(mac, sign(exp, token));
}

export function cookieFrom(req: Request, name = COOKIE): string | undefined {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

/** Cookie session or Bearer token. */
export function isAuthed(req: Request): boolean {
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (bearer && tokenMatches(bearer)) return true;
  return sessionValid(cookieFrom(req));
}

/** State-changing requests must come from this site (the cookie is SameSite=Strict as well). */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients (scripts) send no Origin and must use Bearer
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Best-effort brute-force brake. In-memory, so per server instance.
const fails = new Map<string, { n: number; until: number }>();
export function loginBlocked(ip: string, now = Date.now()): boolean {
  const f = fails.get(ip);
  return Boolean(f && f.n >= 5 && f.until > now);
}
export function recordLogin(ip: string, ok: boolean, now = Date.now()) {
  if (ok) return void fails.delete(ip);
  const f = fails.get(ip);
  fails.set(ip, { n: (f && f.until > now ? f.n : 0) + 1, until: now + 15 * 60 * 1000 });
}

export function sessionCookieHeader(value: string, maxAge = SESSION_SECONDS) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}
