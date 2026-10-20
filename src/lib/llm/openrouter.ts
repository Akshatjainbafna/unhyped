import "server-only";

/**
 * Minimal OpenRouter client. Production pins one open-weight model plus a
 * named fallback so scores stay comparable between quiz takers.
 */
export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function llmConfigured() {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.UNHYPED_GRADER_MODEL);
}

/** Research uses a stronger model than quiz grading when one is set. */
export function researchModels() {
  return [process.env.UNHYPED_RESEARCH_MODEL, process.env.UNHYPED_GRADER_MODEL, process.env.UNHYPED_GRADER_FALLBACK].filter(Boolean) as string[];
}

export async function chatJSON<T>(
  messages: ChatMessage[],
  {
    temperature = 0,
    maxTokens = 600,
    models = [process.env.UNHYPED_GRADER_MODEL, process.env.UNHYPED_GRADER_FALLBACK].filter(Boolean) as string[],
    timeoutMs = 30_000,
    webSearch = false,
  }: { temperature?: number; maxTokens?: number; models?: string[]; timeoutMs?: number; webSearch?: boolean } = {},
): Promise<T> {
  let lastError: unknown;
  for (const model of models) {
    try {
      const res = await fetch(process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "X-Title": "Unhyped",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          response_format: { type: "json_object" },
          ...(webSearch ? { plugins: [{ id: "web", max_results: 6 }] } : {}),
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) throw new Error(`${model}: HTTP ${res.status}`);
      const data = await res.json();
      const text: string = data.choices?.[0]?.message?.content ?? "";
      return parseJSON<T>(text);
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
