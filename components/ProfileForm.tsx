"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/lib/actions/auth.action";

export default function ProfileForm({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="dashboard-panel"
      action={(formData) => {
        startTransition(async () => {
          const result = await updateUserProfile({
            userId: user.id,
            name: String(formData.get("name") || ""),
            targetRole: String(formData.get("targetRole") || ""),
            experienceLevel: String(formData.get("experienceLevel") || ""),
            preferredTechStack: String(formData.get("preferredTechStack") || ""),
          });

          if (result.success) toast.success(result.message);
          else toast.error(result.message);
        });
      }}
    >
      <div>
        <h2>Profile</h2>
        <p>Keep your interview practice tuned to your goals.</p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-light-100">Name</span>
        <Input name="name" defaultValue={user.name} className="input" />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-light-100">Target Role</span>
        <Input
          name="targetRole"
          defaultValue={user.targetRole}
          className="input"
          placeholder="Frontend Developer"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-light-100">Experience Level</span>
        <Input
          name="experienceLevel"
          defaultValue={user.experienceLevel}
          className="input"
          placeholder="Junior, Mid, Senior"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm text-light-100">Preferred Tech Stack</span>
        <Input
          name="preferredTechStack"
          defaultValue={user.preferredTechStack}
          className="input"
          placeholder="React, Next.js, Firebase"
        />
      </label>

      <Button
        type="submit"
        className="btn-primary"
        disabled={isPending}
        data-umami-event="update_profile"
      >
        {isPending ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
