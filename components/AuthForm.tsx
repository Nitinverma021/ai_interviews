"use client";

import { z } from "zod";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AuthError,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { clientEnv } from "@/lib/env.client";
import { signIn, signInWithGoogle, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            context?: "signin" | "signup" | "use";
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: () => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            prompt?: string;
            callback: (response: GoogleTokenResponse) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

function getAuthErrorMessage(error: unknown) {
  const authError = error as Partial<AuthError>;

  if (authError.code) {
    return `${authError.code}: ${authError.message || "Google sign in failed."}`;
  }

  return "Google sign in failed. Please try again.";
}

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isOneTapReady, setIsOneTapReady] = useState(false);
  const googleClientId = clientEnv.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const isSignIn = type === "sign-in";

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const isSubmitting = form.formState.isSubmitting;
  const isBusy = isSubmitting || isGoogleLoading;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const completeGoogleSignIn = useCallback(
    async (userCredential: UserCredential) => {
      const idToken = await userCredential.user.getIdToken();
      const result = await signInWithGoogle({
        uid: userCredential.user.uid,
        name: userCredential.user.displayName || "Google User",
        email: userCredential.user.email || "",
        idToken,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/");
    },
    [router]
  );

  const handleGooglePopup = async () => {
    try {
      setIsGoogleLoading(true);

      if (!googleClientId || !window.google?.accounts.oauth2) {
        toast.error("Google sign in is not ready. Please refresh and try again.");
        return;
      }

      const accessToken = await new Promise<string>((resolve, reject) => {
        const tokenClient = window.google!.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: "email profile",
          prompt: "select_account",
          callback: (response) => {
            if (response.error) {
              reject(
                new Error(response.error_description || response.error)
              );
              return;
            }

            if (!response.access_token) {
              reject(new Error("Google did not return an access token."));
              return;
            }

            resolve(response.access_token);
          },
        });

        tokenClient.requestAccessToken();
      });

      const credential = GoogleAuthProvider.credential(null, accessToken);
      const userCredential = await signInWithCredential(auth, credential);
      await completeGoogleSignIn(userCredential);
    } catch (error) {
      console.error(error);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId || !isOneTapReady || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      context: isSignIn ? "signin" : "signup",
      cancel_on_tap_outside: true,
      callback: async (response) => {
        if (!response.credential) return;

        try {
          const credential = GoogleAuthProvider.credential(
            response.credential
          );
          const userCredential = await signInWithCredential(auth, credential);
          await completeGoogleSignIn(userCredential);
        } catch (error) {
          console.error(error);
          toast.error(getAuthErrorMessage(error));
        }
      },
    });

    window.google.accounts.id.prompt();
  }, [completeGoogleSignIn, googleClientId, isOneTapReady, isSignIn]);

  return (
    <div className="card-border lg:min-w-[566px]">
      {googleClientId && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => setIsOneTapReady(true)}
        />
      )}

      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
                disabled={isBusy}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
              disabled={isBusy}
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              disabled={isBusy}
            />

            {isSignIn && (
              <div className="-mt-3 flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-primary-200 transition-colors hover:text-primary-100"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              className="btn"
              type="submit"
              disabled={isBusy}
              aria-busy={isSubmitting}
              data-umami-event={isSignIn ? "signin" : "signup"}
            >
              {isSubmitting
                ? isSignIn
                  ? "Signing in..."
                  : "Creating..."
                : isSignIn
                  ? "Sign In"
                  : "Create an Account"}
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-light-800" />
          <span className="text-sm text-light-100">or</span>
          <div className="h-px flex-1 bg-light-800" />
        </div>

        <Button
          type="button"
          className="btn-secondary w-full"
          onClick={handleGooglePopup}
          disabled={isBusy}
          aria-busy={isGoogleLoading}
          data-umami-event="google_signin"
        >
          <Image src="/globe.svg" alt="" width={18} height={18} />
          {isGoogleLoading ? "Connecting..." : "Continue with Google"}
        </Button>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
