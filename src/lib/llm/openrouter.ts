import "server-only";

/**
 * Minimal OpenRouter client. Production pins one open-weight model plus a
 * named fallback so scores stay comparable between quiz takers.
 */
export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function llmConfigured() {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.UNHYPED_GRADER_MODEL);
}

/**
 * Research can use its own provider: set UNHYPED_RESEARCH_BASE_URL (any OpenAI-compatible
 * chat completions URL, e.g. Google's) with UNHYPED_RESEARCH_API_KEY. Otherwise it goes
 * through OpenRouter, with the grader models as fallbacks.
 */
export const ownResearchProvider = () => Boolean(process.env.UNHYPED_RESEARCH_BASE_URL);

export function researchModels() {
  if (ownResearchProvider()) return [process.env.UNHYPED_RESEARCH_MODEL].filter(Boolean) as string[];
  return [process.env.UNHYPED_RESEARCH_MODEL, process.env.UNHYPED_GRADER_MODEL, process.env.UNHYPED_GRADER_FALLBACK].filter(Boolean) as string[];
}

export const researchKey = () => (ownResearchProvider() ? process.env.UNHYPED_RESEARCH_API_KEY : process.env.OPENROUTER_API_KEY);

/** Only OpenRouter has the web-search plugin. */
export const canSearchWeb = () => !ownResearchProvider();

export async function chatJSON<T>(
  messages: ChatMessage[],
  {
    temperature = 0,
    maxTokens = 600,
    models = [process.env.UNHYPED_GRADER_MODEL, process.env.UNHYPED_GRADER_FALLBACK].filter(Boolean) as string[],
    timeoutMs = 30_000,
    webSearch = false,
    research = false,
  }: { temperature?: number; maxTokens?: number; models?: string[]; timeoutMs?: number; webSearch?: boolean; research?: boolean } = {},
): Promise<T> {
  let lastError: unknown;
  for (const model of models) {
    try {
      const url = research && ownResearchProvider() ? process.env.UNHYPED_RESEARCH_BASE_URL! : (process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1/chat/completions");
      const key = research ? researchKey() : process.env.OPENROUTER_API_KEY;
      const effort = research ? process.env.UNHYPED_RESEARCH_REASONING : undefined; // low | medium | high | none
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "X-Title": "Unhyped",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
          ...(webSearch && canSearchWeb() ? { plugins: [{ id: "web", max_results: 6 }] } : {}),
          ...(effort ? { reasoning_effort: effort } : {}),
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) {
        const detail = await res.json().then((j) => j?.error?.message as string | undefined).catch(() => undefined);
        throw new Error(`${model}: HTTP ${res.status}${detail ? `: ${detail}` : ""}`);
      }
      const data = await res.json();
      const choice = data.choices?.[0];
      const raw = choice?.message?.content;
      const text: string = Array.isArray(raw) ? raw.map((p: { text?: string }) => p.text ?? "").join("") : (raw ?? "");
      try {
        return parseJSON<T>(text);
      } catch {
        // Say why: a cut-off answer (finish_reason "length") needs a bigger cap, not a retry.
        throw new Error(`${model}: no JSON in the reply (finish_reason ${choice?.finish_reason ?? "unknown"}, ${text.length} chars): ${text.slice(0, 160).replace(/\s+/g, " ")}`);
      }
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("LLM call failed");
}

/** Accepts bare JSON or JSON wrapped in prose / code fences. */
export function parseJSON<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object in model output");
    return JSON.parse(match[0]) as T;
  }
}
