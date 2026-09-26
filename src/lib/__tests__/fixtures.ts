import { buildDataset } from "../dataset";
import type { Entry } from "../schema";
import type { RawDataset } from "../schema";

type E = Partial<Entry> & Pick<Entry, "id" | "date">;

export function entry(e: E): Entry {
  return {
    title: e.id,
    type: "model",
    era: 5,
    primarySegment: "foundation-models",
    secondarySegments: [],
    stackLayer: "models",
    creators: [],
    description: `${e.id} description`,
    majorUpdates: [],
    edges: [],
    sources: [{ url: `https://example.com/${e.id}` }],
    status: "published",
    ...e,
  } as Entry;
}

export const fixtureEntries: Entry[] = [
  entry({ id: "prolog", date: "1972", era: 2, primarySegment: "symbolic-logic", stackLayer: "algorithms" }),
  entry({ id: "ai-winter-1", date: "1974", endDate: "1980", type: "event", era: 2, primarySegment: "symbolic-logic", stackLayer: "algorithms", roadFeature: "frozen" }),
  entry({ id: "fifth-gen", date: "1982", era: 2, primarySegment: "symbolic-logic", stackLayer: "compute", roadFeature: "dead-end" }),
  entry({ id: "backprop", date: "1986", era: 3, primarySegment: "neural-deep-learning", stackLayer: "algorithms" }),
  entry({ id: "alexnet", date: "2012-09-30", era: 4, primarySegment: "vision", stackLayer: "models", edges: [{ type: "built-on", target: "backprop" }], heroMoment: true }),
  entry({ id: "transformer", date: "2017-06-12", era: 5, primarySegment: "language", stackLayer: "algorithms", type: "paper", edges: [{ type: "inspired-by", target: "backprop" }] }),
  entry({ id: "gpt-3", date: "2020-05-28", edges: [{ type: "built-on", target: "transformer" }] }),
  entry({ id: "chatgpt", date: "2022-11-30", stackLayer: "apps", type: "product", edges: [{ type: "built-on", target: "gpt-3" }] }),
  entry({ id: "claude", date: "2023-03-14", stackLayer: "apps", type: "product", edges: [{ type: "competes-with", target: "chatgpt" }] }),
  entry({ id: "langchain", date: "2022-10-17", era: 6, primarySegment: "agent-frameworks", stackLayer: "frameworks", type: "oss-repo" }),
  entry({ id: "langgraph", date: "2024-01-08", era: 6, primarySegment: "agent-frameworks", stackLayer: "frameworks", type: "oss-repo", edges: [{ type: "built-on", target: "langchain" }] }),
  entry({ id: "crewai", date: "2023-11-14", era: 6, primarySegment: "agent-frameworks", stackLayer: "frameworks", type: "oss-repo", edges: [{ type: "competes-with", target: "langgraph" }] }),
  entry({ id: "claude-code", date: "2025-02-24", era: 7, primarySegment: "coding-agents", stackLayer: "harnesses", type: "product", edges: [{ type: "built-on", target: "claude" }] }),
  entry({ id: "claude-cowork", date: "2026-08-20", era: 7, primarySegment: "personal-agents", stackLayer: "apps", type: "product", parentId: "claude" }),
  entry({ id: "opus-5-5", date: "2026-09-22", type: "major-update", parentId: "claude" }),
];

export const fixtureRaw: RawDataset = {
  entries: fixtureEntries,
  claims: [
    {
      id: "hinton-radiologists",
      entryId: "alexnet",
      speaker: "Geoffrey Hinton",
      attribution: "named",
      quote: "People should stop training radiologists now.",
      quoteVerified: true,
      saidAt: "2016-11",
      claimSource: "https://example.com/hinton",
      reality: "Radiologist numbers grew.",
      realitySources: ["https://example.com/reality"],
      outcome: "wrong",
    },
    {
      id: "rag-dead",
      entryId: "langchain",
      speaker: "Developer community sentiment",
      attribution: "community-sentiment",
      quote: "RAG is dead",
      quoteVerified: false,
      saidAt: "2024",
      claimSource: "https://example.com/rag",
      reality: "RAG changed shape but is widely used.",
      realitySources: ["https://example.com/rag2"],
      outcome: "wrong",
    },
  ],
};

export const fixtureDataset = () => buildDataset(fixtureRaw);
