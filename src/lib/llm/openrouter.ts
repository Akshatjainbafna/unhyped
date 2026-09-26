import "server-only";

/**
 * Minimal OpenRouter client. Production pins one open-weight model plus a
 * named fallback so scores stay comparable between quiz takers.
 */
export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export function llmConfigured() {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.UNHYPED_GRADER_MODEL);
}

export async function chatJSON<T>(
  messages: ChatMessage[],
  { temperature = 0, maxTokens = 600 }: { temperature?: number; maxTokens?: number } = {},
): Promise<T> {
  const models = [process.env.UNHYPED_GRADER_MODEL, process.env.UNHYPED_GRADER_FALLBACK].filter(Boolean) as string[];
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
        }),
        signal: AbortSignal.timeout(30_000),
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
