"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth.action";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className="btn-secondary"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await signOut();
          toast.success("Signed out.");
          router.push("/sign-in");
          router.refresh();
        });
      }}
      data-umami-event="logout"
    >
      <LogOut />
      {isPending ? "Signing out..." : "Logout"}
    </Button>
  );
}
