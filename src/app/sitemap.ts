import type { MetadataRoute } from "next";
import { compareKinds, dimensionsFor, entries, toolsOfKind, UPDATED_ISO, url } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const modified = new Date(`${UPDATED_ISO}T00:00:00Z`);
  const kinds = Object.keys(compareKinds).filter((k) => toolsOfKind(k).length && dimensionsFor(k).length);
  return [
    { url: url("/"), lastModified: modified, changeFrequency: "weekly", priority: 1 },
    { url: url("/timeline"), lastModified: modified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/tools"), lastModified: modified, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/compare"), lastModified: modified, changeFrequency: "weekly", priority: 0.9 },
    ...kinds.map((k) => ({ url: url(`/compare/${k}`), lastModified: modified, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: url("/method"), lastModified: modified, changeFrequency: "monthly", priority: 0.5 },
    ...entries.map((e) => ({ url: url(`/tools/${e.id}`), lastModified: modified, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
