"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const lastMessage = messages.at(-1)?.content;

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi error:", error);
      setCallError(error.message || "Voice call failed. Please try again.");
      setCallStatus(CallStatus.INACTIVE);
      toast.error("Voice call failed. Please try again.");
    };

    if (!vapi) return;

    const vapiClient = vapi;

    vapiClient.on("call-start", onCallStart);
    vapiClient.on("call-end", onCallEnd);
    vapiClient.on("message", onMessage);
    vapiClient.on("speech-start", onSpeechStart);
    vapiClient.on("speech-end", onSpeechEnd);
    vapiClient.on("error", onError);

    return () => {
      vapiClient.off("call-start", onCallStart);
      vapiClient.off("call-end", onCallEnd);
      vapiClient.off("message", onMessage);
      vapiClient.off("speech-start", onSpeechStart);
      vapiClient.off("speech-end", onSpeechEnd);
      vapiClient.off("error", onError);
    };
  }, []);

  useEffect(() => {
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      if (!interviewId || !userId || messages.length === 0) {
        router.push("/");
        return;
      }

      const { success, feedbackId: id } = await createFeedback({
        interviewId,
        userId,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallError(null);

    if (!vapi) {
      setCallError("Missing NEXT_PUBLIC_VAPI_WEB_TOKEN.");
      toast.error("Voice interviews are not configured yet.");
      setCallStatus(CallStatus.INACTIVE);
      return;
    }

    try {
      setCallStatus(CallStatus.CONNECTING);

      if (type === "generate") {
        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        if (!workflowId) {
          setCallError("Missing NEXT_PUBLIC_VAPI_WORKFLOW_ID.");
          toast.error("Interview generation workflow is not configured.");
          setCallStatus(CallStatus.INACTIVE);
          return;
        }

        await vapi.start(workflowId, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        const formattedQuestions = questions?.length
          ? questions.map((question) => `- ${question}`).join("\n")
          : "Ask the candidate relevant questions for this interview.";

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (error) {
      console.error("Failed to start Vapi call:", error);
      setCallError(
        error instanceof Error
          ? error.message
          : "Could not start the voice call."
      );
      setCallStatus(CallStatus.INACTIVE);
      toast.error("Could not start the voice call.");
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi?.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage ?? ""}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        <div className="flex flex-col items-center gap-3">
          {!vapi && (
            <p className="text-center">
              Voice interviews are not configured yet.
            </p>
          )}

          {callError && (
            <p className="max-w-xl text-center text-destructive-100">
              {callError}
            </p>
          )}

          {callStatus !== "ACTIVE" ? (
            <button
              className="relative btn-call disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => handleCall()}
              disabled={!vapi || callStatus === "CONNECTING"}
              data-umami-event={
                type === "generate"
                  ? "generate_interview"
                  : "start_voice_interview"
              }
            >
              <span
                className={cn(
                  "absolute animate-ping rounded-full opacity-75",
                  callStatus !== "CONNECTING" && "hidden"
                )}
              />

              <span className="relative">
                {callStatus === "INACTIVE" || callStatus === "FINISHED"
                  ? "Call"
                  : "Connecting..."}
              </span>
            </button>
          ) : (
            <button
              className="btn-disconnect"
              onClick={() => handleDisconnect()}
              data-umami-event="finish_interview"
            >
              End
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Agent;
