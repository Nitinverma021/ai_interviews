import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");
  if (user.role !== "admin") redirect("/");

  const shareUrl = process.env.NEXT_PUBLIC_UMAMI_SHARE_URL;

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel">
        <div className="flex items-center gap-3">
          <BarChart3 className="size-7 text-primary-200" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-200">
              Admin Analytics
            </p>
            <h1>Umami Analytics</h1>
          </div>
        </div>
        <p>
          This page is visible only to admins and embeds your shared Umami
          dashboard.
        </p>
      </section>

      {shareUrl ? (
        <section className="analytics-frame-shell">
          <p className="px-2 pb-2 text-sm text-light-100/80 md:hidden">
            Swipe sideways inside the analytics panel to view the full report.
          </p>
          <div className="analytics-frame-scroll">
            <iframe
              src={shareUrl}
              title="Umami Analytics"
              className="analytics-frame"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
      ) : (
        <section className="dashboard-panel">
          <h2>Connect Umami Share URL</h2>
          <p>
            In Umami, open your website settings, enable sharing, copy the
            public share URL, then add it to Vercel as:
          </p>
          <pre className="overflow-x-auto rounded-xl bg-dark-100 p-4 text-sm text-primary-100">
            NEXT_PUBLIC_UMAMI_SHARE_URL=https://cloud.umami.is/share/...
          </pre>
          <Button asChild className="btn-primary">
            <Link href="/admin">Back to Admin</Link>
          </Button>
        </section>
      )}
    </div>
  );
}
