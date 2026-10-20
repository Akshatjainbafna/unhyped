import { sameOrigin, sessionCookieHeader } from "@/lib/admin/session";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return Response.json({ error: "Forbidden" }, { status: 403 });
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json", "Set-Cookie": sessionCookieHeader("", 0) },
  });
}
