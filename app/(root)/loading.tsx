const cards = Array.from({ length: 6 }, (_, index) => index);

export default function RootLoading() {
  return (
    <div className="flex flex-col gap-8">
      <section className="skeleton-hero">
        <div className="flex flex-col gap-4">
          <div className="skeleton-line h-4 w-44" />
          <div className="skeleton-line h-10 w-full max-w-xl" />
          <div className="skeleton-line h-5 w-full max-w-md" />
        </div>
        <div className="skeleton-media max-sm:hidden" />
      </section>

      <section className="dashboard-panel">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="skeleton-line h-12" />
          <div className="skeleton-line h-12" />
          <div className="skeleton-line h-12" />
          <div className="skeleton-line h-12" />
        </div>
      </section>

      <section className="interviews-section">
        {cards.map((card) => (
          <div key={card} className="skeleton-card">
            <div className="skeleton-line size-20 rounded-full" />
            <div className="skeleton-line h-7 w-3/4" />
            <div className="skeleton-line h-4 w-1/2" />
            <div className="skeleton-line h-16 w-full" />
            <div className="skeleton-line h-10 w-36 self-end" />
          </div>
        ))}
      </section>
    </div>
  );
}
