import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn, getRandomInterviewCover } from "@/lib/utils";

const InterviewCard = ({
  interviewId,
  role,
  type,
  techstack,
  createdAt,
  feedback,
}: InterviewCardProps) => {
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = feedback?.createdAt || createdAt
    ? dayjs(feedback?.createdAt || createdAt).format("MMM D, YYYY")
    : "N/A";

  return (
    <div className="card-border interview-card-frame">
      <div className="card-interview">
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
              badgeColor
            )}
          >
            <p className="badge-text ">{normalizedType}</p>
          </div>

          {/* Cover Image */}
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-full object-cover size-[90px] max-sm:size-16"
          />

          {/* Interview Role */}
          <h3 className="mt-5 capitalize leading-tight">{role} Interview</h3>

          {/* Date & Score */}
          <div className="flex flex-row flex-wrap gap-4 mt-3">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                width={22}
                height={22}
                alt="calendar"
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row gap-2 items-center">
              <Image src="/star.svg" width={22} height={22} alt="star" />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          {/* Feedback or Placeholder Text */}
          <p className="line-clamp-2 mt-5">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>

        <div className="flex flex-row justify-between gap-4 items-end max-sm:flex-col max-sm:items-stretch">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary card-action max-sm:w-full">
            <Link
              className="max-sm:flex max-sm:w-full max-sm:justify-center"
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
              data-umami-event={feedback ? "view_feedback" : "view_interview"}
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
