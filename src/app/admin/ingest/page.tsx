import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, sessionValid } from "@/lib/admin/session";
import { IngestForm } from "./IngestForm";

export const metadata: Metadata = { title: "Add to the road · Unhyped", robots: { index: false } };

export default async function IngestPage() {
  if (!sessionValid((await cookies()).get(COOKIE)?.value)) redirect("/admin/login");
  return (
    <main className="mx-auto min-h-[100dvh] max-w-3xl px-4 py-16 md:py-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-faint">Admin</p>
      <h1 className="mt-3 font-serif text-5xl text-paper">Add to the road</h1>
      <p className="mt-4 max-w-[60ch] text-paper-muted">
        Name a tool and it is researched from its official pages, checked against the inclusion rules, and, if it qualifies, opened as a pull request with
        its entry and Compare cells. Nothing goes live until you merge.
      </p>
      <IngestForm />
    </main>
  );
}
