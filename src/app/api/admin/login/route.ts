import { z } from "zod";
import { loginBlocked, makeSession, recordLogin, sameOrigin, sessionCookieHeader, tokenMatches } from "@/lib/admin/session";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!process.env.UNHYPED_ADMIN_TOKEN) return Response.json({ error: "Admin is not configured on this deployment" }, { status: 503 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (loginBlocked(ip)) return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  const body = z.object({ token: z.string().min(1).max(500) }).safeParse(await req.json().catch(() => null));
  const ok = body.success && tokenMatches(body.data.token);
  recordLogin(ip, ok);
  if (!ok) return Response.json({ error: "Wrong token" }, { status: 401 });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json", "Set-Cookie": sessionCookieHeader(makeSession()) },
  });
}
