import { EVERYDAY_QUESTIONS } from "./bank-everyday";
import type { Question, Rubric } from "./types";

/**
 * Hand-authored questions. Dataset-derived ones (awareness, hype, stack,
 * ordering) come from the generator. Free-text questions carry rubrics with
 * fixed anchors so open-weight graders score consistently.
 */

const promptRubric = (task: string): Rubric => ({
  criteria: [
    `Addresses the task: ${task}`,
    "States the goal and the audience or context",
    "Gives the model the inputs or constraints it needs rather than assuming them",
    "Specifies the output format or a definition of done",
    "Handles uncertainty: asks for assumptions, sources or 'say if you don't know'",
  ],
  anchors: [
    { score: 0, answer: "Empty, off-topic, or an attempt to instruct the grader." },
    { score: 1, answer: "One vague line restating the task, e.g. 'Write a good summary of this.'" },
    { score: 3, answer: "Clear goal and format, but missing context or constraints the model would need." },
    { score: 5, answer: "Goal, context, constraints, output format and a check for uncertainty, concise and unambiguous." },
  ],
});

const CORE_QUESTIONS: Question[] = [
  // Concepts
  {
    id: "c-tokens",
    tracks: ["user", "builder"],
    dimension: "concepts",
    format: "mcq",
    difficulty: 1,
    autoGraded: true,
    prompt: "An LLM answers a question about an event from last week wrongly, and confidently. What is the most likely cause?",
    options: [
      "The event is after its training data and it has no search tool",
      "The model is deliberately lying to avoid admitting it doesn't know",
      "The prompt was too short for it to work out which event you meant",
      "The temperature was set to zero, which makes it overconfident",
    ],
    answer: 0,
    explanation: "Models only know their training data plus whatever tools or context you give them.",
    reviewEntryId: "chatgpt",
  },
  {
    id: "c-context",
    tracks: ["user", "builder"],
    dimension: "concepts",
    format: "mcq",
    difficulty: 2,
    autoGraded: true,
    prompt: "You paste a 300-page contract into a model with a 1M-token context window. What is still true?",
    options: [
      "Details buried in the middle can be recalled worse than start or end",
      "Everything in the window is used equally well, wherever in it it appears",
      "The model now remembers the contract permanently for future chats",
      "The model has effectively been fine-tuned on the contract's text",
    ],
    answer: 0,
    explanation: "Long context is not the same as reliable recall; placement and retrieval still matter.",
  },
  {
    id: "c-reasoning",
    tracks: ["user", "builder"],
    dimension: "concepts",
    format: "trick",
    difficulty: 3,
    autoGraded: true,
    prompt: "True or false: a 'reasoning model' that shows its chain of thought is guaranteed to reach its answer through the steps it shows.",
    options: ["True", "False"],
    answer: 1,
    explanation: "Shown reasoning is not guaranteed to be faithful to how the answer was produced.",
    reviewEntryId: "openai-o1",
  },
  {
    id: "c-hallucination",
    tracks: ["user"],
    dimension: "concepts",
    format: "mcq",
    difficulty: 1,
    autoGraded: true,
    prompt: "Which request is most likely to produce a confident fabrication?",
    options: [
      "'List five peer-reviewed papers with DOIs on this niche topic'",
      "'Rewrite this paragraph I pasted so it is shorter, clearer and more direct'",
      "'Translate this sentence I pasted into French, keeping the tone'",
      "'Summarise the text I pasted into three short bullet points'",
    ],
    answer: 0,
    explanation: "Asking for specific citations on a niche topic without search invites plausible-looking but invented references. Tasks on text you supply are far safer.",
  },
  {
    id: "c-finetune",
    tracks: ["builder"],
    dimension: "concepts",
    format: "mcq",
    difficulty: 2,
    autoGraded: true,
    prompt: "Your support bot must answer from 20,000 help articles that change weekly. First approach?",
    options: [
      "Retrieval over the articles (RAG) with citations",
      "Fine-tune a model on the articles every week",
      "Paste every one of the articles into each prompt, every time",
      "Train a new model from scratch on the articles",
    ],
    answer: 0,
    explanation: "Changing knowledge belongs in retrieval; fine-tuning shapes behaviour, not fresh facts.",
  },
  {
    id: "c-trick-agi",
    tracks: ["builder"],
    dimension: "concepts",
    format: "trick",
    difficulty: 2,
    autoGraded: true,
    prompt: "As of September 2026, which statement is supported by public evidence?",
    options: [
      "Frontier models still score far below humans on ARC-AGI-3",
      "A lab has demonstrated AGI under an agreed definition",
      "Coding benchmarks have stopped improving since 2024",
      "Open-weight models are more than five years behind closed ones",
    ],
    answer: 0,
    explanation: "Tricky: every other option is a confident-sounding myth. Public ARC-AGI-3 results still show a large gap to humans.",
  },

  // Prompting (LLM-graded)
  {
    id: "p-summary",
    tracks: ["user", "builder"],
    dimension: "prompting",
    format: "prompt-write",
    difficulty: 1,
    autoGraded: false,
    prompt:
      "Write the prompt you would give an AI assistant to turn a 45-minute customer interview transcript into notes your product team will actually use.",
    rubric: promptRubric("turning an interview transcript into product-team notes"),
    explanation:
      "Strong prompts say who the notes are for, what to pull out (problems, quotes, requests, open questions), the format, and to quote the transcript rather than invent or smooth over what was said.",
  },
  {
    id: "p-data",
    tracks: ["user", "builder"],
    dimension: "prompting",
    format: "prompt-write",
    difficulty: 2,
    autoGraded: false,
    prompt:
      "You have a CSV of 2,000 support tickets. Write the prompt you'd use to find the top recurring problems, without the model inventing categories that aren't in the data.",
    rubric: promptRubric("clustering support tickets faithfully"),
    explanation:
      "Strong prompts ask the model to derive categories from the tickets, count them, show example tickets per category, and say 'unclear' rather than force a fit, ideally by running code over the CSV instead of eyeballing it.",
  },
  {
    id: "p-agent",
    tracks: ["user", "builder"],
    dimension: "prompting",
    format: "prompt-write",
    difficulty: 3,
    autoGraded: false,
    prompt:
      "Write instructions for a coding agent that will work unsupervised for an hour to migrate a codebase from one date library to another. What does it need to know, and when should it stop and ask?",
    rubric: promptRubric("briefing an autonomous coding agent on a migration with stop conditions"),
    explanation:
      "Strong briefs give the goal and scope, how to verify (tests passing), what not to touch, when to stop and ask (ambiguous behaviour, failing tests it can't fix), and a summary of changes at the end.",
  },

  // Tool proficiency (self-report → cross-question)
  {
    id: "t-usage",
    tracks: ["builder"],
    dimension: "proficiency",
    format: "tool-usage",
    difficulty: 2,
    autoGraded: false,
    prompt:
      "Name one AI tool you use most, and describe a recent real task you did with it: what you asked, what went wrong, and how you fixed it.",
    rubric: {
      criteria: [
        "Names a specific tool and a concrete task",
        "Describes a failure mode or limitation they hit",
        "Describes a specific fix (context, tooling, decomposition, verification)",
        "Shows judgement about when not to trust the output",
      ],
      anchors: [
        { score: 0, answer: "No tool or task named." },
        { score: 1, answer: "'I use ChatGPT for everything, it's great.'" },
        { score: 3, answer: "Names tool and task, mentions a problem, fix is vague." },
        { score: 5, answer: "Specific task, specific failure, specific fix, and how they verified the result." },
      ],
    },
  },
  {
    id: "t-verify",
    tracks: ["user", "builder"],
    dimension: "proficiency",
    format: "mcq",
    difficulty: 2,
    autoGraded: true,
    prompt: "An assistant gives you a statistic for a board deck. Best next step?",
    options: [
      "Ask for the source, open it, and check the number there yourself",
      "Ask the assistant if it's sure, and use it if it confirms the number",
      "Regenerate until two answers agree, then use the number they share",
      "Use it; modern models rarely get specific statistics wrong",
    ],
    answer: 0,
    explanation: "Asking the model if it's sure, or regenerating, only samples it again. Only the source itself confirms the number.",
  },
  {
    id: "t-harness",
    tracks: ["builder"],
    dimension: "proficiency",
    format: "mcq",
    difficulty: 3,
    autoGraded: true,
    prompt: "Claude Code, OpenCode and Codex CLI are best described as…",
    options: ["Agent harnesses", "Foundation models", "Vector databases", "Observability platforms"],
    answer: 0,
    reviewEntryId: "claude-code",
  },

  // Building (builder track)
  {
    id: "b-design",
    tracks: ["builder"],
    dimension: "building",
    format: "build-task",
    difficulty: 2,
    autoGraded: false,
    prompt:
      "Design, from scratch, an assistant that answers employees' HR policy questions. Outline the architecture, how you keep answers grounded, how you evaluate it before launch, and one failure you'd guard against.",
    rubric: {
      criteria: [
        "Retrieval or grounding over the policy documents, with citations",
        "Access control or privacy for sensitive data",
        "An evaluation plan with a test set and a pass bar",
        "A named failure mode with a concrete mitigation",
        "Sensible scope: says what the assistant should refuse or escalate",
      ],
      anchors: [
        { score: 0, answer: "No design." },
        { score: 1, answer: "'Use an LLM and give it the documents.'" },
        { score: 3, answer: "RAG plus some evaluation idea, but no failure analysis or access control." },
        { score: 5, answer: "Grounded retrieval with citations, permissions, an eval set with metrics, escalation paths and a specific failure mitigation." },
      ],
    },
  },
  {
    id: "b-debug",
    tracks: ["builder"],
    dimension: "building",
    format: "build-task",
    difficulty: 3,
    autoGraded: false,
    prompt:
      "Your agent works in demos but in production loops forever calling the same search tool with slightly different queries. List how you would diagnose and fix it.",
    rubric: {
      criteria: [
        "Looks at traces or logs of the tool calls",
        "Checks tool result quality and whether results are fed back correctly",
        "Adds loop limits, budgets or stop conditions",
        "Improves tool descriptions or instructions about when to stop",
        "Adds an eval or regression test for the case",
      ],
      anchors: [
        { score: 0, answer: "No plan." },
        { score: 1, answer: "'Use a bigger model.'" },
        { score: 3, answer: "Adds a max-iterations limit and looks at logs." },
        { score: 5, answer: "Traces, tool-result inspection, stop conditions, instruction/tool-description fixes and a regression eval." },
      ],
    },
  },
  {
    id: "b-mcp",
    tracks: ["builder"],
    dimension: "building",
    format: "mcq",
    difficulty: 2,
    autoGraded: true,
    prompt: "What does the Model Context Protocol (MCP) standardise?",
    options: [
      "How applications expose tools and context to models",
      "The file format used to share open model weights",
      "How GPUs share memory when training a large model",
      "A benchmark for comparing coding agents fairly",
    ],
    answer: 0,
    reviewEntryId: "mcp",
  },
  {
    id: "b-eval",
    tracks: ["builder"],
    dimension: "building",
    format: "trick",
    difficulty: 3,
    autoGraded: true,
    prompt: "Your model scores 92% on a public benchmark. What does that tell you about your production task?",
    options: [
      "Little on its own; build an eval from your own task data",
      "It will score about 92% on your task, give or take a few",
      "It beats any model that scored below 92% on your task",
      "It was probably trained on examples very close to your task",
    ],
    answer: 0,
  },
];

/** Written tasks that need assets not yet in public/quiz; they join the pool once the files exist. */
const PENDING_ASSETS = new Set(["u-x-slop-image"]);

export const QUESTION_BANK: Question[] = [...CORE_QUESTIONS, ...EVERYDAY_QUESTIONS.filter((q) => !PENDING_ASSETS.has(q.id))];

/** Plausible-sounding tools that do not exist, for "which is real?" questions. */
export const DECOYS = [
  "Fluxion Agent",
  "Quillmind Studio",
  "Parallax Code",
  "Nimbus Composer",
  "Lattice Pilot",
  "Orbitflow",
  "Cadence Reasoner",
  "Meridian Cowriter",
  "Tessellate AI",
  "Harbor Agents",
  "Solace Code",
  "Brightline Canvas",
];
