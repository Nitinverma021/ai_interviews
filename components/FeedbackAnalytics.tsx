export default function FeedbackAnalytics({
  feedbacks,
}: {
  feedbacks: Feedback[];
}) {
  const latest = feedbacks[0];
  const previous = feedbacks[1];
  const average = feedbacks.length
    ? Math.round(
        feedbacks.reduce((total, feedback) => total + feedback.totalScore, 0) /
          feedbacks.length
      )
    : null;
  const delta =
    latest && previous ? latest.totalScore - previous.totalScore : null;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="dashboard-panel metric-card">
        <p>Average Score</p>
        <h2>{average ?? "N/A"}</h2>
      </div>
      <div className="dashboard-panel metric-card">
        <p>Latest Score</p>
        <h2>{latest?.totalScore ?? "N/A"}</h2>
      </div>
      <div className="dashboard-panel metric-card">
        <p>Latest Change</p>
        <h2>
          {delta === null ? "N/A" : delta > 0 ? `+${delta}` : String(delta)}
        </h2>
      </div>
    </section>
  );
}
