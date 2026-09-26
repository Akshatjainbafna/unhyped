# PRD — Unhyped: the real history of AI

Status: ready-for-agent · Owner: Akshat · Date: 2026-09-26
Research inputs: `research_notes/Unhyped AI history dataset/` (6 notes files) and the synthesized report in `reports/`.

---

## Problem Statement

Developers, PMs and founders are surrounded by AI noise. Every week, a launch is framed as "X killed Y": Claude Code killed developers, Cowork killed SaaS, long context killed RAG, and so on. Three problems follow:

- **No one place to read it as a whole.** No single source tells the whole story, from the first ideas about mechanical reasoning through the symbolic era, the AI winters and deep learning, to today's agents. Nothing separates what each technology *demonstrably* did from what people *claimed* it would do.
- **Tools are hard to place.** It is hard to know where a given tool fits: which segment, which layer of the AI stack, what it replaced, what it competes with, and who built it.
- **People can't measure what they know.** They have no honest way to gauge their own AI literacy, including whether they know how to use the tools, how to build with them, and whether they are keeping up with what shipped last month. Existing quizzes are shallow multiple-choice trivia that don't test prompting, building or judgement.

Existing trackers (Epoch AI, Artificial Analysis, tool directories, newsletters) are either raw databases or daily firehoses. None of them tells the story as a narrative with a clear editorial stance, and none makes hype checkable.

## Solution

**Unhyped** is an immersive, cinematic web experience that tells the real history of AI as a **road you travel backwards in time**.

- **Arrival.** Visitors land on **"Today · Sep 2026"**, on a tilted 2.5D highway viewed as if looking down the road from behind the wheel.
- **Scrolling up** leads into the **future**: the road forks into three labelled scenario roads (steady progress, plateau, fast takeoff), each with sourced forecasters, fading into fog.
- **Scrolling down** travels **back in time** through nine capability eras. The world around the road changes smoothly and cinematically:
  - a volumetric multimodal cityscape
  - an interconnected agent graph
  - dense glowing text fields
  - a waking neural lattice
  - wireframe
  - green CRT and frost for the AI winters
  - punch cards and vacuum-tube glow
  - finally, a dirt footpath ending at a **campfire**: *"This is where it started."*
- **The road is the knowledge structure.**
  - Each segment is a lane that merges into and branches from the main highway.
  - Entries are nodes on the road: papers, models, products, open-source repos, people, organizations and events.
  - Major updates, such as Claude → Cowork, are notches on their parent's line.
  - Abandoned paths are dead ends.
  - AI winters are frozen stretches.
  - Hyped claims stand at the roadside as **Claim vs. Reality signposts**: named people, verbatim quotes, sources and what actually happened. "Still alive" follow-ups report the fate of things declared dead, with numbers.
- **Hovering a node** opens a knowledge-graph card: similar tools, segment, position in a 9-layer AI stack diagram, a sober description, creators, sources and edges.
- **Segment filter.** A "Map of AI" section and a sticky filter bar let users select a segment. That lane lights up across all of history and everything else dims.
- **Quiz.** A **Quiz** button in the top navbar opens a **liquid-glass modal** with two tracks, **AI User** and **AI Builder**. A third track, **AI Researcher**, is shown as disabled with "Coming soon". The quiz is adaptive and runs 8–12 minutes. It mixes MCQ, tricky questions, prompt-writing, build-from-scratch tasks and LLM-generated cross-questions, all graded by an open-weight LLM with rubric anchors. It ends with a percentage, a level, a radar chart across dimensions, and a shareable score card.
- **Staying current.** A weekly pipeline and an admin **ingestion API** accept pasted article URLs or text about new developments and future advancements. They draft candidate entries and open a pull request for human review. Nothing is published without review.

## User Stories

### Arrival, navigation and orientation
1. As a first-time visitor, I want to land on "Today" rather than on ancient history, so that the first thing I see is relevant to me.
2. As a visitor, I want a one-line framing of the thesis on arrival, so that I immediately understand this is a hype-free history.
3. As a visitor, I want a clear hint that scrolling down goes back in time and scrolling up goes to the future, so that I understand the direction of travel.
4. As a visitor, I want a persistent top navbar with the Unhyped wordmark, the Quiz button, the Map of AI link and an About/Method link, so that I can reach the main areas from anywhere.
5. As a visitor, I want an era minimap (a vertical rail) showing the nine eras and my current position, so that I always know when and where I am.
6. As a visitor, I want to click an era on the minimap to travel there smoothly, so that I can jump without scrolling through decades.
7. As a visitor, I want a date readout that updates as I travel, so that I can connect what I'm seeing to real time.
8. As a keyboard user, I want arrow and Page keys to move along the road and Tab to move through nodes in order, so that I can use the site without a mouse.
9. As a returning visitor, I want deep links to a specific entry or era (v1.1), so that I can share exactly what I'm looking at.

### The road and the cinematic journey
10. As a visitor, I want the road viewed in a tilted 2.5D perspective looking down its length, so that it feels like travelling rather than reading a map.
11. As a visitor, I want the environment around the road to blend continuously between eras as I scroll, so that the change in capability feels cinematic rather than like slides.
12. As a visitor, I want the road surface itself to change with era, from glowing fibre to asphalt to dirt track to footpath, so that the material reflects the capability of the time.
13. As a visitor, I want about five hero moments where the camera breaks from the tilt, so that pivotal turning points feel momentous. Candidates: the AGI fork, ChatGPT, the Transformer, AlexNet, the AI winter freeze, Dartmouth.
14. As a visitor, I want the AI winters shown as frozen, frosted stretches with stalled traffic, so that I viscerally understand funding and progress collapses.
15. As a visitor, I want abandoned approaches (Lisp machines, the Fifth Generation project, the Humane Pin) shown as dead-end roads, so that I see that progress was not a straight line.
16. As a visitor, I want segment lanes to visibly merge into the highway around the Transformer era and branch off afterwards, so that I understand convergence and divergence in the field.
17. As a visitor, I want the journey to end at a campfire with the line "This is where it started" and an invitation to take the quiz, so that the story has a satisfying close.
18. As a visitor, I want the future above "Today" to fork into three labelled scenario roads, each fading into fog and each with named forecasters and their verbatim, sourced predictions, so that I see the future as uncertain and contested rather than as a single AGI date.
19. As a visitor, I want each forecast to show its target date and whether it has come true, not yet, or been missed (for example "as early as 2026" claims now due), so that I can check the receipts.
20. As a visitor who prefers reduced motion, I want camera motion replaced by crossfades between static era stills, so that I can use the site comfortably.
21. As a mobile visitor, I want a single winding lane with fewer branches, a lighter shader, fewer particles, and hero moments as short loops, so that the experience is smooth on my phone.
22. As a visitor on a low-power device, I want the site to detect poor performance and step down quality automatically, so that scrolling stays smooth.

### Nodes and entries
23. As a visitor, I want nodes on the road whose shape and icon show their type (paper, model, product, open-source repo, major update, person, organization, event), so that I can scan what kind of thing each is.
24. As a visitor, I want major updates shown as notches on their parent product's line rather than as separate nodes, so that I see how a product evolved without clutter (for example Claude → Artifacts → computer use → Claude Code → Cowork).
25. As a visitor, I want clicking a node to open a detail panel with the full description, capability note, creators, date, sources and edges, so that I can dig in.
26. As a visitor, I want each entry's description to be sober and free of marketing adjectives, so that I can trust it.
27. As a visitor, I want every entry to cite at least one source with a date, so that I can verify it myself.
28. As a visitor, I want open-source entries to show licence, GitHub link and star count with the date it was checked, so that I can judge traction. Stars are shown with a note that they are not proof of use.
29. As a visitor, I want people to appear through the work they built, with a short professional card (roles, key contributions, one sourced quote), so that I learn who built what without it becoming gossip.

### Knowledge graph hover card
30. As a visitor, I want hovering a node to show a compact knowledge-graph card within 100 ms, so that exploring feels instant.
31. As a visitor, I want the card to show the node's immediate neighbours (built-on, successor-of, competes-with, created-by, uses, inspired-by, acquired-by), so that I see how it relates to the rest of AI.
32. As a visitor, I want the card to list similar tools in the same segment and layer, so that I can discover alternatives.
33. As a visitor, I want the card to show a 9-layer AI stack diagram with this entry's layer highlighted, so that I understand where it sits in the infrastructure. Layers: Compute & Hardware, Data, Algorithms & Research, Models, Inference & Runtime, Frameworks & SDKs, Protocols, Harnesses & Agents, Apps & Products, plus an Ops/Eval/Safety side rail.
34. As a visitor, I want the card to show the primary segment and any secondary segments as chips, so that I understand the categorisation.
35. As a visitor, I want to click a neighbour in the card to travel to it on the road, so that I can follow lineage across time.
36. As a touch user, I want a tap to open the card and a second tap to open the detail panel, so that hover interactions work on mobile.

### Segments and filtering
37. As a visitor, I want a "Map of AI" section, placed right after arrival and also reachable from the navbar, showing all 18+ segments as chips in four groups (Foundations, Capabilities, The modern stack, Cross-cutting), so that I understand how the field is divided.
38. As a visitor, I want selecting a segment to keep matching entries at full opacity and dim all others to about 20%, so that I can follow one thread through history.
39. As a visitor, I want the selected segment's lane to light up along the whole road and its active eras to light up on the minimap, so that I see when that segment was alive.
40. As a visitor, I want the filter to match an entry's primary or secondary segments, so that cross-cutting entries are not hidden.
41. As a visitor, I want a sticky, collapsible filter bar that follows me along the road, so that I can change or clear the filter without scrolling back.
42. As a visitor, I want to select multiple segments at once, so that I can compare, for example, Coding Agents with Agent Frameworks.
43. As a visitor, I want the filter state kept in the URL, so that I can share a filtered view.

### Claim vs. Reality and "Still alive"
44. As a visitor, I want hyped claims shown as roadside signposts carrying a named speaker, a verbatim quote, the date and a source link, so that I see who said what, exactly.
45. As a visitor, I want each claim paired with a "Reality" panel (1–3 sentences with numbers and sources) and a status stamp (came true, partially, not yet, wrong, too early to tell), so that I can judge the claim fairly.
46. As a visitor, I want claims that came true shown as prominently as those that failed, so that the site is credible rather than cynical.
47. As a visitor, I want things that were declared dead (Stack Overflow, RAG, LangChain, SaaS, radiologists and others) to carry a "Still alive" or "Actually declined" follow-up with data, so that I learn what really happened.
48. As a visitor, I want sentiments with no named speaker (for example "RAG is dead") labelled as community sentiment rather than attributed quotes, so that nobody is misquoted.
49. As a visitor, I want to filter the road to show only Claim vs. Reality signposts, so that I can take a hype-only tour.

### Quiz: entry and modal
50. As a visitor, I want a Quiz button in the top navbar, so that I can start the quiz at any point in the journey.
51. As a visitor, I want the quiz to open in a translucent liquid-glass modal over the moving road, so that I stay inside the experience.
52. As a quiz taker, I want to choose between two tracks, **AI User** and **AI Builder**, with a toggle I can change before starting, so that the quiz matches how I work with AI.
53. As a quiz taker, I want to see an **AI Researcher** track that is disabled and marked "Coming soon", so that I know it is planned.
54. As a quiz taker, I want to see before I start that the quiz takes 8–12 minutes and what kinds of questions it contains, so that I know what I'm committing to.
55. As a quiz taker, I want to close the modal and resume later in the same browser session, so that I don't lose progress if I'm interrupted.
56. As a keyboard or screen-reader user, I want the modal to trap focus, have labelled controls and close with Escape, so that it is accessible.

### Quiz: questions and adaptivity
57. As a quiz taker, I want MCQ and tricky questions on Concepts (what models are and what they can't do), so that my conceptual understanding is tested.
58. As a quiz taker, I want Lineage & Stack questions (for example "which layer is this?", "drag this onto the timeline"), so that my understanding of the landscape is tested.
59. As a quiz taker, I want Awareness questions about what shipped in the last ~90 days, including "which of these is real?" with decoy tools, so that I learn whether I'm keeping up.
60. As a quiz taker, I want to write a prompt for a given task and have it graded against a rubric, so that my prompting skill is measured.
61. As a quiz taker, I want to be asked which tools I use and how, then get an adaptive cross-question that probes real proficiency (for example "you use LangGraph; how would you add human-in-the-loop?"), so that I can't just claim expertise.
62. As a quiz taker, I want Hype-calibration questions built from real Claim vs. Reality pairs, so that my ability to spot overclaims is tested.
63. As a Builder-track taker, I want a build-from-scratch task and a "debug this agent" scenario covering architecture, evals, RAG vs. fine-tuning and harness design, so that my building skill is tested.
64. As a quiz taker, I want questions to get harder after correct answers and easier after misses, so that the quiz fits my level in 12–15 questions.
65. As a quiz taker, I want clear feedback after the quiz on what I got wrong, with a link to the relevant timeline entry, so that I can learn.
66. As a quiz taker, I want free-text answers graded consistently, so that my score is fair and repeatable.

### Quiz: results and sharing
67. As a quiz taker, I want a headline percentage and a named level (Curious → Practitioner → Power User → Architect), so that I understand where I stand.
68. As a quiz taker, I want a radar chart of my score on each dimension, so that I see my strengths and gaps.
69. As a quiz taker, I want a shareable score card image showing "Unhyped score", level, track and radar, so that I can post it.
70. As a quiz taker, I want a share link that renders the card as an Open Graph image, so that it looks good on X, LinkedIn and Slack.
71. As a quiz taker, I want to retake the quiz and get different questions, so that retakes are meaningful.
72. As a quiz taker, I want the quiz to still work in a reduced "light mode" (MCQ and tricky questions only) when the LLM budget is exhausted, so that it never simply breaks.
73. As a privacy-conscious taker, I want no account and no personal data required, so that I can take the quiz anonymously.

### Staying current: ingestion and curation
74. As the site owner, I want to paste an article URL or raw text about a new AI development or future forecast into a protected ingestion endpoint, so that it can be evaluated and added to the timeline.
75. As the site owner, I want ingestion to classify the article as new entry, major update to an existing entry, projection/forecast, candidate Claim vs. Reality, or not notable, so that it lands in the right place.
76. As the site owner, I want ingestion to draft schema-valid entries (with segment, stack layer, era, edges and sources) and check them against existing entries for duplicates, so that review is fast.
77. As the site owner, I want ingestion to open a draft GitHub pull request with the proposed changes and a summary of its reasoning and confidence, so that nothing reaches the site without my review.
78. As the site owner, I want ingestion to judge each candidate against the inclusion criteria and say which criterion it meets, so that the dataset doesn't bloat.
79. As the site owner, I want ingestion to extract quotes only verbatim, marked "unverified" until I confirm them, and never write the Reality text of a Claim vs. Reality pair, so that the editorial standard holds.
80. As the site owner, I want forecasts from ingested articles attached to the right future scenario with forecaster, target date and source, so that the future section grows with evidence.
81. As the site owner, I want a minimal protected admin page with a paste box that calls the ingestion API and shows job status and the resulting PR link, so that I don't need curl.
82. As the site owner, I want a weekly scheduled job that collects candidates from trusted sources and sends them through the same pipeline, so that the timeline stays fresh with about 20 minutes of review a week.
83. As the site owner, I want merging a data PR to redeploy the site automatically, so that approved changes go live without manual steps.
84. As the site owner, I want forecast statuses re-evaluated when their target dates pass, flagged in the weekly PR, so that the receipts stay current.

### Community corrections
85. As a visitor, I want a "Suggest an edit" button on every entry and signpost that opens a pre-filled GitHub issue, so that I can report errors or missing items.
86. As a contributor, I want a published inclusion policy and sourcing standard on an About/Method page, so that I know what qualifies and how to propose it.

### Trust, method and accessibility
87. As a sceptical visitor, I want an About/Method page explaining the inclusion criteria, the sourcing rules (verbatim quotes only, dated sources) and how capability eras are defined, so that I can judge the site's credibility.
88. As a visitor, I want the site to meet WCAG 2.2 AA for text contrast, focus states and screen-reader labels, and to keep entry text as real, selectable HTML, so that it is usable by everyone.
89. As a visitor on a slow network, I want the first view usable quickly, with era assets streamed as I approach them, so that I'm not waiting on a heavy download.
90. As a visitor in light or dark system mode, I want the UI chrome to respect my preference while the era worlds keep their own palettes, so that the interface stays readable.

## Implementation Decisions

### Product decisions (from the discovery interview)
- **Shape:** story first, with an Atlas view added later. v1 is the narrative road; a full searchable Atlas (grid and graph) ships in v1.1 as a query over the same dataset.
- **Audience:** developers, PMs, founders. Explanations assume technical literacy.
- **Thesis:** anti-hype but credible. Claim vs. Reality pairs are shown alongside "Still alive" follow-ups, and claims that came true are shown too.
- **Named claims:** named people only, verbatim quotes only, always with source and date. Paraphrases are never shown as quotes. Sentiments with no named speaker are labelled as community sentiment.
- **Chronology:** reversed. The visitor lands at Today, the future is above, the past is below, and the journey ends at the campfire prologue.
- **Capability ladder (9 eras, ordered by capability, not strictly by date).** Each entry's era is assigned by what it could demonstrably do; for example, Deep Blue is Era 1 because it was search, not learning.
  - 0 — Tools extend the hand
  - 1 — Machines follow logic
  - 2 — Machines follow hand-written rules
  - 3 — Machines learn patterns from data
  - 4 — Machines see and hear
  - 5 — Machines write
  - 6 — Machines reason and use tools
  - 7 — Machines act and create across media
  - 8 — Projection (three scenarios)
- **Visual identity:** "Editorial / museum with instrument details." The type system is a high-contrast serif for display and quotes, a clean grotesk for body text, and a mono for dates, numbers and sources. Cards are flat with hairline rules. Only the world glows; the chrome does not.
  - **Exception:** the quiz modal uses a liquid-glass treatment, a deliberate contrast that lets the moving road show through.
- **Name:** Unhyped. The share card reads "Unhyped score".
- **v1 scope:**
  - road with 9 eras, prologue ending, future fork and about 5 hero moments
  - about 350 curated entries, about 50 Claim vs. Reality pairs, and "Still alive" follow-ups
  - hover card, segment filter and minimap
  - quiz with User and Builder tracks (Researcher disabled) and share cards
  - "Suggest an edit"
  - ingestion API with an admin paste page
- **v1.1:** Atlas view, deep links with per-entry OG images, the weekly scheduled pipeline.
- **v2:** Researcher track, comparison view, more hero moments, sound design, i18n.

### Architecture
- A Next.js app deployed on Vercel.
  - The timeline is statically generated from a versioned JSON dataset in the repository.
  - The quiz grading, ingestion and share-image endpoints run as server routes.
  - No user accounts and no database are needed for v1. Quiz session state is held client-side, with a signed session token for rate limiting.
- **Rendering: a hybrid scene.**
  - One persistent WebGL canvas (React Three Fiber) renders the road mesh, lanes, era terrain, a full-screen era-blend shader backdrop, particles and hero-moment set pieces.
  - Entry nodes, signposts, cards, the filter bar, the minimap and the quiz are **HTML overlays anchored to projected 3D positions**. This keeps text crisp, selectable, accessible and fast to filter; filtering changes opacity through CSS and never rebuilds the scene.
- **Scroll:** smoothed scroll input drives a single normalised progress value, and every visual system reads from it. Hero moments are timed segments of that progress, handled by a scroll-timeline library.
- **Performance tiers:** high, medium, low and reduced-motion, chosen from GPU heuristics and measured frame times. The low tier drops particles, simplifies shaders and turns hero moments into looping video.
- **Era assets** are lazy-loaded as the visitor approaches each era.

### Modules

**1. Dataset & Schema (deep module)**
- Owns the types and validation for Entry, Edge, Claim, StillAlive, Person and Scenario/Forecast.
- Interface: `loadDataset()` returns a typed, validated, indexed dataset; `validateDataset(raw)` returns a list of errors.
- Invariants:
  - every entry has at least one source with a date
  - enums are valid
  - every edge target and parent id exists
  - no duplicate ids
  - Claim quotes carry a verification flag, and only verified quotes render as quotes
  - a Major update must have a parent
- Also used in CI and by the ingestion pipeline.
- Schema shape (the decision-rich part):
  ```
  Entry { id, title, date (ISO, partial allowed), datePrecision: year|month|day,
          type: paper|model|product|oss-repo|major-update|person|org|event,
          era: 0..8, primarySegment, secondarySegments[], stackLayer,
          creators[], description, capabilityNote, parentId?,
          oss?: { license, repoUrl, stars, starsCheckedAt, archived },
          edges: { type: built-on|successor-of|competes-with|created-by|uses|inspired-by|acquired-by, target }[],
          sources: { url, title, accessedAt }[], heroMoment?: boolean, status: published|draft }
  Claim { id, entryId, speaker, speakerRole, quote, quoteVerified: boolean, saidAt, claimSource,
          reality, realitySources[], outcome: came-true|partially|not-yet|wrong|too-early, attribution: named|community-sentiment }
  StillAlive { id, subject, declaredDeadBy: Claim-ref, verdict: alive|declined|transformed, metrics[], sources[] }
  Scenario { id: steady|plateau|takeoff, forecasts: { forecaster, claim, madeAt, targetDate, source, status }[] }
  ```

**2. Road Layout Engine (deep module, pure)**
- Interface: `layoutRoad(dataset, options: { viewport: desktop|mobile }) → RoadGeometry`.
- `RoadGeometry` contains:
  - the main highway spline
  - one lane per segment, with merge and branch points
  - node anchor positions
  - dead-end spurs
  - frozen stretches
  - the "Today" anchor
  - the future fork (three scenario splines)
  - the prologue path to the campfire
- Time is mapped to distance non-linearly: recent years get more road per year than ancient ones, and the density of entries governs local spacing so nodes never overlap.
- Mobile layout collapses lanes into a single winding lane and keeps the segment as colour.
- Output is deterministic for a given dataset, so it can be precomputed at build time.

**3. Scroll Director (deep module, pure)**
- Interface: `direct(progress, roadGeometry) → { date, eraWeights[9], cameraPose, activeHeroMoment?, heroLocalProgress, direction }`.
- Encodes the blend curves between eras, including easing and overlap, the tilted 2.5D camera rig (about 55–60° down the road), hero-moment takeovers, and the negative-progress region above Today for the future fork.
- Reduced motion maps to discrete era stills with crossfade weights.

**4. Knowledge Graph Queries (deep module, pure)**
- Interface: `neighborhood(id, depth)`, `similar(id, k)` (same segment and layer, ranked by shared edges and date proximity), `stackPosition(id)`, `lineage(id)` (the successor-of chain), `peopleFor(id)`, `entriesForSegments(segments[])`.
- Used by the hover card, the filter, the quiz generator and ingestion deduplication.

**5. Quiz Engine (deep module, pure state machine)**
- Interface: `start(track, seed) → state`, `next(state) → question`, `answer(state, response, grade) → state`, `result(state) → { percent, level, dimensionScores, reviewLinks[] }`.
- Dimension weights by track:

  | Dimension | User | Builder |
  |---|---|---|
  | Concepts | 15% | 10% |
  | Lineage & Stack | 10% | 10% |
  | Awareness (last 90 days) | 15% | 10% |
  | Prompting | 25% | 15% |
  | Tool proficiency | 25% | 20% |
  | Hype calibration | 10% | 10% |
  | Building | — | 25% |

- **Adaptivity:** difficulty steps up after correct answers and down after misses. Each run has 12–15 questions and covers every dimension at least once. Self-reported tools trigger cross-questions.
- **Levels:** Curious (<40%), Practitioner (40–64%), Power User (65–84%), Architect (≥85%). These thresholds are tunable.
- **Light mode:** restricts the pool to auto-graded formats and renormalises the weights.
- The Researcher track exists in the type system but is disabled.

**6. Question Generator (deep module)**
- Builds questions from the dataset and a hand-authored bank.
  - **Awareness:** entries dated within 90 days of build time, with plausible decoy tool names from a curated decoy list.
  - **Hype calibration:** from Claim and StillAlive records.
  - **Lineage & Stack:** from edges, layers and dates.
- Hand-authored questions cover Concepts, the prompting tasks, the builder tasks and the tricky questions.
- Each free-text question carries a rubric with fixed anchor examples at each score level.

**7. LLM Grader (deep module)**
- Interface: `grade(question, rubric, answer) → { score 0–5, rationale, flags }` and `crossQuestion(context) → question`.
- **Provider:** OpenRouter using a single pinned open-weight model plus a named fallback. The model is chosen for instruction-following and reliable JSON output, and the model ID lives in configuration.
- **Development:** free routers (FreeLLMAPI, NVIDIA build credits) are allowed but never used in production, to keep scoring consistent.
- **Double grading:** every free-text answer is graded twice. If the two scores are within 1 point they are averaged; if not, a third grade is taken and the median is used.
- Output is validated against a JSON schema, with one repair attempt. The prompt is structured to resist answers that try to instruct the grader.
- Low-cost gates (on-topic and spam checks) run before full grading.

**8. Budget & Rate Guard (deep module)**
- Interface: `admit(sessionToken, ip, costEstimate) → allow | throttle | light-mode`.
- Enforces per-session and per-IP limits and a global daily spend cap. Cap state lives in a small hosted key-value store.
- When the cap is reached, the quiz switches to light mode and the UI says so.

**9. Ingestion Pipeline (deep module)**
- Interface:
  - `POST /api/ingest` with `{ url? | text?, kind?: news|projection|auto, note? }`, protected by an admin bearer token; returns `{ jobId }`
  - `GET /api/ingest/:jobId` returns status, candidates and PR URL
- **Steps:**
  1. fetch and extract readable article text
  2. LLM classification: new entry, major update of a parent, projection/forecast, claim candidate, or not notable, together with the inclusion criterion met
  3. draft schema-valid records
  4. validate with the Dataset module
  5. deduplicate against existing ids, titles, URLs and graph neighbours
  6. open a draft GitHub PR against the data branch, whose body contains a reasoning summary, confidence and source list
- **Hard rules:**
  - quotes are extracted verbatim and marked unverified
  - Reality text for Claim vs. Reality is never generated
  - projections must name a forecaster and a target date, or they are rejected
- The weekly scheduled job in v1.1 feeds the same pipeline from trusted sources (lab blogs, arXiv/HF papers, GitHub trending with star-authenticity checks, Epoch AI, OpenRouter rankings).
- Idempotent by source URL.

**UI modules (thin)**
- Road Scene, Era Backdrop Shader and Hero Moments
- Node Overlay layer
- Hover Card, including the Stack Diagram
- Detail Panel
- Map of AI chips and Sticky Filter Bar
- Era Minimap and Date Readout
- Navbar with the Quiz button
- Liquid-glass Quiz Modal (track toggle, question renderers per format, progress, results radar)
- Share Card: an OG image route rendering score, level, track and radar
- Suggest-an-edit link builder (a GitHub issue template pre-filled with the entry id)
- Admin Ingest page (paste box, job status, PR link)
- About/Method page

### Data and research
- Seed data comes from six research notes plus the user's original timeline. The combined report drives curation.
- **Target split:** prologue about 10, 1943–1979 about 35, 1980–2011 about 45, 2012–2021 about 70, 2022–2026 about 170, projections about 20.
- **Must include:** Prolog, the Hermes model family, Hermes Agent, and Claude Cowork (major update of Claude, research preview 2026-01-12).
- **Corrections to the original file are applied:**
  - Opus 4.6 → Feb 5, 2026
  - Opus 4.7 → Apr 16, Claude Design → Apr 17
  - OpenAI MCP adoption → Mar 26, 2025
  - Chatbot Arena → May 3, 2023
  - add the Sora shutdown, Sonnet 5 and Cowork
- **Verification backlog before launch:**
  - link-check every source URL
  - verify every quote tagged "verify", "snippet" or "from memory" against the primary source
  - hold back single-source 2026 claims (for example the reported OpenAI agent incidents, Veo 4)
  - treat GitHub stars as insufficient on their own evidence (a 2026 study found about 6M fake stars, concentrated in AI repos) and require sustained-use evidence
- The GitHub repository is the source of truth. Public corrections arrive as issues; data changes arrive as PRs.

### Security and privacy
- The admin ingestion endpoint needs a bearer token and is rate-limited.
- Fetched article content is treated as untrusted input: the pipeline never follows instructions found in it, and the classifier prompt isolates article text.
- Quiz free-text answers are not stored beyond the session except as anonymised, aggregated rubric calibration samples, and only if the user opts in.
- No personal data is collected. People cards contain only public professional records.

## Testing Decisions

- **What makes a good test:** it exercises a module through its public interface and asserts on externally observable behaviour: outputs, returned states, validation errors. It never asserts on internal helpers, shader code or component structure. Pure modules are tested with small hand-built fixture datasets plus one test against the real dataset.
- **Modules under test (core logic, as the user chose):**
  - **Dataset & Schema.** Rejects a missing source, a dangling edge, a duplicate id, an unverified quote rendered as a quote, and a major update without a parent. Accepts the real seed dataset. Runs in CI on every data PR.
  - **Road Layout Engine.**
    - Deterministic output.
    - Reverse chronology (a newer entry sits nearer Today).
    - No overlapping node anchors at the minimum spacing.
    - Lanes merge and branch at the expected era boundaries for fixtures.
    - Dead ends and frozen stretches appear for flagged entries.
    - The mobile layout collapses to one lane.
    - The future fork sits above Today.
  - **Scroll Director.**
    - Era weights always sum to 1.
    - Blends are monotonic across boundaries.
    - The correct era is dominant at sampled dates.
    - Hero moments activate only within their windows.
    - Negative progress maps to the future region.
    - Reduced motion yields discrete stills.
  - **Knowledge Graph Queries.**
    - Neighbourhood depth is respected.
    - `similar` excludes the entry itself and prefers the same layer and segment.
    - `stackPosition` matches the entry's layer.
    - Filtering by several segments matches primary or secondary segments.
  - **Quiz Engine.**
    - Weights per track sum to 100%.
    - Every dimension is covered in each run.
    - Difficulty rises after correct answers.
    - The percentage and level are computed correctly at the threshold edges.
    - Light mode renormalises weights.
    - The Researcher track cannot be started.
    - Seeded runs are reproducible, and different seeds give different question sets.
  - **Question Generator.**
    - Awareness questions come only from the 90-day window.
    - Decoys never collide with real entry names.
    - Hype questions map to real claims with a verified quote.
- **Not unit-tested in v1:** the LLM grader, budget guard, ingestion pipeline and visual/E2E flows. These are covered by manual QA and staging checks. They are candidates for mocked-provider tests and a Playwright smoke suite in v1.1.
- **Prior art:** none; this is a new repository. Use Vitest with fixture builders, and colocate a small `fixtures` dataset with the dataset module.

## Out of Scope

- The AI Researcher quiz track (shown disabled, "Coming soon").
- User accounts, saved history, leaderboards and social features beyond share cards.
- The full Atlas view, per-entry deep links and OG images, and the weekly scheduled pipeline (v1.1).
- A comparison view, sound design, i18n and extra hero moments (v2).
- Automatic publishing of any ingested content. Every data change goes through a reviewed PR.
- LLM-generated Reality text for Claim vs. Reality pairs, and paraphrased quotes.
- A single "AGI date" or a hype-meter gauge. Both were deliberately rejected as false precision.
- Self-hosted or in-browser LLM inference in production.
- Real-time benchmark dashboards (link out to Artificial Analysis, Arena and Epoch AI instead).

## Further Notes

- **Design skills:** the build phase will use the 3d-web-experience, ui-ux-pro-max, high-end-visual-design and design-taste-frontend skills for the road scene, era art direction and chrome.
- **Reference image for the road:** a top-down highway interchange (lanes, merges, loops, overpasses). The design reinterprets it in a tilted 2.5D perspective with era-specific materials.
- **Hero-moment shortlist:** the AGI fork, ChatGPT (Nov 2022), Transformer (2017), AlexNet (2012), AI winter freeze (1974/1987), Dartmouth (1956). Also consider the Cowork "SaaSpocalypse" signpost (Feb 2026: stock-price drawdown while revenue kept growing).
- **Editorial risks:**
  - A bad quote damages credibility more than a missing entry, so launch waits on the quote-verification backlog.
  - The anti-hype stance must include cases where the hype was right (AlphaFold, Salesforce support cuts, entry-level hiring pressure) and where things really did decline (Stack Overflow questions down about 99% from their peak, Chegg).
- **Model selection for grading** happens during build: benchmark 2–3 current open-weight candidates on JSON reliability and grading agreement against about 30 hand-scored anchor answers.
- **Issue tracker:** there is no repository yet. When the GitHub repo is created, file this PRD as an issue labelled `ready-for-agent`.
