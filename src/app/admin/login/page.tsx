import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, sessionValid } from "@/lib/admin/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in · Unhyped", robots: { index: false } };

export default async function LoginPage() {
  if (sessionValid((await cookies()).get(COOKIE)?.value)) redirect("/admin/ingest");
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center px-4 py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-paper-faint">Admin</p>
      <h1 className="mt-3 font-serif text-4xl text-paper">Sign in</h1>
      <p className="mt-3 text-paper-muted">Only the site owner can add to the road. Enter the admin token.</p>
      <LoginForm />
    </main>
  );
}
