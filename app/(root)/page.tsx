import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import DashboardFilters from "@/components/DashboardFilters";
import FeedbackAnalytics from "@/components/FeedbackAnalytics";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbacksByUserId,
  getFeedbacksByInterviewIds,
} from "@/lib/actions/general.action";

function filterInterviews(
  interviews: Interview[] | null,
  filters: DashboardSearchParams,
  feedbackByInterviewId = new Map<string, Feedback>()
) {
  const minScore = filters.minScore ? Number(filters.minScore) : null;
  const from = filters.from ? new Date(filters.from) : null;
  const to = filters.to ? new Date(filters.to) : null;

  return (interviews || []).filter((interview) => {
    const roleMatch =
      !filters.role ||
      interview.role.toLowerCase().includes(filters.role.toLowerCase());
    const typeMatch =
      !filters.type ||
      interview.type.toLowerCase().includes(filters.type.toLowerCase());
    const techMatch =
      !filters.tech ||
      interview.techstack.some((tech) =>
        tech.toLowerCase().includes(filters.tech!.toLowerCase())
      );
    const interviewDate = new Date(interview.createdAt);
    const fromMatch = !from || interviewDate >= from;
    const toMatch = !to || interviewDate <= to;
    const feedback = feedbackByInterviewId.get(interview.id);
    const scoreMatch =
      minScore === null || (feedback?.totalScore ?? -1) >= minScore;

    return roleMatch && typeMatch && techMatch && fromMatch && toMatch && scoreMatch;
  });
}

async function Home({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const filters = await searchParams;
  const [userInterviews, allInterview, analyticsFeedbacks] = await Promise.all([
    getInterviewsByUserId(user.id).catch((error) => {
      console.error("Failed to load user interviews:", error);
      return [];
    }),
    getLatestInterviews({ userId: user.id }).catch((error) => {
      console.error("Failed to load latest interviews:", error);
      return [];
    }),
    getFeedbacksByUserId(user.id).catch((error) => {
      console.error("Failed to load feedback analytics:", error);
      return [];
    }),
  ]);

  const allLoadedInterviews = [...(userInterviews || []), ...(allInterview || [])];
  const cardFeedbacks = await getFeedbacksByInterviewIds({
    userId: user.id,
    interviewIds: allLoadedInterviews.map((interview) => interview.id),
  }).catch((error) => {
    console.error("Failed to load interview card feedback:", error);
    return [];
  });

  const feedbackByInterviewId = new Map(
    cardFeedbacks.map((feedback) => [feedback.interviewId, feedback])
  );
  const analyticsFeedbackById = new Map(
    analyticsFeedbacks.map((feedback) => [feedback.id, feedback])
  );
  cardFeedbacks.forEach((feedback) => {
    analyticsFeedbackById.set(feedback.id, feedback);
  });
  const feedbacks = Array.from(analyticsFeedbackById.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  const filteredUserInterviews = filterInterviews(
    userInterviews,
    filters,
    feedbackByInterviewId
  );
  const filteredAllInterviews = filterInterviews(allInterview, {
    ...filters,
    minScore: undefined,
  });
  const hasPastInterviews = Boolean(filteredUserInterviews.length);
  const hasUpcomingInterviews = Boolean(filteredAllInterviews.length);

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-200">
              Welcome back, {user.name}
            </p>
            <h1>Get interview-ready with focused AI practice</h1>
          </div>
          <p className="text-lg">
            Practice real interview questions, track your score, and improve
            your answers with structured feedback.
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview" data-umami-event="start_interview">
              Start an Interview
            </Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <FeedbackAnalytics feedbacks={feedbacks} />

      <DashboardFilters filters={filters} />

      <section className="flex flex-col gap-6 mt-8">
        <div className="section-heading">
          <div>
            <h2>Your Interviews</h2>
            <p>Review past practice and continue improving.</p>
          </div>
          <span>{filteredUserInterviews.length} total</span>
        </div>

        <div className="interviews-section">
          {hasPastInterviews ? (
            filteredUserInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={feedbackByInterviewId.get(interview.id)}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <div className="section-heading">
          <div>
            <h2>Take Interviews</h2>
            <p>Try interviews shared by the PrepWise community.</p>
          </div>
          <span>{filteredAllInterviews.length} available</span>
        </div>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            filteredAllInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={feedbackByInterviewId.get(interview.id)}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
