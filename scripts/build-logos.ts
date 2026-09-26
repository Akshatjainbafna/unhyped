// Matches every entry to a real brand logo and writes only the ones used to
// data/logos.json. Sources: LobeHub AI icons (MIT) first, Simple Icons (CC0)
// for brands LobeHub lacks. Logos are shown unaltered as nominative
// references to the products; entries without a match get a lettered badge.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import * as simpleIcons from "simple-icons";

type Rule = [RegExp, string];
const LOBE_DIR = "node_modules/@lobehub/icons-static-svg/icons";

// Ordered: the first matching rule wins. Tested against id + title, then creators.
const RULES: Rule[] = [
  [/claude[- ]code/, "lobe:claudecode"],
  [/claude|anthropic|mythos|fable/, "lobe:claude"],
  [/\bsora\b/, "lobe:sora"],
  [/dall[·-]?e|dalle/, "lobe:dalle"],
  [/\bcodex\b/, "lobe:codex"],
  [/chatgpt|gpt-|\bgpt\b|openai|\bo1\b|\bo3\b|operator|whisper|instructgpt/, "lobe:openai"],
  [/notebooklm/, "lobe:notebooklm"],
  [/gemma/, "lobe:gemma"],
  [/gemini|\bbard\b/, "lobe:gemini"],
  [/deepmind|alphago|alphafold|alphazero|alphaproof|alphastar|alphaevolve|alphageometry|wavenet|\bimo\b/, "lobe:deepmind"],
  [/tensorflow/, "si:tensorflow"],
  [/colab/, "lobe:colab"],
  [/pytorch/, "si:pytorch"],
  [/hermes[- ]agent/, "lobe:hermesagent"],
  [/hermes|nous research/, "lobe:nousresearch"],
  [/ollama/, "lobe:ollama"],
  [/llama[- ]?cpp|llama\.cpp|gguf/, "none"],
  [/llama|\bmuse\b|galactica|meta ai|\bmeta\b|facebook ai|fair\b/, "lobe:meta"],
  [/github copilot|copilot/, "lobe:githubcopilot"],
  [/autogen|microsoft|bing|azure/, "lobe:microsoft"],
  [/nvidia|cuda|blackwell|hopper|\bh100\b|vera rubin|cudnn/, "lobe:nvidia"],
  [/deepseek/, "lobe:deepseek"],
  [/qwen|alibaba/, "lobe:qwen"],
  [/kimi|moonshot/, "lobe:kimi"],
  [/\bglm\b|zhipu|z\.ai/, "lobe:zhipu"],
  [/minimax/, "lobe:minimax"],
  [/mistral|mixtral/, "lobe:mistral"],
  [/grok|\bxai\b|x\.ai/, "lobe:grok"],
  [/perplexity/, "lobe:perplexity"],
  [/midjourney/, "lobe:midjourney"],
  [/stable diffusion|stability|stable-diffusion|sdxl/, "lobe:stability"],
  [/\bflux\b|black forest/, "lobe:flux"],
  [/runway/, "lobe:runway"],
  [/\bpika\b/, "lobe:pika"],
  [/\bluma\b|dream machine/, "lobe:luma"],
  [/\bsuno\b/, "lobe:suno"],
  [/\budio\b/, "lobe:udio"],
  [/elevenlabs/, "lobe:elevenlabs"],
  [/hailuo/, "lobe:hailuo"],
  [/kling/, "lobe:kling"],
  [/cursor/, "lobe:cursor"],
  [/windsurf|codeium/, "lobe:windsurf"],
  [/openhands|opendevin/, "lobe:openhands"],
  [/\bdevin\b|cognition (labs|ai)/, "lobe:devin"],
  [/replit/, "lobe:replit"],
  [/lovable|gpt-engineer/, "lobe:lovable"],
  [/\bv0\b|vercel/, "lobe:v0"],
  [/manus/, "lobe:manus"],
  [/\bcline\b/, "lobe:cline"],
  [/roo[- ]code/, "lobe:roocode"],
  [/openhands|opendevin/, "lobe:openhands"],
  [/opencode/, "lobe:opencode"],
  [/openclaw/, "lobe:openclaw"],
  [/goose/, "lobe:goose"],
  [/langgraph/, "lobe:langgraph"],
  [/langsmith/, "lobe:langsmith"],
  [/langchain/, "lobe:langchain"],
  [/llamaindex/, "lobe:llamaindex"],
  [/crewai/, "lobe:crewai"],
  [/\bdify\b/, "lobe:dify"],
  [/\bn8n\b/, "lobe:n8n"],
  [/zapier/, "lobe:zapier"],
  [/ollama/, "lobe:ollama"],
  [/lm studio/, "lobe:lmstudio"],
  [/vllm/, "lobe:vllm"],
  [/unsloth/, "lobe:unsloth"],
  [/comfyui/, "lobe:comfyui"],
  [/firefly/, "lobe:adobefirefly"],
  [/open webui/, "lobe:openwebui"],
  [/firecrawl/, "lobe:firecrawl"],
  [/hugging ?face|\bhf\b|transformers library|chatbot arena|lmsys/, "lobe:huggingface"],
  [/model context protocol|\bmcp\b/, "lobe:mcp"],
  [/\bai2\b|allen institute|olmo/, "lobe:ai2"],
  [/cohere/, "lobe:cohere"],
  [/sakana/, "lobe:sakana"],
  [/ibm|watson|deep blue/, "lobe:ibm"],
  [/amazon|\baws\b|alexa/, "lobe:aws"],
  [/apple|siri/, "lobe:apple"],
  [/tesla|self-driving car timelines/, "si:tesla"],
  [/klarna/, "si:klarna"],
  [/duolingo/, "si:duolingo"],
  [/stack overflow/, "si:stackoverflow"],
  [/mcdonald/, "si:mcdonalds"],
  [/spacex/, "si:spacex"],
  [/irobot|roomba/, "si:irobot"],
  [/baidu/, "lobe:baidu"],
  [/bytedance|seedance|doubao/, "lobe:bytedance"],
  [/tencent|hunyuan/, "lobe:tencent"],
  [/scikit-learn/, "si:scikitlearn"],
  [/keras/, "si:keras"],
  [/jupyter/, "si:jupyter"],
  [/wandb|weights & biases/, "lobe:wandb"],
  [/google|brain team|word2vec|transformer|bert\b|\bt5\b|tpu|waymo/, "lobe:google"],
];

function lobe(name: string): string | undefined {
  for (const variant of [`${name}-color`, name]) {
    const p = `${LOBE_DIR}/${variant}.svg`;
    if (existsSync(p)) return readFileSync(p, "utf8").replace(/fill="currentColor"/g, 'fill="#26283b"');
  }
}

function simple(slug: string): string | undefined {
  const icon = Object.values(simpleIcons).find((i) => (i as { slug?: string })?.slug === slug) as
    | { path: string; hex: string; title: string }
    | undefined;
  if (!icon) return;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>${icon.title}</title><path fill="#${icon.hex}" d="${icon.path}"/></svg>`;
}

function resolve(ref: string) {
  const [src, name] = ref.split(":");
  return src === "lobe" ? lobe(name) : src === "si" ? simple(name) : undefined;
}

type E = { id: string; title: string; creators?: string[]; type: string; parentId?: string };
const entries: E[] = JSON.parse(readFileSync("data/entries.json", "utf8"));
const byId = new Map(entries.map((e) => [e.id, e]));
const out: Record<string, string> = {}; // entry id → /logos/<file>.svg
const cache = new Map<string, string | undefined>();
const missing: string[] = [];

const match = (text: string) => RULES.find(([re]) => re.test(text))?.[1];

for (const e of entries) {
  if (e.type === "person") continue;
  const own = `${e.id} ${e.title}`.toLowerCase();
  let ref = match(own) ?? match((e.creators ?? []).join(" ").toLowerCase());
  // Major updates inherit their parent's logo.
  if (!ref && e.parentId) ref = match(`${e.parentId} ${byId.get(e.parentId)?.title ?? ""}`.toLowerCase());
  if (!ref || ref === "none") continue;
  if (!cache.has(ref)) cache.set(ref, resolve(ref));
  const svg = cache.get(ref);
  if (svg) out[e.id] = `/logos/${ref.replace(":", "-")}.svg`;
  else missing.push(`${e.id} → ${ref}`);
}

// Static files so the browser loads marks lazily and caches them.
mkdirSync("public/logos", { recursive: true });
for (const [ref, svg] of cache) if (svg) writeFileSync(`public/logos/${ref.replace(":", "-")}.svg`, svg);
writeFileSync("data/logos.json", JSON.stringify(out, null, 0) + "\n");
console.log(`logos for ${Object.keys(out).length} entries (${[...cache.values()].filter(Boolean).length} marks in public/logos)`);
if (missing.length) console.warn("unresolved refs:", missing);
