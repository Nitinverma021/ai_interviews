import LogoutButton from "@/components/LogoutButton";

export default function SiteRestricted() {
  return (
    <main className="root-layout">
      <section className="empty-state">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-200">
          Access Restricted
        </p>
        <h1>PrepWise is temporarily private</h1>
        <p>
          Public access is turned off right now. Please check back later or use
          an admin account.
        </p>
        <LogoutButton />
      </section>
    </main>
  );
}
