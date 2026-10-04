import meta from "../../data/meta.json";

/** "Oct 2026": when the dataset last changed (stamped by `npm run merge:data`). */
export const UPDATED_AT: string = new Date(`${meta.updatedAt}T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
export const UPDATED_ISO: string = meta.updatedAt;
