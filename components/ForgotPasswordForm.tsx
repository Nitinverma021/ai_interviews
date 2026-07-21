"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "@/firebase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/FormField";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;
  const isSubmitSuccessful = form.formState.isSubmitSuccessful;

  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: `${window.location.origin}/sign-in`,
        handleCodeInApp: false,
      });

      toast.success("Password reset email sent.");
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error(
        "Could not send reset email. Please check the email and try again."
      );
    }
  };

  return (
    <div className="card-border auth-card-shell lg:min-w-[566px]">
      <div className="auth-card flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h3>Reset your password</h3>
          <p>
            Enter your account email and we&apos;ll send you a secure reset
            link.
          </p>
          <p className="text-sm text-light-100/80">
            Can&apos;t find it? Check your Spam, Junk, or Promotions folder.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-2 form"
          >
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
              disabled={isSubmitting}
            />

            <Button
              className="btn"
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              data-umami-event="forgot_password"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>

        {isSubmitSuccessful && (
          <p className="rounded-2xl border border-success-100/30 bg-success-100/10 p-4 text-center text-sm">
            If an account exists for that email, a reset link has been sent.
          </p>
        )}

        <p className="text-center">
          Remember your password?
          <Link href="/sign-in" className="font-bold text-user-primary ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
