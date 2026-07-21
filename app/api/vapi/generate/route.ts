import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { headers } from "next/headers";
import { z } from "zod";

import { getAdminDb } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limit";

const generateInterviewSchema = z.object({
  type: z.string().trim().min(1).max(40),
  role: z.string().trim().min(2).max(80),
  level: z.string().trim().min(2).max(40),
  techstack: z.string().trim().min(1).max(200),
  amount: z.coerce.number().int().min(1).max(10),
  userid: z.string().trim().min(1),
});

const generatedQuestionsSchema = z.object({
  questions: z.array(z.string().trim().min(8)).min(1).max(10),
});

function getClientKey(requestHeaders: Headers, userId: string) {
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0];
  const realIp = requestHeaders.get("x-real-ip");

  return `${userId}:${forwardedFor || realIp || "unknown"}`;
}

export async function POST(request: Request) {
  try {
    const body = generateInterviewSchema.parse(await request.json());
    const requestHeaders = await headers();
    const rateLimit = checkRateLimit(getClientKey(requestHeaders, body.userid), {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return Response.json(
        { success: false, error: "Too many interview generation requests." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: generatedQuestionsSchema,
      prompt: `Prepare questions for a job interview.
        The job role is ${body.role}.
        The job experience level is ${body.level}.
        The tech stack used in the job is: ${body.techstack}.
        The focus between behavioural and technical questions should lean towards: ${body.type}.
        The amount of questions required is: ${body.amount}.
        Return exactly ${body.amount} questions.
        The questions are going to be read by a voice assistant, so avoid special characters that can interrupt speech.
        
        Thank you!
    `,
    });

    const interview = {
      role: body.role,
      type: body.type,
      level: body.level,
      techstack: body.techstack.split(",").map((tech) => tech.trim()),
      questions: object.questions,
      userId: body.userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await getAdminDb().collection("interviews").add(interview);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof z.ZodError) {
      return Response.json(
        { success: false, error: "Invalid interview generation request." },
        { status: 400 }
      );
    }

    return Response.json(
      { success: false, error: "Failed to generate interview." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
