import { redirect } from "next/navigation";

import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbacksByUserId,
  getInterviewsByUserId,
} from "@/lib/actions/general.action";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [interviews, feedbacks] = await Promise.all([
    getInterviewsByUserId(user.id),
    getFeedbacksByUserId(user.id),
  ]);

  const averageScore = feedbacks.length
    ? Math.round(
        feedbacks.reduce((total, feedback) => total + feedback.totalScore, 0) /
          feedbacks.length
      )
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <ProfileForm user={user} />

      <aside className="dashboard-panel h-fit">
        <h2>Practice Stats</h2>
        <div className="grid gap-3">
          <p>Interviews created: {interviews?.length || 0}</p>
          <p>Feedback reports: {feedbacks.length}</p>
          <p>Average score: {averageScore ?? "N/A"}</p>
        </div>
      </aside>
    </div>
  );
}
