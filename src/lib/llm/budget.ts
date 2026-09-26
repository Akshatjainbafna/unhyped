import "server-only";

/**
 * Budget & rate guard. v1 keeps counters in memory per server instance, which
 * is enough to stop abuse on a single region; swap `counters` for a hosted KV
 * (e.g. Upstash) to make limits global across instances.
 */
export type Verdict = "allow" | "throttle" | "light-mode";

const PER_SESSION = Number(process.env.UNHYPED_CALLS_PER_SESSION ?? 30);
const PER_IP_HOUR = Number(process.env.UNHYPED_CALLS_PER_IP_HOUR ?? 120);
const DAILY_CAP = Number(process.env.UNHYPED_DAILY_CALL_CAP ?? 5000);

const counters = new Map<string, { n: number; resetAt: number }>();

function bump(key: string, windowMs: number, now: number) {
  const cur = counters.get(key);
  if (!cur || cur.resetAt <= now) {
    counters.set(key, { n: 1, resetAt: now + windowMs });
    return 1;
  }
  cur.n += 1;
  return cur.n;
}

function peek(key: string, now: number) {
  const cur = counters.get(key);
  return !cur || cur.resetAt <= now ? 0 : cur.n;
}

export function admit(session: string, ip: string, calls = 1, now = Date.now()): Verdict {
  const day = new Date(now).toISOString().slice(0, 10);
  if (peek(`day:${day}`, now) + calls > DAILY_CAP) return "light-mode";
  if (peek(`s:${session}`, now) + calls > PER_SESSION) return "throttle";
  if (peek(`ip:${ip}`, now) + calls > PER_IP_HOUR) return "throttle";
  for (let i = 0; i < calls; i++) {
    bump(`day:${day}`, 86_400_000, now);
    bump(`s:${session}`, 86_400_000, now);
    bump(`ip:${ip}`, 3_600_000, now);
  }
  return "allow";
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
