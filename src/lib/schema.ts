import { z } from "zod";
import {
  CLAIM_OUTCOMES,
  EDGE_TYPES,
  ENTRY_TYPES,
  SEGMENT_IDS,
  STACK_LAYER_IDS,
  type SegmentId,
  type StackLayerId,
} from "./taxonomy";

const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "ids are kebab-case");
// Partial ISO dates: "1956", "1956-08", "1956-08-31". Negative years allowed for the prologue.
const partialDate = z
  .string()
  .regex(/^-?\d{1,6}(-\d{2}(-\d{2})?)?$/, "date must be YYYY, YYYY-MM or YYYY-MM-DD");
const segment = z.enum(SEGMENT_IDS as [SegmentId, ...SegmentId[]]);
const layer = z.enum(STACK_LAYER_IDS as [StackLayerId, ...StackLayerId[]]);

export const SourceSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  accessedAt: partialDate.optional(),
});

export const EdgeSchema = z.object({
  type: z.enum(EDGE_TYPES),
  target: id,
});

export const MajorUpdateSchema = z.object({
  date: partialDate,
  title: z.string(),
  summary: z.string(),
  source: z.string().url().optional(),
});

export const EntrySchema = z.object({
  id,
  title: z.string().min(1),
  date: partialDate,
  /** For spans such as AI winters. */
  endDate: partialDate.optional(),
  type: z.enum(ENTRY_TYPES),
  era: z.number().int().min(0).max(8),
  primarySegment: segment,
  secondarySegments: z.array(segment).default([]),
  stackLayer: layer,
  creators: z.array(z.string()).default([]),
  description: z.string().min(1),
  capabilityNote: z.string().optional(),
  parentId: id.optional(),
  majorUpdates: z.array(MajorUpdateSchema).default([]),
  oss: z
    .object({
      license: z.string().optional(),
      repoUrl: z.string().url().optional(),
      stars: z.number().int().nonnegative().optional(),
      starsCheckedAt: partialDate.optional(),
      archived: z.boolean().optional(),
    })
    .optional(),
  edges: z.array(EdgeSchema).default([]),
  sources: z.array(SourceSchema).min(1, "every entry needs at least one source"),
  heroMoment: z.boolean().optional(),
  // Abandoned approaches render as dead-end spurs; winters as frozen road.
  roadFeature: z.enum(["dead-end", "frozen"]).optional(),
  status: z.enum(["published", "draft"]).default("published"),
});

export const ClaimSchema = z.object({
  id,
  entryId: id,
  speaker: z.string(),
  speakerRole: z.string().optional(),
  attribution: z.enum(["named", "community-sentiment"]),
  quote: z.string().min(1),
  quoteVerified: z.boolean(),
  saidAt: partialDate,
  claimSource: z.string().url(),
  reality: z.string().min(1),
  realitySources: z.array(z.string().url()).min(1),
  outcome: z.enum(CLAIM_OUTCOMES),
});

export const StillAliveSchema = z.object({
  id,
  subject: z.string(),
  entryId: id.optional(),
  claimId: id.optional(),
  verdict: z.enum(["alive", "declined", "transformed"]),
  summary: z.string(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  sources: z.array(z.string().url()).min(1),
});

export const PersonSchema = z.object({
  id,
  name: z.string(),
  roles: z.array(z.string()).default([]),
  knownFor: z.array(id).default([]),
  quote: z
    .object({ text: z.string(), verified: z.boolean(), source: z.string().url(), date: partialDate })
    .optional(),
  source: z.string().url(),
});

export const ForecastSchema = z.object({
  id,
  forecaster: z.string(),
  claim: z.string(),
  quoteVerified: z.boolean().default(false),
  madeAt: partialDate,
  targetDate: partialDate,
  source: z.string().url(),
  status: z.enum(["pending", "came-true", "missed", "revised"]),
  note: z.string().optional(),
});

export const ScenarioSchema = z.object({
  id: z.enum(["steady", "plateau", "takeoff"]),
  summary: z.string(),
  forecasts: z.array(ForecastSchema),
});

export const DatasetSchema = z.object({
  entries: z.array(EntrySchema),
  claims: z.array(ClaimSchema).default([]),
  stillAlive: z.array(StillAliveSchema).default([]),
  people: z.array(PersonSchema).default([]),
  scenarios: z.array(ScenarioSchema).default([]),
});

export type Source = z.infer<typeof SourceSchema>;
export type Edge = z.infer<typeof EdgeSchema>;
export type Entry = z.infer<typeof EntrySchema>;
export type Claim = z.infer<typeof ClaimSchema>;
export type StillAlive = z.infer<typeof StillAliveSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Forecast = z.infer<typeof ForecastSchema>;
export type Scenario = z.infer<typeof ScenarioSchema>;
export type RawDataset = z.input<typeof DatasetSchema>;
export type DatasetData = z.infer<typeof DatasetSchema>;
