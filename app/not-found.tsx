import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="root-layout">
      <section className="empty-state">
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Button asChild className="btn-primary">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </section>
    </main>
  );
}
