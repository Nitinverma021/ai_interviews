"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="root-layout">
      <section className="empty-state">
        <h1>Something went wrong</h1>
        <p>We could not load this screen. Try again or return home.</p>
        <div className="flex gap-3 max-sm:flex-col">
          <Button className="btn-primary" onClick={reset}>
            Try Again
          </Button>
          <Button asChild className="btn-secondary">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
