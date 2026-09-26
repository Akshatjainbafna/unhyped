# The AI Landscape, September 2026: Where to Track It, and a Timeline and Taxonomy of the Hyped Tools

You can keep up without drowning by using three layers. Use **one daily curated digest** (AINews/Latent Space or TLDR AI). Use **two live data dashboards**: Artificial Analysis for capability and price, and OpenRouter rankings for real adoption. Use **one long-memory database** (Epoch AI) as your timeline. On top of that, add a weekly skim of Simon Willison's blog.

Your list of tools spans several layers of one stack. Resolving your names:
- **Claude Code and OpenCode** are coding-agent harnesses.
- **LangChain and LangGraph** are frameworks.
- **LangSmith** is an observability, evaluation and deployment platform, not a framework.\[1\]
- **n8n** is a workflow-automation platform.
- **Ollama** is a local model runtime.\[2\]
- **"openclaw"** is OpenClaw, the open-source personal agent.\[3\]
- **"muse"** is almost certainly Meta's Muse, the personal agent launched September 8, 2026, which runs on Meta's Muse Spark models.\[4\]\[5\]
- **"jev"** is almost certainly Jev, TypeSafe AI's "System One" decision model, launched September 15, 2026.\[6\]
- **"NOOV"** is the one real ambiguity. The best guess is NVIDIA's NOOA agent framework (July 2026). The literal match is Noov.ai, a consumer multi-model chat app.\[7\]\[8\]

## TL;DR

- **Tracking stack (≈15 min/day + 30 min/week):**
  - Daily: AINews (smol.ai, now part of Latent Space) or TLDR AI.
  - When models ship: Artificial Analysis, Arena (formerly LMArena) and OpenRouter rankings.
  - For history: Epoch AI's models database, which tracks over 3,600 models and was updated September 23, 2026.\[9\]\[10\]
  - Weekly: Simon Willison's blog plus The Batch or Import AI.
  - Skip the big tool directories (There's An AI For That lists 53,817 tools) unless you are shopping for a specific tool.\[11\]
- **Your categories need two fixes:**
  - LangSmith is not a framework. It is LangChain's closed-source observability, eval and deployment platform.\[1\]
  - "Harness" is correct for Claude Code and OpenCode, and it now also fits OpenClaw, Meta's Muse Code, Codex CLI and the Claude Agent SDK. A harness is "every piece of code, configuration, and execution logic that isn't the model itself"; a framework is the layer where you write your own agents.\[12\]
- **Hype waves:** ChatGPT (Nov 2022) → RAG/LangChain and vector DBs (2023) → function calling and multi-agent frameworks (2023–24) → reasoning models (o1, Sep 2024; DeepSeek-R1, Jan 2025) → MCP and terminal coding agents (2025) → personal always-on agents (OpenClaw, Jan 2026; Meta Muse, Sep 2026) → "harness engineering" and decision models (Jev, NOOA, Aug–Sep 2026).
  - Consolidating: protocols (MCP, A2A and AGENTS.md all sit under the Linux Foundation's Agentic AI Foundation), coding IDEs, and agent frameworks.\[13\]
  - Still frothy: personal agents, vibe-coding app builders, and benchmark leaderboards.

---

## Part 1 — Where to track AI advancements

### 1.1 Ranked list of tracking resources

Rank reflects signal-to-noise for someone who wants the *whole landscape as a timeline* without overload.

| # | Resource | What it covers | Update cadence | Cost | Best for |
|---|---|---|---|---|---|
| 1 | **Epoch AI – Data on AI Models / Notable AI Models** | Structured database of over 3,600 models from 1950 to today, with parameters, compute, dates and organizations\[9\] | Updated Sep 23, 2026 (roughly weekly or faster)\[9\] | Free, CC-BY\[14\] | The canonical long-horizon **timeline**; exportable CSV for your own knowledge graph |
| 2 | **Artificial Analysis** | Independent benchmarks of intelligence, speed and price across 171 models (Intelligence Index v4.3.2, 10 evals); also covers agents, image/video and speech\[15\]\[16\] | Continuous ("as we publish") | Free site; free API (1,000 req/day, attribution); paid Pro/Commercial tiers\[17\]\[18\] | Deciding whether a new model is actually better, faster or cheaper |
| 3 | **AINews by smol.ai (swyx), now part of Latent Space** | Agent-generated daily digest of 12 subreddits, 544 Twitter accounts and 24 Discords, plus commentary | Daily | Free | The single best "don't miss anything" daily feed for builders |\[19\]
| 4 | **Simon Willison's Weblog** | Hands-on notes on every notable model and tool release, LLM security (prompt injection), and local models | Near-daily (e.g., Opus 5.5/GPT-6 post Sep 22, 2026)\[20\] | Free (blog + Substack mirror) | Trustworthy, skeptical, practical takes |
| 5 | **Arena (formerly Chatbot Arena → LMArena)** | Crowdsourced blind pairwise votes (Bradley-Terry/Elo) across text, vision, WebDev, search and video | Continuous | Free | Human-preference ranking; read confidence intervals, since the top models are often statistically tied |\[21\]\[22\]\[23\]
| 6 | **OpenRouter Rankings** | Models ranked by tokens actually routed (day/week/month/trending)\[24\] | Daily | Free | Real **adoption** signal, i.e. what developers pay to use (popularity, not quality)\[25\] |
| 7 | **LifeArchitect.ai Models Table** (Alan D. Thompson) | 1,000+ models and 40,000+ data points (the page also says "900+", so the count is inconsistent)\[26\]\[27\] | Public data "updates hourly"\[27\] | Public table free; "Models Table Pro" paid (via The Memo)\[28\]\[29\] | Fast, broad model enumeration including obscure labs |
| 8 | **Hugging Face Trending Papers / Daily Papers + paperswithcode.co** | Papers linked to code; trending models and spaces | Daily | Free | Research and open-weights discovery. Papers with Code was sunset by Meta in July 2025; HF's Niels Rogge relaunched it as paperswithcode.co |\[30\]\[31\]
| 9 | **Latent Space (podcast + newsletter)** | Deep interviews with AI engineers and lab builders; AI-for-science coverage in 2026 | Weekly+ | Free (paid tier optional) | Understanding *why* things matter |\[32\]\[33\]
| 10 | **The Batch (DeepLearning.AI)** | Andrew Ng's letter plus curated news\[34\] | Weekly | Free | Calm weekly overview |
| 11 | **Import AI (Jack Clark)** | Research-heavy policy and safety commentary; crossed 100,000 subscribers, per Jack Clark on X (Jan 25, 2026) | ~Weekly | Free | Research trends and policy |
| 12 | **TLDR AI** | Headline digest; 1,100,000 subscribers per TLDR's own page | Weekdays | Free (ad-supported) | 5-minute skim |
| 13 | **The Rundown AI** | Consumer/business-oriented AI news; claims 2,000,000+ readers\[35\] | Daily | Free (paid "Rundown University")\[36\] | Non-technical and business angle |
| 14 | **Ben's Bites** | Builder-oriented AI news; now Tue + Thu\[37\]\[38\] | 2×/week | Free core | Product and startup launches |
| 15 | **AlphaSignal** | Technical digest for engineers; says it now runs an "autonomous editorial system… no human in the editorial loop"\[39\] | Daily or 3×/week (its own pages conflict)\[40\]\[41\] | Free | Repo and paper picks, but note the fully automated curation |
| 16 | **Hacker News** / **r/LocalLLaMA** | Community discussion; r/LocalLLaMA is the hub for open-weights and local inference | Real-time | Free | Early signal and skeptical comments; high noise |
| 17 | **GitHub Trending + awesome-lists** (e.g., best-of-Agent-Harnesses, which ranks 167 harnesses and is rescored weekly; awesome-ai-agents) | New repos by star velocity | Daily / weekly | Free | Catching the next OpenClaw-style breakout |\[42\]\[43\]
| 18 | **FirstMark MAD Landscape** (Matt Turck) | Market map; 2025 edition "Bubble & Build," about 1,150 logos\[44\] | ~Annual (no 2026 edition yet) | Free | Big-picture market segmentation |
| 19 | **LF AI & Data Landscape** (landscape2) | 65 open-source foundation projects\[45\] | Nightly member rebuild; PR-driven\[46\] | Free | Open-source governance view; ignore the stale 2022 CNCF-hosted version\[47\] |
| 20 | **There's An AI For That / Futurepedia** | Consumer tool directories (TAAFT: 53,817 tools, 1,707 models)\[11\] | Daily | Free to browse; sponsored listings | Finding a tool for a task; poor for judging importance |

**Timeline-specific sites worth bookmarking:**
- Official lab news pages (OpenAI News, Anthropic news, Google DeepMind blog, Meta AI blog) are the primary sources.\[48\]
- Secondary aggregators such as AI Release Tracker (aireleasetracker.com, an interactive timeline since ChatGPT), llm-stats.com (398+ releases), Evertune's AI Model Release Tracker, and per-lab timeline write-ups (hidekazu-konishi.com, the jqueryscript/anthropic-claude-timeline GitHub repo) are useful.\[49\]\[50\]\[51\]\[52\] They are unofficial, however, and sometimes disagree on dates, so verify against the lab's own post.

**Knowledge-graph / interactive views:**
- Epoch AI's interactive explorers and downloadable data.
- The LF AI & Data landscape (interactive grid).
- Arena's leaderboard history.
- AI Release Tracker's interactive timeline.

None of these is a true knowledge graph of *tools and relationships*. The relationship list in Part 2.4 is designed to fill that gap: load it into Neo4j, Obsidian or Kumu.

### 1.2 Recommended minimal stack

1. **Daily (10 min):** AINews *or* TLDR AI. Pick one, not both.
2. **When a model launches (5 min):** check Artificial Analysis (capability/price), Arena (preference) and OpenRouter (is anyone using it?). If all three move, it matters.
3. **Weekly (30 min):** Simon Willison's archive, plus The Batch *or* Import AI, plus a GitHub Trending glance.
4. **Monthly:** pull the Epoch AI CSV to update your personal timeline.
5. **Ignore by default:** the tool directories, X/Twitter hype threads, and any "top 10 AI tools" listicle. Many 2026 "best agent" rankings are published by vendors who rank themselves first.\[53\]

---

## Part 2 — Timeline and segmentation of hyped AI tools

### 2.0 Resolving your ambiguous names

| Your term | Most likely intended | Confidence | Alternatives (and why they're less likely) |
|---|---|---|---|
| **muse** | **Meta Muse**: personal AI agent launched Sep 8, 2026, built by Meta Superintelligence Labs on the **Muse Spark** model family, with **Muse Code** as a terminal coding agent | High, given it is the most hyped "Muse" in Sep 2026 (topped the App Store; centerpiece of Connect, Sep 23, 2026) | **Microsoft Muse** (Feb 2025 "World and Human Action Model" for game generation); **Google Muse** (Jan 2023 text-to-image research model). Both are real but not currently hyped |\[4\]\[5\]\[54\]\[55\]
| **NOOV** | **NVIDIA NOOA (NVIDIA Object-Oriented Agents)**: open-source, model-agnostic Python agent harness/framework released July 27, 2026 | **Low–medium**, a phonetic/typo match ("double-O agents") in the agent-framework context | **Noov.ai**: a French consumer "all models in one app" chat/companion app (ChatGPT, Claude, Gemini, DeepSeek). It is an exact spelling match but not a developer tool. **noovi.ai** is a restaurant voice agent (unrelated). If you saw "NOOV" in a developer thread, it's probably NOOA; in an app-store context, Noov.ai |\[7\]\[56\]\[57\]\[58\]
| **jev** | **Jev by TypeSafe AI**: a "System One" decision model that returns typed choices, scores and calibrated probabilities instead of text. TypeSafe came out of stealth Sep 15, 2026 with $40M seed | High | No serious alternative. Community add-ons (jev-gateway, typesafe-mcp, Claude Code plugin) explain why it shows up in coding-agent discussions |\[6\]\[59\]\[60\]
| **openclaw** | **OpenClaw** (formerly Warelay → CLAWDIS → Clawdbot → Moltbot) | Confirmed | — |\[3\]

### 2.1 Refining your framing ("Claude Code and OpenCode are harnesses; LangGraph and LangSmith are frameworks")

- **Claude Code, OpenCode = harnesses. ✔ Correct.** An agent harness is the code around the model that turns it into something that acts: the loop, the tools, the sandbox, memory and context rules.\[12\] Both are batteries-included *coding-agent harnesses* (products). Note that Claude Code is tied to Claude models, while OpenCode is model-agnostic (75+ providers, including local models via Ollama).\[61\]
- **LangGraph = framework ✔, more precisely a low-level orchestration framework plus a durable runtime** (stateful graphs, checkpointing, human-in-the-loop).\[62\]\[63\] You *build* agents with it; you don't *use* it as an agent.
- **LangSmith = ✘ not a framework.** It is a closed-source **observability, evaluation and deployment platform**, launched GA in February 2024 alongside a $25M Series A led by Sequoia.\[1\] It monitors LangChain/LangGraph apps and any other stack via OpenTelemetry-style tracing. It now also hosts deployment (the former LangGraph Platform) and a no-code agent builder. Put it in "LLMOps / observability."
- **LangChain** (which you mention) is the higher-level agent framework; since 1.0 (Oct 22, 2025) its `create_agent` runs on LangGraph's runtime.\[63\]\[64\]
- **Blurry edges to be aware of:**
  - The **Claude Agent SDK** and **OpenAI Agents SDK** are harness internals exposed as libraries, so they are half harness, half framework.
  - **OpenClaw** is described as both a personal agent and an "agent harness."\[3\]
  - **Microsoft Agent Framework** added "agent harness extensions" at Build 2026.\[65\]
  - A practical rule: *if you configure it, it's a harness; if you write code with it, it's a framework; if it watches and scores runs, it's observability.*
- **n8n** = workflow automation / low-code agent builder. **Ollama** = local inference runtime. **Jev** = a *model*, not a tool. **Muse** = consumer agent product plus model family.

### 2.2 Master chronological timeline (2022 → Sep 25, 2026)

Dates are announcement/launch dates. Items marked † come mainly from secondary trackers or a single source; treat them as provisional.

**2022**
- Jun 2022 — GitHub Copilot generally available (technical preview since Jun 2021).
- Oct 2022 — **LangChain** open-sourced by Harrison Chase.
- Nov 2022 — **LlamaIndex** (as GPT Index) launched.
- **Nov 30, 2022 — ChatGPT launched (GPT-3.5).** Wave 1 begins.
- Dec 2022 — There's An AI For That begins cataloguing tools.\[66\]

**2023**
- Jan 2023 — Google publishes **Muse** (text-to-image research model).
- Feb 2023 — Meta **LLaMA** (research release, weights leak); Chroma launches.
- Mar 2023 — **GPT-4** (Mar 14); **Claude** 1 and Claude Instant via API (Mar 14); **llama.cpp** (Mar 10).\[67\]
- Apr 2023 — **Chatbot Arena** launched (LMSYS, UC Berkeley); AutoGPT/BabyAGI agent hype.\[21\]
- May 2023 — LM Studio; Aider (approximate).
- Jun 2023 — **vLLM** / PagedAttention released; OpenAI **function calling** (Jun 13).
- **Jul 8, 2023 — Ollama first release**;\[2\] Llama 2 (open weights, commercial use); LangSmith beta.\[2\]
- Sep 2023 — Mistral 7B; Microsoft **AutoGen** (approx. Sep–Oct).
- Oct 2023 — Vercel **v0** preview.
- Nov 2023 — OpenAI DevDay (GPT-4 Turbo, Assistants API, GPTs); CrewAI emerges (approx.).
- Dec 2023 — **Gemini 1.0** (Dec 6); Mixtral 8x7B; Apple **MLX**; SGLang paper.

**2024**
- Jan 2024 — **LangGraph** released.
- Feb 2024 — **LangSmith GA** plus $25M Series A (Sequoia); OpenAI **Sora** preview; Gemini 1.5 (long context).\[1\]
- Mar 2024 — **Claude 3** family (Opus/Sonnet/Haiku); Cognition's **Devin** (Mar 12).
- Apr 2024 — **Llama 3**.
- May 2024 — **GPT-4o**.
- Jun 2024 — **Claude 3.5 Sonnet** plus Artifacts; Chatbot Arena adds images.\[21\]
- Jul 2024 — Llama 3.1 (405B open weights); Claude Dev (later **Cline**) VS Code agent (approx.).
- **Sep 12, 2024 — OpenAI o1-preview: the reasoning-model wave begins.**\[68\] Replit Agent launches; Chatbot Arena rebrands to LMArena.\[21\]
- Oct 2024 — Claude 3.5 Sonnet (new) plus **computer use**; **Bolt.new**.
- Nov 2024 — **Windsurf** editor (Codeium); **Lovable** (from GPT Engineer); **Nov 25 — Model Context Protocol (MCP)** open-sourced by Anthropic.\[69\]
- Dec 2024 — **DeepSeek-V3** (Dec 26); o3 previewed; PydanticAI released; Gemini 2.0.

**2025**
- **Jan 20, 2025 — DeepSeek-R1** (open-weights reasoning; market shock).
- Feb 2025 — **Feb 24: Claude 3.7 Sonnet plus Claude Code research preview**; **Microsoft Muse** (WHAM) game world model (Feb 19); Grok 3.\[70\]
- Mar 2025 — **Manus** general agent (Mar 6); **OpenAI Agents SDK** plus Responses API (Mar 11); Gemini 2.5 Pro; n8n €55M Series B.\[71\]
- Apr 2025 — **Google A2A protocol** and **Agent Development Kit (ADK)** (Apr 9); Llama 4 (Apr 5); **OpenAI Codex CLI** (Apr 16); Qwen3; OpenAI adopts MCP.\[72\]
- May 2025 — **Claude 4 (Opus 4, Sonnet 4) plus Claude Code GA (May 22)**; GitHub Copilot coding agent; Veo 3; LangGraph Platform GA (May 14); LMArena $100M raise.\[1\]\[73\]\[74\]
- Jun 2025 — **Gemini CLI** (Jun 25); Google donates **A2A to the Linux Foundation** (Jun 23); **OpenCode (SST/Anomaly) launched Jun 19** (the original Go project was renamed **Crush** by Charm).\[75\]\[76\]
- Jul 2025 — Grok 4; Kimi K2; Cognition acquires Windsurf (after Google hires its leadership); **Papers with Code sunset** (Jul 24–25), replaced by HF Trending Papers; Ollama desktop app (v0.10).\[77\]\[78\]\[79\]
- Aug 2025 — **GPT-5** (Aug 7); OpenAI **gpt-oss** open weights; **AGENTS.md** introduced by OpenAI and others; Genie 3 world model.
- Sep 2025 — Claude Sonnet 4.5 plus **Claude Agent SDK** (renamed from Claude Code SDK); Sora 2; **Ollama cloud models** (Sep 19);\[80\] Cognition raises $400M at $10.2B.\[81\]
- Oct 2025 — **LangChain 1.0 and LangGraph 1.0** (Oct 22) plus $125M Series B; **Claude Code on the web** plus sandboxing (Oct 20); **Agent Skills** (Anthropic); n8n $180M Series C at $2.5B (Oct 9);\[82\] Microsoft Agent Framework preview.\[64\]\[83\]
- Nov 2025 — **Gemini 3** and Google **Antigravity** agentic IDE; **Claude Opus 4.5** (Nov 24); **Nov 24: "Warelay," the ancestor of OpenClaw**, started by Peter Steinberger.\[3\]\[73\]
- Dec 2025 — **Dec 9: Agentic AI Foundation (AAIF)** formed under the Linux Foundation with MCP (Anthropic), goose (Block) and AGENTS.md (OpenAI); Agent Skills published as an open standard; **Meta acquires Manus** (over $2B, per The Wall Street Journal as cited by CNBC); Claude Code goes viral over the holidays.

**2026**
- Jan 2026 — Clawdbot goes viral; **Jan 27 renamed Moltbot** (Anthropic trademark concern); **Moltbook** agent social network (Jan 28); **Jan 30 renamed OpenClaw**; LMArena raises $150M at $1.7B and rebrands to **Arena**; Anthropic blocks OpenCode, Cline and Roo Code from Claude subscription OAuth (OpenCode gains 18,000 stars in two weeks); `ollama launch` runs Claude Code/Codex/OpenCode on local models.\[74\]\[76\]\[84\]\[85\]\[86\]\[87\]
- Feb 2026 — **Feb 14–15: Steinberger joins OpenAI**; OpenClaw moves to the OpenClaw Foundation (OpenAI supporting); Claude Opus 4.6 and Sonnet 4.6 (Feb 17); Gemini 3.1 Pro; GPT-5.3-Codex.\[3\]\[73\]\[88\]
- Mar 2026 — Qwen3.5†; Replit Agent 4†; Ollama MLX backend.
- Apr 2026 — **Microsoft Agent Framework 1.0 GA** (Apr 2; AutoGen and Semantic Kernel merged); Cursor "Glass" redesign (Apr 2)†; **Claude Mythos Preview** (Apr 7, restricted, Project Glasswing); **Meta Muse Spark** introduced (Apr 8); Claude Opus 4.7 and Claude Design (Apr 17); **GPT-5.5**† (Apr); Mistral Medium 3.5 (Apr 28)†.\[48\]\[65\]\[89\]\[90\]
- May 2026 — n8n valued at **$5.2B** via SAP strategic investment (May 12);\[91\]\[92\] Claude Opus 4.8 (May 28); Google I/O: **Antigravity CLI replaces Gemini CLI**† (Gemini CLI retired Jun 18); xAI **Grok Build** coding CLI (beta)†.\[73\]\[93\]
- Jun 2026 — **Claude Fable 5 and Mythos 5** (Jun 9; a new "Mythos-class" tier above Opus; briefly suspended Jun 12 under a US export-control directive, restored Jul 1)†; GPT-5.6 Sol/Terra/Luna limited preview (Jun 26)†.\[67\]\[94\]\[95\]
- Jul 2026 — Ollama $65M Series B (Jul 9; 8.9M monthly active developers); **Muse Spark 1.1** plus Meta Model API (Jul 9); **Claude Opus 5** (Jul 24)†; Kimi K3 open weights (Jul 26)†; **NVIDIA NOOA** plus Open Secure AI Alliance (Jul 27).\[54\]\[57\]\[95\]\[96\]\[97\]
- Aug 2026 — Qwen3.8-Max (Aug 3)†; **Muse Spark 1.2 plus Muse Code** terminal agent (Aug 5); Muse Glimmer open-weight model (Aug 10); Grok 4.6 (Aug 12)†; **DeepSeek agent harness** developer preview (Aug 13; ~95K stars in ~2 days)†; SpaceX completes acquisition of Cursor (Aug 14)†; **A2A joins AAIF** (Aug 17); Terminal-Bench 4.0 (Aug 28); **OpenClaw 2.0 (v2026.8.1)** (Aug 30).\[3\]\[12\]\[13\]\[54\]\[95\]\[98\]
- Sep 2026:
  - **Claude Fable 5.1** (Sep 1).\[95\]
  - **Gemini 3.8 Flash** and **Muse Spark 1.3** (Sep 2).\[53\]
  - **GPT-6 Astra** (Sep 3).\[48\]
  - **Meta Muse personal agent** (Sep 8).\[5\]
  - DeepSeek-V4.1-Flash (Sep 10)†.\[95\]
  - AAIF launches MCPA certification (Sep 14); LangSmith caps SaaS trace retention at 180 days (Sep 14).\[99\]\[100\]
  - **TypeSafe AI's Jev** (Sep 15).\[6\]
  - **Claude Opus 5.5 plus GPT-6 Sol/Luna** (Sep 22).\[20\]\[98\]
  - **Meta Connect: Muse voice mode, Charm device and glasses plans** (Sep 23).\[101\]\[102\]

### 2.3 Taxonomy / segmentation table

**A. Frontier & foundation model families**

| Family | Maker | First launch | Key milestones | Status Sep 2026 |
|---|---|---|---|---|
| GPT / o-series | OpenAI | GPT-3.5 in ChatGPT, Nov 2022 | GPT-4 (Mar 2023), GPT-4o (May 2024), o1 (Sep 2024), GPT-5 (Aug 2025), GPT-5.5 (Apr 2026), GPT-5.6 tiers (Jun–Jul 2026) | **GPT-6 Astra** (Sep 3), GPT-6 Sol/Luna (Sep 22) |\[48\]\[98\]
| Claude | Anthropic | Mar 14, 2023 | Claude 3 (Mar 2024), 3.5 Sonnet (Jun 2024), 3.7 (Feb 2025), 4 (May 2025), Opus 4.5 (Nov 2025), Mythos Preview (Apr 2026), Fable 5 (Jun 2026), Opus 5 (Jul 2026) | **Opus 5.5** (Sep 22; $4/$20 per 1M tokens), Fable 5.1 (Sep 1), Mythos 5.1 restricted |\[52\]\[67\]\[95\]
| Gemini | Google DeepMind | Dec 6, 2023 | 1.5 (Feb 2024), 2.0 (Dec 2024), 2.5 (Mar 2025), 3 (Nov 2025), 3.1 Pro (Feb 2026) | **Gemini 3.8 Flash** (Sep 2) |\[49\]
| Llama → Muse | Meta | LLaMA Feb 2023 | Llama 2 (Jul 2023), 3 (Apr 2024), 3.1 405B (Jul 2024), 4 (Apr 2025); pivot to Meta Superintelligence Labs | **Muse Spark 1.3** (Sep 2, closed weights); Muse Glimmer (open-weight, Aug 10) |\[54\]\[103\]
| DeepSeek | DeepSeek | 2023 | V3 (Dec 2024), **R1 (Jan 2025)**, V4 (2026) | V4.1-Flash (Sep 10)† |\[95\]
| Qwen | Alibaba | 2023 | Qwen2.5 (Sep 2024), Qwen3 (Apr 2025), Qwen3.5 (Mar 2026) | Qwen3.8-Max (Aug 3)† |\[95\]
| Mistral | Mistral AI | Mistral 7B, Sep 2023 | Mixtral (Dec 2023), Large 3 (Apache 2.0) | Medium 3.5 (Apr 2026)† |\[95\]
| Grok | xAI | Nov 2023 | Grok 3 (Feb 2025), 4 (Jul 2025) | Grok 4.6 (Aug 12)† |\[95\]
| Kimi / GLM / MiniMax | Moonshot / Z.ai / MiniMax | 2023–24 | Kimi K2 (Jul 2025) | Kimi K3 open weights (Jul 2026)†, GLM-5.x, MiniMax M3: the leading open-weight coding tier |\[94\]
| **Jev** (decision model) | TypeSafe AI | Sep 15, 2026 | jev-1.13; $0.042 per 1M input tokens, output free; ~100 ms typical | New category, "System One" decision model; on Vercel AI Gateway and OpenRouter |\[6\]\[60\]

**B. Coding agents / agent harnesses**

| Tool | Maker | Form | First launch | Key milestones | Relations |
|---|---|---|---|---|---|
| **Claude Code** | Anthropic | Terminal/IDE/web harness | Feb 24, 2025 (preview) | GA May 22, 2025; web Oct 20, 2025; subagents, Skills, Dynamic Workflows (May 2026); v2.1.280 defaults to Opus 5.5 | Built on Claude; uses MCP, Agent Skills, CLAUDE.md |\[83\]\[98\]\[104\]
| **OpenCode** | Anomaly (ex-SST) | Open-source terminal harness (MIT) | Jun 19, 2025 | ~650K MAU within 5 months; ~210K GitHub stars (Sep 2026) | Model-agnostic (models.dev catalog); competes with Claude Code; runs with Ollama |\[76\]\[105\]\[106\]
| Codex (CLI/app/cloud) | OpenAI | Harness | CLI Apr 16, 2025 | GPT-5.x-Codex models; leads Terminal-Bench 4.0 with GPT-6 Astra (58.2%) | Originated AGENTS.md; uses MCP |\[98\]
| Gemini CLI → **Antigravity** | Google | CLI plus agentic IDE | Gemini CLI Jun 25, 2025; Antigravity Nov 2025 | Antigravity CLI replaced Gemini CLI (I/O 2026)† | Built on Gemini |\[93\]
| **Muse Code** | Meta | Terminal harness | Aug 5, 2026 (beta) | Async background subagents | Built on Muse Spark |\[54\]\[93\]
| Grok Build | xAI | Terminal CLI | May 2026 beta†, open-sourced Jul 2026† | — | Built on Grok |\[93\]
| **Cursor** | Anysphere (reportedly acquired by SpaceX, Aug 2026†) | AI IDE (VS Code fork) plus CLI and cloud agents | 2023 | Agents Window (Apr 2026), Cursor CLI (Jan 2026) | Multi-model; competes with Windsurf, Copilot |\[93\]\[98\]\[107\]
| Windsurf | Codeium → Cognition | AI IDE | Nov 2024 | Acquired by Cognition Jul 2025 | Sibling of Devin |
| Devin | Cognition | Cloud autonomous engineer | Mar 12, 2024 | Cognition $10.2B valuation (Sep 2025) | Competes with Codex cloud and Copilot agent |\[81\]
| GitHub Copilot (agent) | GitHub/Microsoft | IDE plus cloud coding agent | Copilot 2021; coding agent May 2025 | OpenCode auth partnership (Jan 2026) | Multi-model |\[93\]
| Cline / Roo Code | Cline Bot / community | VS Code agent extensions | Mid-2024 | Blocked from Claude OAuth (Jan 2026) | Uses MCP |\[76\]
| Aider | Paul Gauthier (OSS) | Terminal pair programmer | 2023 | Git auto-commit, repo map | Model-agnostic |\[106\]
| Crush | Charm | TUI agent | 2025 (ex-OpenCode fork) | — | Sibling/rival of OpenCode |\[76\]

**C. Personal / general-purpose autonomous agents**

| Tool | Maker | Launch | Milestones | Notes |
|---|---|---|---|---|
| **OpenClaw** | Peter Steinberger → OpenClaw Foundation | Nov 24, 2025 (as Warelay) | Clawdbot → Moltbot (Jan 27, 2026) → OpenClaw (Jan 30); creator joins OpenAI (Feb 14); 2.0 (Aug 30, 2026); MIT, TypeScript/Swift | Local-first; chats via WhatsApp/Telegram/Slack etc.; ClawHub skills marketplace; multi-LLM; was built with Claude Code |\[3\]\[86\]\[108\]
| **Meta Muse** | Meta Superintelligence Labs | Sep 8, 2026 | Runs in a cloud "Muse Secure VM" with its own browser; free plus $20/$100 tiers; Connect voice mode, Charm device (Dec) | Powered by Muse Spark; Amazon moved to block it |\[5\]\[101\]\[109\]
| Manus | Monica/Butterfly Effect → Meta | Mar 6, 2025 | Acquired by Meta (over $2B per The Wall Street Journal, as cited by CNBC, Dec 2025) | General cloud agent pioneer |
| Moltbook | Matt Schlicht | Jan 28, 2026 | Reddit-style network for AI agents | Hype artifact of the OpenClaw wave |\[86\]
| Others | Claude Managed Agents / Claude Tag, Grok Bot, Hermes, OpenJarvis (Stanford), Google Labs "CC" | 2026 | — | Always-on agent products |\[42\]\[110\]

**D. Agent / LLM application frameworks**

| Framework | Maker | First launch | Milestones | Relations |
|---|---|---|---|---|
| **LangChain** | LangChain Inc. | Oct 2022 | 1.0 Oct 22, 2025 (middleware, `create_agent`); $125M Series B | Built on LangGraph runtime (since 1.0); traced by LangSmith |\[63\]\[64\]
| **LangGraph** | LangChain Inc. | Jan 2024 | Platform GA May 2025; 1.0 Oct 2025; 1.2.x in 2026 | Durable, stateful graph runtime |\[1\]\[111\]\[112\]
| LlamaIndex | LlamaIndex | Nov 2022 | Agent workflows | RAG-first; competes with LangChain |
| CrewAI | CrewAI | late 2023 | Role-based multi-agent | Competes with AutoGen/LangGraph |\[43\]
| AutoGen → **Microsoft Agent Framework** | Microsoft | AutoGen 2023 | MAF 1.0 GA Apr 2, 2026 (merges AutoGen and Semantic Kernel); harness extensions at Build 2026 | AG2 is the community fork of AutoGen |\[43\]\[65\]
| OpenAI Agents SDK | OpenAI | Mar 11, 2025 | Successor to Swarm | Uses Responses API, MCP |
| Claude Agent SDK | Anthropic | Sep 2025 (renamed from Claude Code SDK) | — | Claude Code's harness as a library |
| Google ADK | Google | Apr 9, 2025 | — | Native A2A |
| PydanticAI | Pydantic | Dec 2024 | — | Type-safe; integrates Logfire |
| DSPy | Stanford | 2023 | — | Programmatic prompt optimization |\[113\]
| Mastra, smolagents, Strands (AWS), Haystack | various | 2023–25 | — | TS / code-as-action / AWS alternatives |
| **NVIDIA NOOA** | NVIDIA Labs | Jul 27, 2026 | Apache 2.0; 82.2% SWE-bench Verified with GPT-5.5 (NVIDIA-reported) | Agent-as-Python-class; model-agnostic |\[57\]\[58\]\[114\]

**E. Observability / eval / LLMOps**

| Tool | Maker | Launch | Notes |
|---|---|---|---|
| **LangSmith** | LangChain | Beta Jul 2023; GA Feb 2024 | Tracing, evals, prompt hub, deployment, no-code agent builder; SaaS retention capped at 180 days from Sep 14, 2026 |\[1\]\[100\]
| Langfuse | Langfuse (OSS) | 2023 | Open-source alternative to LangSmith |
| W&B Weave | Weights & Biases (CoreWeave) | 2024 | LLM tracing/evals |
| Arize Phoenix | Arize | 2023 | OSS, OpenTelemetry/OpenInference |
| Braintrust | Braintrust | 2023 | Eval-first platform |
| Logfire, Helicone, Opik | Pydantic / Helicone / Comet | 2023–24 | — |

**F. Local runtimes & inference engines**

| Tool | Maker | Launch | Milestones |
|---|---|---|---|
| **Ollama** | Ollama (Jeffrey Morgan, Michael Chiang) | Jul 8, 2023\[2\] | Desktop app (Jul 2025); cloud models (Sep 19, 2025); `ollama launch` for coding agents (Jan 2026);\[77\]\[80\]\[85\] MLX backend (Mar 2026); $65M Series B (Jul 9, 2026), 8.9M monthly active developers |
| llama.cpp / GGML | Georgi Gerganov | Mar 10, 2023 | Engine under Ollama and LM Studio; GGUF format |
| LM Studio | Element Labs | 2023 | GUI; llama.cpp plus MLX backends |
| vLLM | UC Berkeley → community | Jun 2023 | PagedAttention; production serving |
| SGLang | LMSYS | Dec 2023 | High-throughput serving |
| MLX | Apple | Dec 2023 | Apple silicon array framework |

**G. Workflow automation / low-code agent builders**

| Tool | Maker | Launch | Milestones |
|---|---|---|---|
| **n8n** | n8n GmbH (Jan Oberhauser, Berlin) | Oct 2019\[71\] | Series B €55M (Mar 2025); Series C $180M at $2.5B (Oct 9, 2025); $5.2B valuation via SAP (May 12, 2026); 1.7M monthly active builders\[71\]\[82\]\[91\]\[115\] |
| Zapier (AI/Agents) | Zapier | 2011; AI agents 2024–25 | — |
| Make | Make (Celonis) | 2012 (as Integromat) | — |
| Dify | LangGenius | 2023 | OSS LLM app builder |
| Flowise | FlowiseAI | 2023 | LangChain-based visual builder |
| Langflow | DataStax (IBM) | 2023 | Visual builder |

**H. Protocols & standards**

| Standard | Origin | Launch | Governance |
|---|---|---|---|
| **MCP** | Anthropic | Nov 25, 2024 | Donated to AAIF (Linux Foundation) Dec 9, 2025; MCPA certification Sep 2026 |\[75\]\[99\]
| **A2A** | Google | Apr 9, 2025 | Linux Foundation Jun 2025 → AAIF Aug 17, 2026 |\[13\]\[72\]
| **AGENTS.md** | OpenAI (with Codex, others) | Aug 2025 | AAIF founding project |\[116\]\[117\]
| **Agent Skills** (SKILL.md) | Anthropic | Oct 2025; open standard Dec 2025 | Adopted beyond Claude (OpenClaw skills, TypeSafe skill) |\[118\]
| goose, agentgateway | Block / Solo.io | 2025 | AAIF projects |\[13\]
| AG-UI | CopilotKit | 2025 | Agent ↔ frontend protocol |\[43\]

**I. Vector databases & RAG infra:** Pinecone (managed, 2019/2021), Weaviate (OSS, 2019), Chroma (OSS, 2023), Qdrant (OSS/Rust, 2021), pgvector (Postgres extension, 2021), Milvus/Zilliz. This category is **mature and commoditizing**. Vector search is now a feature of Postgres, Elastic, MongoDB and cloud databases, and some 2026 tools (e.g., jevsearch) rank search results without embeddings at all.\[6\]

**J. Other hyped categories**
- **Vibe-coding app builders:** Lovable (Nov 2024), Bolt.new (Oct 2024), v0 (Oct 2023), Replit Agent (Sep 2024; Agent 4 Mar 2026†).
- **Video/image models:** Sora (Feb 2024) / Sora 2 (Sep 2025), Veo 3 (May 2025), Kling, Midjourney, Nano Banana, Muse Image (2026).
- **World models:** Microsoft Muse/WHAM (Feb 2025), Google Genie 3 (Aug 2025).

### 2.4 Relationships list (for a knowledge graph)

Format: `Source —[edge]→ Target`. Suggested node types are Model, Harness, PersonalAgent, Framework, Observability, Runtime, Workflow, Protocol, VectorDB, Org and Person.

**Made by / maintained by**
- Claude Code, Claude Agent SDK, MCP, Agent Skills, Claude models —[made by]→ Anthropic
- OpenCode, models.dev —[made by]→ Anomaly (ex-SST)\[105\]
- LangChain, LangGraph, LangSmith —[made by]→ LangChain Inc.
- Codex CLI, Agents SDK, AGENTS.md, GPT —[made by]→ OpenAI
- Gemini, Antigravity, Gemini CLI, ADK, A2A —[made by]→ Google
- Muse (agent), Muse Spark, Muse Code, Muse Glimmer, Llama —[made by]→ Meta Superintelligence Labs / Meta
- OpenClaw —[created by]→ Peter Steinberger; —[stewarded by]→ OpenClaw Foundation; OpenClaw Foundation —[supported by]→ OpenAI; Peter Steinberger —[works at]→ OpenAI\[3\]\[88\]
- Jev —[made by]→ TypeSafe AI
- NOOA —[made by]→ NVIDIA Labs
- n8n —[made by]→ n8n GmbH; SAP —[invested in]→ n8n\[92\]\[119\]
- Ollama —[made by]→ Ollama Inc.; llama.cpp —[made by]→ Georgi Gerganov
- Microsoft Agent Framework —[made by]→ Microsoft; —[merges]→ AutoGen, Semantic Kernel\[65\]
- Devin, Windsurf —[owned by]→ Cognition; Manus —[acquired by]→ Meta; Cursor —[acquired by]→ SpaceX†

**Built on / powered by**
- Claude Code —[built on]→ Claude models (Opus 5.5 default)\[98\]
- Claude Agent SDK —[exposes harness of]→ Claude Code
- LangChain 1.0 agents —[run on]→ LangGraph runtime
- Muse (agent), Muse Code —[powered by]→ Muse Spark\[4\]\[54\]
- Codex —[powered by]→ GPT-6 / GPT-5.x-Codex
- Antigravity —[powered by]→ Gemini 3.x
- Ollama, LM Studio —[built on]→ llama.cpp (Ollama and LM Studio also use MLX)
- Flowise —[built on]→ LangChain(.js)
- OpenClaw —[originally built with]→ Claude Code; OpenClaw —[can use]→ Claude, GPT, DeepSeek, local models\[3\]\[86\]
- Moltbook —[built by agents on]→ OpenClaw\[86\]

**Uses / implements protocol**
- Claude Code, Codex, OpenCode, Cursor, Cline, Gemini CLI/Antigravity, OpenClaw, n8n, LangChain, OpenAI Agents SDK, ChatGPT —[implements]→ MCP
- Google ADK, Microsoft Agent Framework, LangGraph —[implements]→ A2A
- Codex, Cursor, OpenCode, Copilot —[reads]→ AGENTS.md; Claude Code —[reads]→ CLAUDE.md
- Claude Code, OpenClaw (ClawHub skills), TypeSafe skill —[uses]→ Agent Skills
- MCP, A2A, AGENTS.md, goose, agentgateway —[governed by]→ Agentic AI Foundation —[part of]→ Linux Foundation\[13\]

**Integrates with**
- LangSmith —[monitors/evaluates]→ LangChain, LangGraph (and non-LangChain apps)
- LangSmith —[deploys]→ LangGraph agents
- Langfuse, Arize Phoenix, W&B Weave, Braintrust —[monitor]→ LangChain, LlamaIndex, OpenAI Agents SDK, CrewAI
- OpenCode, Claude Code, Codex —[can run local models via]→ Ollama (`ollama launch`)\[84\]
- Jev —[plugs into]→ Claude Code (plugin), Codex/OpenCode (jev-gateway), MCP (typesafe-mcp), Vercel AI SDK/Gateway, OpenRouter\[59\]\[60\]
- n8n —[calls]→ OpenAI, Anthropic, Ollama; n8n —[embedded in]→ SAP Joule Studio\[92\]
- NOOA —[deploys on]→ NVIDIA OpenShell; NOOA —[benchmarked against]→ OpenCode, PI\[58\]\[114\]
- LangChain, LlamaIndex —[integrate]→ Pinecone, Weaviate, Chroma, Qdrant, pgvector

**Competes with**
- Claude Code ⇄ Codex ⇄ OpenCode ⇄ Antigravity CLI ⇄ Muse Code ⇄ Grok Build ⇄ Aider ⇄ Crush
- Cursor ⇄ Windsurf ⇄ GitHub Copilot ⇄ Antigravity IDE
- OpenClaw ⇄ Meta Muse ⇄ Manus ⇄ Claude Managed Agents ⇄ Grok Bot
- LangGraph ⇄ CrewAI ⇄ Microsoft Agent Framework ⇄ OpenAI Agents SDK ⇄ Google ADK ⇄ PydanticAI ⇄ NOOA
- LangSmith ⇄ Langfuse ⇄ Braintrust ⇄ Arize Phoenix ⇄ W&B Weave
- Ollama ⇄ LM Studio; vLLM ⇄ SGLang
- n8n ⇄ Zapier ⇄ Make ⇄ Dify ⇄ Flowise ⇄ Langflow\[120\]\[121\]
- Jev ⇄ small LLMs with structured output / trained classifiers (different paradigm)
- GPT ⇄ Claude ⇄ Gemini ⇄ Muse Spark ⇄ Grok; DeepSeek ⇄ Qwen ⇄ Kimi ⇄ GLM (open weights)

**Renamed / successor of**
- Warelay → CLAWDIS → Clawdbot → Moltbot → OpenClaw\[3\]
- Chatbot Arena → LMArena → Arena\[21\]
- Claude Code SDK → Claude Agent SDK
- Gemini CLI → Antigravity CLI†\[93\]
- AutoGen + Semantic Kernel → Microsoft Agent Framework\[65\]
- LangGraph Platform → LangSmith Deployment
- Papers with Code → HF Trending Papers (and paperswithcode.co revival)\[30\]\[31\]
- Llama → Muse (Meta's flagship line)

---

## Part 3 — The hype waves, and what's substance vs. hype

| Wave | Period | Trigger | What was substantive | What was hype | Where it stands now |
|---|---|---|---|---|---|
| 1. Chat | Nov 2022–2023 | ChatGPT, GPT-4 | Mass adoption; the API economy | "Prompt engineer" as a job | Commodity interface |
| 2. RAG & chains | 2023 | LangChain, LlamaIndex, vector DBs | Grounding on private data | Standalone vector DB companies as a moat; over-abstracted chains | Vector search commoditized; LangChain rewrote itself (1.0) |
| 3. Agents v1 & tool calling | mid-2023–2024 | Function calling, AutoGPT, CrewAI, AutoGen, Devin | Function calling and structured output became the base primitive | AutoGPT-style fully autonomous agents, and the early Devin demos | Folded into frameworks; MAF merged AutoGen |
| 4. Reasoning models | Sep 2024–2025 | o1, DeepSeek-R1 | Real gains on math and code; cheap open reasoning | "AGI next year" claims | Standard feature (adaptive thinking in every frontier model) |
| 5. MCP & coding agents | Nov 2024–2025 | MCP, Claude Code, Codex CLI, Cursor | The clearest product-market fit in AI: coding agents with measurable revenue; a shared tool protocol | "Vibe coding replaces engineers"; thousands of low-quality MCP servers | Consolidating: protocols under AAIF; IDE M&A (Windsurf→Cognition, Cursor→SpaceX†) |
| 6. Personal always-on agents | Nov 2025–2026 | OpenClaw, Moltbook, Manus→Meta, Meta Muse | Agents that act across messaging, email and browser; big labs validated it by hiring and acquiring | Star counts as success metrics; the Moltbook "AI society" spectacle; security (full account access, prompt injection) is unsolved | Hottest consumer category; trust and platform blocking (Amazon vs. Muse) are the gating issue |\[109\]\[122\]
| 7. Harness engineering & decision models | mid-2026 → | "Harness matters more than the model," NOOA, DeepSeek harness, Jev | Evidence that the same model scores very differently in different harnesses; cheap calibrated decision calls | Vendor-reported benchmark multiples (e.g., TypeSafe's "193.6x faster, 444.6x cheaper," which it calls the high end) | Early; watch for independent replication |\[6\]\[42\]

**Consolidating:**
- Protocols (MCP, A2A, AGENTS.md all under AAIF).\[13\]
- Agent frameworks (Microsoft merged two; LangChain rebuilt on LangGraph; lab SDKs absorb simple use cases).
- AI IDEs (acquisitions).
- Observability (frameworks bundle their own; OpenTelemetry becoming common).
- Vector DBs (absorbed into general databases).

**Still fragmenting:**
- Coding harnesses: every lab now ships one (Anthropic, OpenAI, Google, Meta, xAI, DeepSeek).
- Personal agents.
- Open-weight models.

**Practical takeaway:** bet on the *layers*, not the brands.
- **Models change monthly.** Eleven frontier models shipped between February and July 2026 alone, per one tracker.\[123\]
- **Harnesses change quarterly.**
- **Protocols (MCP, Skills, AGENTS.md) are the stable investment.** Skills built on them survive when you swap Claude Code for OpenCode or Codex.

## Recommendations

1. **Tracking:** adopt the minimal stack in §1.2 for two weeks, then drop whatever you haven't opened.
2. **Knowledge graph:** use the nodes and edges in §2.4 as a seed. Refresh model nodes monthly from Epoch's CSV, and add tool nodes only when they appear in *two* of AINews, Simon Willison or OpenRouter/GitHub Trending.
3. **Hands-on learning order:**
   - Ollama plus one open model.
   - Claude Code *or* OpenCode (OpenCode if you want model freedom).
   - Write one MCP server and one Agent Skill.
   - LangGraph (not raw LangChain) for a custom agent, with Langfuse or LangSmith for tracing.
   - n8n for business automations.
   - Try Jev only for high-volume classification and routing.
4. **Treat personal agents cautiously:** OpenClaw and Muse get deep account access. Use sandboxed accounts and least-privilege connectors.

## Caveats

- **Date sources:**
  - Many 2026 model dates marked † come from secondary trackers (mungomash, jobsecuritymeter, morphllm, cleverhack, aireleasetracker) rather than lab announcements. Some trackers disagree (e.g., GPT-5.6 is dated to both a June 26 limited preview and a July launch).\[94\]\[124\]
  - The Cursor–SpaceX acquisition and the Gemini CLI → Antigravity CLI replacement each come from a single industry source; verify before relying on them.
- **Name resolution:** "NOOV" remains uncertain. NOOA is an inference from context, and Noov.ai is the literal match.
- **Vendor figures:** benchmark and cost numbers for Jev, NOOA, OpenClaw star counts and OpenCode user counts are vendor-reported or community-reported. OpenCode MAU figures vary widely by source (650K within five months vs. "6.5M+"/"7.5M" monthly developers). One outlet even misdates its launch to 2026 rather than June 2025.
- **Leaderboards:** Arena rankings are preference votes with overlapping confidence intervals. They were critiqued in "The Leaderboard Illusion" (Singh et al., Cohere Labs with Stanford, Princeton, AI2 and others; arXiv 2504.20879, NeurIPS 2025). The paper found "27 private LLM variants tested by Meta in the lead-up to the Llama-4 release" and that "undisclosed private testing practices benefit a handful of providers"; LMArena published a rebuttal. OpenRouter measures usage, not quality.\[24\]\[25\]
- **Fast change:** this landscape changes weekly. Anything here dated after August 2026 is likely to be superseded within a month.

## Sources

1. [LangChain](https://en.wikipedia.org/wiki/LangChain)
2. [Ollama](https://en.wikipedia.org/wiki/Ollama)
3. [OpenClaw](https://en.wikipedia.org/wiki/OpenClaw)
4. [Everything new coming to Meta's AI agent Muse | TechCrunch](https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/)
5. [Introducing Muse: The World’s First Personal AI Agent Built for Everyone](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)
6. [A deep dive into Jev, TypeSafe's System One model](https://flaviocopes.com/jev/)
7. [Noov.AI - Your AI assistants and AI companion in one app](https://noov.ai/en)
8. [NOOA (NVIDIA Object-Oriented Agents) | AI Wiki](https://aiwiki.ai/wiki/nooa)
9. [Data on AI Models | Epoch AI](https://epoch.ai/data/ai-models)
10. [Data on the Trajectory of AI | Epoch AI](https://epoch.ai/data)
11. [There's An AI For That® — The front page of AI](https://theresanaiforthat.com/)
12. [A Comparison of AI Agent Harnesses in 2026](https://winder.ai/ai-agent-harness-comparison/)
13. [A2A Joins MCP at the Agentic AI Foundation | Pebblous](https://blog.pebblous.ai/blog/a2a-mcp-agentic-ai-foundation-authorization/en/)
14. [AI Models Documentation – Overview | Epoch AI](https://epoch.ai/data/ai-models-documentation)
15. [LLM Leaderboard - Comparison of AI models from OpenAI, Anthropic, Google, SpaceXAI & others | Artificial Analysis](https://artificialanalysis.ai/leaderboards/models)
16. [Comparison of AI Models across Intelligence, Performance, and Price | Artificial Analysis](https://artificialanalysis.ai/models)
17. [API Reference | Artificial Analysis](https://artificialanalysis.ai/api-reference)
18. [AI Model Data API | Artificial Analysis](https://artificialanalysis.ai/data-api)
19. [not much happened today | AINews](https://news.smol.ai/issues/26-02-06-not-much/)
20. [Simon Willison’s Weblog](https://simonwillison.net/)
21. [LMArena - Learn AI - Miraheze](https://ai.miraheze.org/wiki/LMArena)
22. [LMArena Review 2026 — Is the Chatbot Arena Leaderboard Reliable?](https://www.toolcenter.ai/en/articles/lmarena-review-2026)
23. [LMArena AI: Chatbot Ranking Platform 2026](https://www.aboutchromebooks.com/lmarena-ai/)
24. [LLM Rankings | OpenRouter](https://openrouter.ai/rankings)
25. [OpenRouter Leaderboard & LLM Rankings, Explained · Directories by Enterprise DNA](https://enterprisedna.co/directories/models/openrouter-leaderboard/)
26. [Dr Alan D. Thompson – LifeArchitect.ai](https://lifearchitect.ai/)
27. [Models Table (1,000+ models and 40,000+ data points) — Dr Alan D. Thompson — LifeArchitect.ai](https://lifearchitect.ai/models-table/)
28. [The Memo by LifeArchitect.ai | Dr Alan D. Thompson | Substack](https://lifearchitect.substack.com/)
29. [The Memo - 10/May/2026 - by Dr Alan D. Thompson](https://lifearchitect.substack.com/p/the-memo-10may2026)
30. [Papers With Code Alternative: SOTA Leaderboards and Archived Data | CodeSOTA | CodeSOTA](https://www.codesota.com/papers-with-code)
31. [Relaunching PapersWithCode with new features](https://huggingface.co/blog/nielsr/paperswithcode-launch)
32. [swyx: Bio, Work & Ideas | AI Engineer](https://ai.engineer/speakers/swyx)
33. [Scaling without Slop - by swyx (Shawn) - Latent.Space](https://www.latent.space/p/2026)
34. [About | The Batch | DeepLearning.AI](https://www.deeplearning.ai/the-batch/about)
35. [The Rundown AI - Daily AI News & Insights in 5 Minutes a Day](https://www.therundown.ai/)
36. [Is The Rundown AI Newsletter Free in 2026? Pricing Explained | Blog | Readless](https://www.readless.app/blog/is-the-rundown-ai-newsletter-free-2026)
37. [A great time to be a builder - Ben's Bites](https://www.bensbites.com/p/a-great-time-to-be-a-builder)
38. [Ben's Bites Pricing, Reviews, Alternatives - AI News](https://aitools.fyi/ben-s-bites)
39. [About AlphaSignal | AI & ML News for Engineers](https://alphasignal.ai/about)
40. [Daily AI Newsletter for Engineers](https://alphasignal.ai/newsletter)
41. [alphasignalai.substack.com](https://alphasignalai.substack.com/about)
42. [Release Mid-September 2026: the harness-matters-more catalog, QM, Prime Agent, OpenJarvis · RyanAlberts/best-of-Agent-Harnesses](https://github.com/RyanAlberts/best-of-Agent-Harnesses/releases/tag/list-2026-09-2)
43. [GitHub - aloth/awesome-ai-agents: A curated list of AI agent frameworks, tools, platforms, research papers, and resources · GitHub](https://github.com/aloth/awesome-ai-agents)
44. [Bubble and Build: The 2025 MAD Landscape - FirstMark](https://firstmark.com/story/bubble-build-the-2025-mad-machine-learning-ai-data-landscape/)
45. [Projects - LF AI & Data Landscape](https://lfai.landscape2.io/stats)
46. [GitHub - lfai/lfai-landscape: 🌄 Open Source AI & Data Landscape - provides overview of top tier projects in the open source AI and Data ecosystem, shows projects through GitHub data, funding or market cap, first and last commits, contributor count and much other information.](https://github.com/lfai/lfai-landscape)
47. [LF AI & Data Landscape](https://landscapeapp.cncf.io/lfai/)
48. [OpenAI GPT Model Release Timeline - Model Lineage, ChatGPT and Codex Milestones, and Platform Availability | hidekazu-konishi.com](https://hidekazu-konishi.com/entry/openai_gpt_model_release_timeline.html)
49. [AI Model Release Tracker | Evertune](https://www.evertune.ai/resources/ai-model-tracker)
50. [AI Updates Today (September 2026) – Latest AI Model Releases](https://llm-stats.com/llm-updates)
51. [AI Release Tracker — AI Model Release Timeline](https://aireleasetracker.com/)
52. [GitHub - jqueryscript/anthropic-claude-timeline: A public timeline of major Anthropic Claude model releases, product updates, and developer platform milestones. · GitHub](https://github.com/jqueryscript/anthropic-claude-timeline)
53. [Best AI Agent Harnesses: September 2026 Rankings Across the Full Agent Stack | CellCog](https://cellcog.ai/blog/best-ai-agent-harnesses/)
54. [Muse Spark - Wikipedia](https://en.wikipedia.org/wiki/Muse_Spark)
55. [Meta is banking its future on its Muse AI agent — and winning user trust](https://finance.yahoo.com/technology/article/meta-is-banking-its-future-on-its-muse-ai-agent--and-winning-user-trust-182927585.html)
56. [noovi | Ai for Restaurants](https://www.noovi.ai/)
57. [NVIDIA NOOA Explained: Python AI Agents (2026) — CodeOxi](https://codeoxi.com/blog/nvidia-nooa-python-agents)
58. [NVIDIA AI Releases NOOA: An Object-Oriented Python Framework That Turns an AI Agent Into a Single Python Class - MarkTechPost](https://www.marktechpost.com/2026/08/07/nvidia-ai-releases-nooa-an-object-oriented-python-framework/)
59. [GitHub - vinilana/jev-gateway: An easy way to use jev with your coding agent for tool calling reasoning · GitHub](https://github.com/vinilana/jev-gateway)
60. [What Is Jev? Inside TypeSafe's Decision-Only AI Model and Its Developer Use Cases](https://www.firecrawl.dev/blog/what-is-jev)
61. [OpenCode Terminal AI Coding Agent 160K Stars | TechPillow](https://www.techpillow.co/blog/opencode-terminal-open-source-ai-coding-agent)
62. [We launched 1.0 versions of LangChain and LangGraph! - Announcements - LangChain Forum](https://forum.langchain.com/t/we-launched-1-0-versions-of-langchain-and-langgraph/1904)
63. [LangChain and LangGraph Agent Frameworks Reach v1.0 Milestones](https://www.langchain.com/blog/langchain-langgraph-1dot0)
64. [LangChain 1.0 vs LangGraph 1.0: Which One to Use in 2026](https://www.clickittech.com/ai/langchain-1-0-vs-langgraph-1-0/)
65. [Microsoft Agent Framework at BUILD 2026: Agent Harness, Hosted Agents, CodeAct, and more | Microsoft Agent Framework](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-at-build-2026-announce/)
66. [How Many AI Tools Are There? (2026)](https://thebestvpn.com/statistics/how-many-ai-tools-are-there/)
67. [Anthropic Claude Model Release Timeline - Model Family Tree, Capability Evolution, and Platform Availability | hidekazu-konishi.com](https://hidekazu-konishi.com/entry/anthropic_claude_model_release_timeline.html)
68. [OpenAI o1](https://en.wikipedia.org/wiki/OpenAI_o1)
69. [Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF), Anchored by New Project Contributions Including Model Context Protocol (MCP), goose and AGENTS.md](https://www.prnewswire.com/news-releases/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation-aaif-anchored-by-new-project-contributions-including-model-context-protocol-mcp-goose-and-agentsmd-302636897.html)
70. [Claude Timeline: Model Release Dates and Version History](https://www.scriptbyai.com/anthropic-claude-timeline/)
71. [N8n](https://en.wikipedia.org/wiki/N8n)
72. [Agent2Agent](https://en.wikipedia.org/wiki/Agent2Agent)
73. [Claude Version History (2023–2026): Complete Timeline](https://techiefied.com/claude-version-history/)
74. [Netizens Vote for AI King: LMArena Becomes \$1.7 Billion Unicorn Overnight](https://eu.36kr.com/en/p/3629043313214727)
75. [What the Linux Foundation and AAIF Mean for MCP and Agentic AI | Blck Alpaca](https://blckalpaca.at/en/knowledge-base/ai-agents/a2a-protocol-basics/linux-foundation-aaif-bedeutung)
76. [OpenCode - Learn AI - Miraheze](https://ai.miraheze.org/wiki/OpenCode)
77. [Intro to Ollama App v0.10.0 with Native GUI](https://www.databasemart.com/blog/intro-to-ollama-app-v0100)
78. [ollama on X: "Ollama's new app is here for macOS and Windows! Ollama 0.10! 🧵 https://t.co/9J8QfvARKr" / X](https://x.com/ollama/status/1950670503376761133)
79. [Paper With Code Shuts Down, Open-Source Community Calls for a New All-in-One Resource Hub | News | HyperAI](https://hyper.ai/en/news/42900)
80. [Cloud models · Ollama Blog](https://ollama.com/blog/cloud-models)
81. [Cognition's \$10b Series C; Smol AI updates | AINews](https://news.smol.ai/issues/25-09-08-cog-smol/)
82. [n8n raises \$180m to get AI closer to value with orchestration – n8n Blog](https://blog.n8n.io/series-c/)
83. [Claude (language model)](<https://en.wikipedia.org/wiki/Claude_(language_model)>)
84. [ollama launch · Ollama Blog](https://ollama.com/blog/launch)
85. [AlternativeTo LogoAlternativeTo Logo Text](https://alternativeto.net/software/ollama/news)
86. [From Agent-Only Social Networks to Autonomous Scientific Research: Lessons from OpenClaw and Moltbook, and the Architecture of ClawdLab and Beach.Science](https://arxiv.org/pdf/2602.19810)
87. [LMArena](https://en.wikipedia.org/wiki/LMArena)
88. [OpenClaw creator Peter Steinberger joins OpenAI | TechCrunch](https://techcrunch.com/2026/02/15/openclaw-creator-peter-steinberger-joins-openai/)
89. [Claude Mythos](https://en.wikipedia.org/wiki/Claude_Mythos)
90. [Claude Updates & Timeline - AutoGPT](https://autogpt.net/claude-updates-timeline/)
91. [N8n - 2026 Funding Rounds & List of Investors - Tracxn](https://tracxn.com/d/companies/n8n/__J5xwUZ9C29t7Du-yVvv0S99EWc7s69t2NGt5YmhQG0A/funding-and-investors)
92. [SAP Invests in AI Startup N8n, Doubling Valuation to \$5.2 Billion - Bloomberg](https://www.bloomberg.com/news/articles/2026-05-12/sap-invests-in-ai-automation-startup-n8n-at-5-2-billion-value)
93. [AI Coding Landscape 2026 - AI Models, Agents, Tooling, Benchmarks - cleverhack dot com](https://cleverhack.com/ai-coding-landscape)
94. [Best AI for Coding September 2026: Top 10 Coding Models Ranked](https://www.buildmvpfast.com/articles/best-llms-2026-guide/coding-ai)
95. [The frontier AI models, right now — Claude, GPT, Gemini, Grok, Llama](https://mungomash.com/ai/models/)
96. [Ollama Raises \$65M Series B Funding to Grow its Open-source AI Platform](https://www.businesswire.com/news/home/20260709429551/en/Ollama-Raises-$65M-Series-B-Funding-to-Grow-its-Open-source-AI-Platform)
97. [LMArena Leaderboard (Now Arena): Who's #1 on Chatbot Arena Right Now](https://localaimaster.com/blog/lmarena-chatbot-arena-leaderboard)
98. [Best AI Coding Agents (September 2026): Scored Leaderboard and Coding Agent Benchmark](https://www.morphllm.com/best-ai-coding-agents-2026)
99. [Agentic AI Foundation Launches MCPA Certification to Validate MCP Expertise](https://www.linuxfoundation.org/press/agentic-ai-foundation-launches-mcpa-certification-to-validate-mcp-expertise)
100. [LangSmith Cloud changelog - Docs by LangChain](https://changelog.langchain.com/announcements/langgraph-1-0-is-now-generally-available)
101. [Meta puts Muse at the center of Connect with Charm and AI glasses | The Rundown AI](https://www.therundown.ai/news/meta-muse-connect-2026-charm-ai-glasses)
102. [Everything We Announced at Meta Connect 2026 | Meta](https://www.meta.com/blog/meta-connect-2026-everything-we-announced/)
103. [Muse Spark 1.3 Explained: Meta's Agentic Model Guide (2026)](https://www.layer3labs.io/guides/muse-spark-1-3-explained)
104. [Claude Code Timeline: Release Date and Major Updates (2026)](https://www.scriptbyai.com/claude-code-timeline/)
105. [Anomaly · GitHub](https://github.com/anomalyco)
106. [anomalyco/opencode: the open-source terminal coding agent, and where it fits · GhTrends.dev](https://ghtrends.dev/anomalyco/opencode/)
107. [AI Coding Agents in 2026: A Practical Roadmap from Autocomplete to Cloud Teammates | CodePick](https://codepick.dev/en/guides/ai-coding-agents-2026-roadmap/)
108. [OpenClaw ClawdBot | Complete History, Features & Rebrand Timeline](https://openclawclawdbot.com/)
109. [Meta Connect 2026: Muse Opens a New Battle for Brand Discovery](https://news.designrush.com/meta-connect-2026-muse-ai-agent-brand-advertising-warning)
110. [AI Agents News — Week of September 25, 2026 (Daily Updates)](https://aiagentstore.ai/ai-agent-news/this-week)
111. [LangSmith and LangGraph in 2026: How LangChain’s Agent Stack Quietly Became the Default | by SC | May, 2026 | Medium](https://medium.com/@sehaj23chawla/langsmith-and-langgraph-in-2026-how-langchains-agent-stack-quietly-became-the-default-f1609af5d658)
112. [Releases · langchain-ai/langgraph](https://github.com/langchain-ai/langgraph/releases)
113. [GitHub - ARUNAGIRINATHAN-K/awesome-ai-agents-2026: ✨ Awesome AI Agents for 2026](https://github.com/ARUNAGIRINATHAN-K/awesome-ai-agents-2026/)
114. [Six Agent Harness Capabilities for Higher Model Performance | NVIDIA Technical Blog](https://developer.nvidia.com/blog/six-agent-harness-capabilities-for-higher-model-performance/)
115. [n8n Valuation Doubles To \$5.2 Billion As SAP Makes Strategic Investment And Embeds Platform Into Joule Studio](https://pulse2.com/n8n-valuation-doubles-to-5-2-billion-as-sap-makes-strategic-investment-and-embeds-platform-into-joule-studio/)
116. [Linux Foundation Announces the Formation of the Agentic AI Foundation (AAIF), Anchored by New Project Contributions Including Model Context Protocol (MCP), goose and AGENTS.md](https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation)
117. [OpenAI co-founds the Agentic AI Foundation under the Linux Foundation | OpenAI](https://openai.com/index/agentic-ai-foundation/)
118. [Model Context Protocol](https://en.wikipedia.org/wiki/Model_Context_Protocol)
119. [N8n - 2026 Company Profile, Team, Funding, Competitors & Financials - Tracxn](https://tracxn.com/d/companies/n8n/__J5xwUZ9C29t7Du-yVvv0S99EWc7s69t2NGt5YmhQG0A)
120. [n8n Funding & Valuation — Series C at \$2.5B | Automation Atlas](https://automationatlas.io/answers/n8n-series-c-valuation-2025/)
121. [SAP invests in AI automation startup N8n at \$5.2 billion value](https://www.msn.com/en-us/money/other/sap-invests-in-ai-automation-startup-n8n-at-5-2-billion-value/ar-AA230pmr)
122. [OpenAI Hires OpenClaw Creator Peter Steinberger And Sets Up Foundation](https://www.forbes.com/sites/ronschmelzer/2026/02/16/openai-hires-openclaw-creator-peter-steinberger-and-sets-up-foundation/)
123. [Frontier AI Models 2026: Every Release, Month by Month | Job Security Meter](https://jobsecuritymeter.com/guides/frontier-ai-models-2026)
124. [AI Model Releases Timeline: Latest Launches, Updated Daily — PromptZone - AI Prompts, Guides and Tools for Builders](https://www.promptzone.com/ai-model-releases)
